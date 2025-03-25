import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from video_processor import VideoProcessor

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def processor(test_config):
    """Create a VideoProcessor instance with test configuration."""
    with patch('video_processor.json.load') as mock_load:
        mock_load.return_value = test_config
        return VideoProcessor()

@pytest.mark.asyncio
async def test_run_ffmpeg_command(processor):
    """Test running an FFmpeg command."""
    with patch('video_processor.asyncio.create_subprocess_exec') as mock_subprocess:
        # Configure mock
        mock_process = MagicMock()
        mock_process.returncode = 0
        mock_process.communicate.return_value = (b"", b"")
        mock_subprocess.return_value = mock_process
        
        # Test command
        command = ['ffmpeg', '-i', 'input.mp4', 'output.mp4']
        
        # Call function
        await processor._run_ffmpeg_command(command)
        
        # Verify
        mock_subprocess.assert_called_once()
        mock_process.communicate.assert_called_once()

@pytest.mark.asyncio
async def test_run_ffmpeg_command_error(processor):
    """Test error handling in FFmpeg command execution."""
    with patch('video_processor.asyncio.create_subprocess_exec') as mock_subprocess:
        # Configure mock to simulate error
        mock_process = MagicMock()
        mock_process.returncode = 1
        mock_process.communicate.return_value = (b"", b"Error message")
        mock_subprocess.return_value = mock_process
        
        # Test command
        command = ['ffmpeg', '-i', 'input.mp4', 'output.mp4']
        
        # Verify exception is raised
        with pytest.raises(Exception) as exc_info:
            await processor._run_ffmpeg_command(command)
        assert "FFmpeg error" in str(exc_info.value)

@pytest.mark.asyncio
async def test_process_video(processor):
    """Test processing a single video."""
    with patch('video_processor.VideoProcessor._get_video_duration') as mock_duration, \
         patch('video_processor.VideoProcessor._run_ffmpeg_command') as mock_ffmpeg:
        # Configure mocks
        mock_duration.return_value = 15.0  # Video duration in seconds
        
        # Test video path
        video_path = "test_video.mp4"
        
        # Call function
        result = await processor.process_video(video_path)
        
        # Verify
        assert result is not None
        mock_ffmpeg.assert_called_once()

@pytest.mark.asyncio
async def test_add_watermark(processor):
    """Test adding watermark to video."""
    with patch('video_processor.VideoProcessor._run_ffmpeg_command') as mock_ffmpeg:
        # Test paths
        input_path = "input.mp4"
        output_path = "output.mp4"
        
        # Call function
        await processor.add_watermark(input_path, output_path)
        
        # Verify
        mock_ffmpeg.assert_called_once()

@pytest.mark.asyncio
async def test_add_subtitles(processor):
    """Test adding subtitles to video."""
    with patch('video_processor.VideoProcessor._run_ffmpeg_command') as mock_ffmpeg:
        # Test paths
        video_path = "input.mp4"
        subtitle_path = "subtitles.srt"
        output_path = "output.mp4"
        
        # Call function
        await processor.add_subtitles(video_path, subtitle_path, output_path)
        
        # Verify
        mock_ffmpeg.assert_called_once()

@pytest.mark.asyncio
async def test_process_videos(processor):
    """Test processing multiple videos."""
    with patch('video_processor.VideoProcessor.process_video') as mock_process:
        # Configure mock
        mock_process.return_value = "processed_video.mp4"
        
        # Test video paths
        video_paths = ["video1.mp4", "video2.mp4"]
        
        # Call function
        results = await processor.process_videos(video_paths)
        
        # Verify
        assert len(results) == 2
        assert mock_process.call_count == 2

@pytest.mark.asyncio
async def test_process_videos_error_handling(processor):
    """Test error handling in processing multiple videos."""
    with patch('video_processor.VideoProcessor.process_video') as mock_process:
        # Configure mock to simulate error
        mock_process.side_effect = Exception("Processing error")
        
        # Test video paths
        video_paths = ["video1.mp4", "video2.mp4"]
        
        # Call function
        results = await processor.process_videos(video_paths)
        
        # Verify
        assert len(results) == 0
        assert mock_process.call_count == 2 