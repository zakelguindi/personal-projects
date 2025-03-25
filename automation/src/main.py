"""
Main module for TikTok content automation.
"""

import asyncio
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from src.scraper import ContentScraper
from src.video_processor import VideoProcessor
from src.transcription import TranscriptionService
from src.caption_generator import CaptionGenerator
from src.upload import TikTokUploader
from src.logger import AutomationLogger
from src.utils import load_config

class TikTokAutomation:
    def __init__(self):
        """Initialize the automation system."""
        self.config = load_config()
        self.logger = AutomationLogger()
        self.scraper = ContentScraper()
        self.processor = VideoProcessor()
        self.transcriber = TranscriptionService()
        self.caption_generator = CaptionGenerator()
        self.uploader = TikTokUploader()
        
        # Set up logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('automation.log'),
                logging.StreamHandler()
            ]
        )
        self.log = logging.getLogger(__name__)

    async def run(self):
        """Run the automation process."""
        try:
            # Log start
            await self.logger.log_event("Process started", "info")
            self.log.info("Starting TikTok content automation process")

            # Acquire content
            self.log.info("Acquiring content from sources")
            video_paths = await self.scraper.get_content()
            
            if not video_paths:
                raise Exception("No videos were acquired")
                
            await self.logger.log_event(f"Acquired {len(video_paths)} videos", "success")
            self.log.info(f"Acquired {len(video_paths)} videos")

            # Process videos
            self.log.info("Processing videos")
            processed_videos = []
            for video_path in video_paths:
                try:
                    # Process video
                    processed_path = await self.processor.process_video(video_path)
                    if processed_path:
                        processed_videos.append(processed_path)
                except Exception as e:
                    self.log.error(f"Error processing video {video_path}: {str(e)}")
                    continue

            if not processed_videos:
                raise Exception("No videos were processed successfully")

            # Transcribe videos
            self.log.info("Transcribing videos")
            subtitle_paths = []
            for video_path in processed_videos:
                try:
                    subtitle_path = await self.transcriber.transcribe_video(video_path)
                    if subtitle_path:
                        subtitle_paths.append(subtitle_path)
                except Exception as e:
                    self.log.error(f"Error transcribing video {video_path}: {str(e)}")
                    continue

            if not subtitle_paths:
                raise Exception("No videos were transcribed successfully")

            # Generate captions
            self.log.info("Generating captions")
            captions = []
            for video_path, subtitle_path in zip(processed_videos, subtitle_paths):
                try:
                    caption, hashtags = await self.caption_generator.generate_caption(
                        video_path, subtitle_path
                    )
                    if caption and hashtags:
                        captions.append((video_path, caption, hashtags))
                except Exception as e:
                    self.log.error(f"Error generating caption for {video_path}: {str(e)}")
                    continue

            if not captions:
                raise Exception("No captions were generated successfully")

            # Upload videos
            self.log.info("Uploading videos")
            for video_path, caption, hashtags in captions:
                try:
                    success = await self.uploader.upload_video(video_path, caption, hashtags)
                    if success:
                        await self.logger.log_event(
                            f"Successfully uploaded {video_path}",
                            "success"
                        )
                except Exception as e:
                    self.log.error(f"Error uploading video {video_path}: {str(e)}")
                    continue

            # Log completion
            await self.logger.log_event("Process completed successfully", "success")
            self.log.info("TikTok content automation process completed")

        except Exception as e:
            error_msg = f"Error in automation process: {str(e)}"
            await self.logger.log_event(error_msg, "error")
            self.log.error(error_msg)
            raise

async def main():
    """Main entry point."""
    try:
        automation = TikTokAutomation()
        await automation.run()
    except Exception as e:
        logging.error(f"Fatal error: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main()) 