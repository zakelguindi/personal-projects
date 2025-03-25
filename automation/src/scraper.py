import asyncio
import aiohttp
import yt_dlp
import json
import logging
from pathlib import Path
from typing import List, Optional
import os
from .utils import load_config

class ContentScraper:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the content scraper with configuration."""
        # Load configuration
        self.config = load_config(config_path)
        
        # Get API key from environment
        self.pexels_api_key = os.getenv('PEXELS_API_KEY')
        if not self.pexels_api_key:
            raise ValueError("PEXELS_API_KEY environment variable is not set")
        
        # Get content sources from environment
        self.youtube_channels = os.getenv('YOUTUBE_CHANNELS', '').split(',')
        self.search_queries = os.getenv('SEARCH_QUERIES', '').split(',')
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
        
        # Create content directory
        self.content_dir = Path(__file__).resolve().parent.parent / 'content'
        self.content_dir.mkdir(exist_ok=True)
        
        # Initialize session
        self.session = None

    async def __aenter__(self):
        """Create aiohttp session when entering context."""
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close aiohttp session when exiting context."""
        if self.session:
            await self.session.close()

    async def get_content(self) -> List[str]:
        """Get content from all configured sources."""
        video_paths = []
        
        try:
            # Get videos from YouTube
            youtube_videos = await self._get_youtube_videos()
            video_paths.extend(youtube_videos)
            
            # Get videos from Pexels
            pexels_videos = await self._get_pexels_videos()
            video_paths.extend(pexels_videos)
            
            self.logger.info(f"Successfully acquired {len(video_paths)} videos")
            return video_paths
            
        except Exception as e:
            self.logger.error(f"Error acquiring content: {str(e)}")
            return []

    async def _get_youtube_videos(self) -> List[str]:
        """Download videos from YouTube channels."""
        video_paths = []
        
        for channel_id in self.youtube_channels:
            try:
                channel_url = f"https://www.youtube.com/channel/{channel_id}"
                ydl_opts = {
                    'format': 'best[height<=1080]',
                    'outtmpl': str(self.content_dir / '%(title)s.%(ext)s'),
                    'quiet': True
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(channel_url, download=True)
                    if info:
                        video_paths.append(str(self.content_dir / f"{info['title']}.{info['ext']}"))
                
            except Exception as e:
                self.logger.error(f"Error downloading from YouTube channel {channel_id}: {str(e)}")
        
        return video_paths

    async def _get_pexels_videos(self) -> List[str]:
        """Fetch videos from Pexels."""
        video_paths = []
        
        for query in self.search_queries:
            try:
                url = f"https://api.pexels.com/videos/search?query={query}&per_page=5"
                headers = {"Authorization": self.pexels_api_key}
                
                async with aiohttp.ClientSession() as session:
                    async with session.get(url, headers=headers) as response:
                        if response.status == 200:
                            data = await response.json()
                            for video in data.get('videos', []):
                                video_url = video['video_files'][0]['link']
                                video_path = await self._download_pexels_video(video_url)
                                if video_path:
                                    video_paths.append(video_path)
                
            except Exception as e:
                self.logger.error(f"Error fetching from Pexels for query '{query}': {str(e)}")
        
        return video_paths

    async def _download_pexels_video(self, video_url: str) -> Optional[str]:
        """Download a video from Pexels."""
        try:
            filename = f"pexels_{Path(video_url).stem}.mp4"
            output_path = self.content_dir / filename
            
            async with aiohttp.ClientSession() as session:
                async with session.get(video_url) as response:
                    if response.status == 200:
                        with open(output_path, 'wb') as f:
                            while True:
                                chunk = await response.content.read(8192)
                                if not chunk:
                                    break
                                f.write(chunk)
                        return str(output_path)
            
            return None
            
        except Exception as e:
            self.logger.error(f"Error downloading Pexels video: {str(e)}")
            return None

async def main():
    scraper = ContentScraper()
    video_paths = await scraper.get_content()
    logger.info(f"Successfully downloaded {len(video_paths)} videos")
    return video_paths

if __name__ == "__main__":
    asyncio.run(main()) 