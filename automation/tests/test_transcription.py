import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from transcription import TranscriptionService

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def transcriber(test_config):
    """Create a TranscriptionService instance with test configuration."""
    with patch('transcription.json.load') as mock_load, \
         patch('transcription.whisper.load_model') as mock_model:
        mock_load.return_value = test_config
        mock_model.return_value = MagicMock()
        return TranscriptionService()

@pytest.mark.asyncio
async def test_transcribe_video(transcriber):
    """Test transcribing a single video."""
    with patch('transcription.TranscriptionService._run_transcription') as mock_transcribe, \
         patch('transcription.TranscriptionService._save_srt') as mock_save:
        # Configure mocks
        mock_transcribe.return_value = {
            "segments": [
                {
                    "start": 0.0,
                    "end": 5.0,
                    "text": "Test subtitle"
                }
            ]
        }
        
        # Test video path
        video_path = "test_video.mp4"
        
        # Call function
        result = await transcriber.transcribe_video(video_path)
        
        # Verify
        assert result is not None
        mock_transcribe.assert_called_once_with(video_path)
        mock_save.assert_called_once()

@pytest.mark.asyncio
async def test_run_transcription(transcriber):
    """Test running the transcription process."""
    with patch('transcription.asyncio.get_event_loop') as mock_loop:
        # Configure mock
        mock_executor = MagicMock()
        mock_executor.return_value = {
            "segments": [
                {
                    "start": 0.0,
                    "end": 5.0,
                    "text": "Test subtitle"
                }
            ]
        }
        mock_loop.return_value.run_in_executor.return_value = mock_executor
        
        # Test video path
        video_path = "test_video.mp4"
        
        # Call function
        result = await transcriber._run_transcription(video_path)
        
        # Verify
        assert result is not None
        assert "segments" in result
        mock_loop.return_value.run_in_executor.assert_called_once()

@pytest.mark.asyncio
async def test_save_srt(transcriber):
    """Test saving transcription results in SRT format."""
    with patch('builtins.open', create=True) as mock_open:
        # Test data
        result = {
            "segments": [
                {
                    "start": 0.0,
                    "end": 5.0,
                    "text": "Test subtitle"
                }
            ]
        }
        output_path = Path("test.srt")
        
        # Call function
        await transcriber._save_srt(result, output_path)
        
        # Verify
        mock_open.assert_called_once()
        # Verify SRT format
        mock_open.return_value.__enter__.return_value.write.assert_called()

@pytest.mark.asyncio
async def test_transcribe_videos(transcriber):
    """Test transcribing multiple videos."""
    with patch('transcription.TranscriptionService.transcribe_video') as mock_transcribe:
        # Configure mock
        mock_transcribe.return_value = "test.srt"
        
        # Test video paths
        video_paths = ["video1.mp4", "video2.mp4"]
        
        # Call function
        results = await transcriber.transcribe_videos(video_paths)
        
        # Verify
        assert len(results) == 2
        assert mock_transcribe.call_count == 2

@pytest.mark.asyncio
async def test_transcribe_videos_error_handling(transcriber):
    """Test error handling in transcribing multiple videos."""
    with patch('transcription.TranscriptionService.transcribe_video') as mock_transcribe:
        # Configure mock to simulate error
        mock_transcribe.side_effect = Exception("Transcription error")
        
        # Test video paths
        video_paths = ["video1.mp4", "video2.mp4"]
        
        # Call function
        results = await transcriber.transcribe_videos(video_paths)
        
        # Verify
        assert len(results) == 0
        assert mock_transcribe.call_count == 2 