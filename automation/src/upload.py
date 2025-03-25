import os
import asyncio
import logging
import json
import subprocess
from pathlib import Path
from typing import List, Dict, Optional
from .utils import load_config

logger = logging.getLogger(__name__)

class TikTokUploader:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the TikTok uploader with configuration."""
        # Load configuration
        self.config = load_config(config_path)
        
        # Get TikTok credentials from environment
        self.username = os.getenv('TIKTOK_USERNAME')
        self.password = os.getenv('TIKTOK_PASSWORD')
        
        if not self.username or not self.password:
            raise ValueError("TIKTOK_USERNAME and TIKTOK_PASSWORD environment variables must be set")
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
    
    async def upload_video(
        self,
        video_path: str,
        caption: str,
        hashtags: List[str]
    ) -> bool:
        """Upload a video to TikTok."""
        try:
            # Set environment variables for the Node.js script
            env = os.environ.copy()
            env.update({
                'TIKTOK_USERNAME': self.username,
                'TIKTOK_PASSWORD': self.password,
                'VIDEO_PATH': video_path,
                'CAPTION': caption,
                'HASHTAGS': ' '.join(hashtags)
            })
            
            # Run the Node.js upload script
            script_path = Path(__file__).resolve().parent.parent / 'scripts' / 'upload_tiktok.js'
            process = await asyncio.create_subprocess_exec(
                'node',
                str(script_path),
                env=env,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                self.logger.info(f"Successfully uploaded video: {video_path}")
                return True
            else:
                self.logger.error(f"Failed to upload video: {stderr.decode()}")
                return False
            
        except Exception as e:
            self.logger.error(f"Error uploading video: {str(e)}")
            return False
    
    async def upload_videos(
        self,
        video_paths: List[str],
        captions: List[str],
        hashtags_list: List[List[str]]
    ) -> List[bool]:
        """Upload multiple videos to TikTok."""
        results = []
        
        for video_path, caption, hashtags in zip(video_paths, captions, hashtags_list):
            success = await self.upload_video(video_path, caption, hashtags)
            results.append(success)
        
        return results

async def main():
    uploader = TikTokUploader()
    # Example usage
    videos = [
        {
            'path': 'path/to/video.mp4',
            'caption': 'Amazing soccer goals! 🎯',
            'hashtags': ['#soccer', '#goals', '#viral', '#fyp']
        }
    ]
    results = await uploader.upload_videos(
        [video['path'] for video in videos],
        [video['caption'] for video in videos],
        [video['hashtags'] for video in videos]
    )
    logger.info(f"Successfully uploaded {sum(results)} out of {len(results)} videos")
    return results

if __name__ == "__main__":
    asyncio.run(main()) 