"""
Video processing module for TikTok content automation.
"""

import os
import asyncio
import logging
from pathlib import Path
from typing import Optional, List
import cv2
import numpy as np

class VideoProcessor:
    def __init__(self):
        """Initialize the video processor."""
        self.logger = logging.getLogger(__name__)
        self.processed_dir = Path('processed')
        self.processed_dir.mkdir(exist_ok=True)

    async def process_video(self, video_path: str) -> Optional[str]:
        """
        Process a single video file.
        
        Args:
            video_path: Path to the video file
            
        Returns:
            Path to the processed video file, or None if processing failed
        """
        try:
            # Verify video file exists and is readable
            if not os.path.exists(video_path):
                self.logger.error(f"Video file not found: {video_path}")
                return None

            # Open video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                self.logger.error(f"Error opening video file: {video_path}")
                return None

            # Get video properties
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            # Verify video has valid properties
            if width <= 0 or height <= 0 or fps <= 0 or total_frames <= 0:
                self.logger.error(f"Invalid video properties for {video_path}")
                cap.release()
                return None

            # Create output path
            output_path = self.processed_dir / f"processed_{Path(video_path).name}"

            # Create video writer
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(
                str(output_path),
                fourcc,
                fps,
                (width, height)
            )

            try:
                while True:
                    ret, frame = cap.read()
                    if not ret:
                        break

                    # Add watermark to frame
                    frame = self._add_watermark(frame, width, height)

                    # Write frame
                    out.write(frame)

                return str(output_path)

            except Exception as e:
                self.logger.error(f"Error processing video {video_path}: {str(e)}")
                return None

            finally:
                # Clean up
                cap.release()
                out.release()

        except Exception as e:
            self.logger.error(f"Unexpected error processing video {video_path}: {str(e)}")
            return None

    def _add_watermark(self, frame: np.ndarray, width: int, height: int) -> np.ndarray:
        """Add watermark to a frame."""
        try:
            # Create watermark text
            text = "@YourTikTokHandle"
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 1.0
            thickness = 2
            color = (255, 255, 255)  # White
            stroke_color = (0, 0, 0)  # Black

            # Get text size
            (text_width, text_height), baseline = cv2.getTextSize(
                text, font, font_scale, thickness
            )

            # Calculate position (bottom right corner)
            x = width - text_width - 10
            y = height - 10

            # Draw stroke (outline)
            cv2.putText(
                frame, text, (x, y),
                font, font_scale, stroke_color,
                thickness + 1
            )

            # Draw text
            cv2.putText(
                frame, text, (x, y),
                font, font_scale, color,
                thickness
            )

            return frame

        except Exception as e:
            self.logger.error(f"Error adding watermark: {str(e)}")
            return frame

async def main():
    processor = VideoProcessor()
    # Example usage
    video_path = 'path/to/input/video.mp4'
    processed_path = await processor.process_video(video_path)
    if processed_path:
        logging.info(f"Successfully processed video: {processed_path}")
    return processed_path

if __name__ == "__main__":
    asyncio.run(main()) 