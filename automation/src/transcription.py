import os
import asyncio
import json
import logging
from pathlib import Path
from typing import List, Optional
import whisper
import torch
from .utils import load_config

class TranscriptionService:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the transcription service with configuration."""
        # Load configuration
        self.config = load_config(config_path)
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
        
        # Create subtitles directory
        self.subtitles_dir = Path(__file__).resolve().parent.parent / 'subtitles'
        self.subtitles_dir.mkdir(exist_ok=True)
        
        # Initialize Whisper model
        self.model = whisper.load_model("base")
        
        # Set device (GPU if available, else CPU)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    async def transcribe_videos(self, video_paths: List[str]) -> List[str]:
        """Transcribe multiple videos."""
        subtitle_paths = []
        
        for video_path in video_paths:
            try:
                subtitle_path = await self.transcribe_video(video_path)
                if subtitle_path:
                    subtitle_paths.append(subtitle_path)
            except Exception as e:
                self.logger.error(f"Error transcribing video {video_path}: {str(e)}")
        
        return subtitle_paths
    
    async def transcribe_video(self, video_path: str) -> Optional[str]:
        """Transcribe a single video."""
        try:
            # Generate subtitle path
            video_name = Path(video_path).stem
            subtitle_path = self.subtitles_dir / f"{video_name}.txt"
            
            # Run transcription in a thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._run_transcription,
                video_path,
                subtitle_path
            )
            
            if result:
                self.logger.info(f"Successfully transcribed video: {video_path}")
                return str(subtitle_path)
            else:
                self.logger.error(f"Failed to transcribe video: {video_path}")
                return None
            
        except Exception as e:
            self.logger.error(f"Error transcribing video {video_path}: {str(e)}")
            return None
    
    def _run_transcription(self, video_path: str, output_path: str) -> bool:
        """Run the Whisper transcription model."""
        try:
            # Transcribe the video
            result = self.model.transcribe(video_path)
            
            # Save transcription to file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(result['text'])
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error in transcription process: {str(e)}")
            return False

    async def _save_srt(self, result: dict, output_path: Path) -> None:
        """Save transcription results in SRT format."""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                for i, segment in enumerate(result['segments'], 1):
                    # Convert timestamps to SRT format (HH:MM:SS,mmm)
                    start = self._format_timestamp(segment['start'])
                    end = self._format_timestamp(segment['end'])
                    
                    # Write SRT entry
                    f.write(f"{i}\n")
                    f.write(f"{start} --> {end}\n")
                    f.write(f"{segment['text'].strip()}\n\n")
                    
        except Exception as e:
            self.logger.error(f"Error saving SRT file: {str(e)}")
            raise

    def _format_timestamp(self, seconds: float) -> str:
        """Convert seconds to SRT timestamp format (HH:MM:SS,mmm)."""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = seconds % 60
        milliseconds = int((seconds % 1) * 1000)
        seconds = int(seconds)
        
        return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"

async def main():
    transcriber = TranscriptionService()
    # Example usage
    video_paths = ['path/to/input/video.mp4']
    transcription_paths = await transcriber.transcribe_videos(video_paths)
    logger.info(f"Successfully transcribed {len(transcription_paths)} videos")
    return transcription_paths

if __name__ == "__main__":
    asyncio.run(main()) 