import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from src.upload import TikTokUploader

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def uploader(test_config):
    """Create a TikTokUploader instance with test configuration."""
    with patch('src.upload.json.load') as mock_load:
        mock_load.return_value = test_config
        return TikTokUploader()

@pytest.mark.asyncio
async def test_upload_video(uploader):
    """Test uploading a single video to TikTok."""
    with patch('src.upload.asyncio.create_subprocess_exec') as mock_subprocess:
        # Configure mock
        mock_process = MagicMock()
        mock_process.returncode = 0
        mock_process.communicate.return_value = (b"Success", b"")
        mock_subprocess.return_value = mock_process
        
        # Test data
        video_path = "test_video.mp4"
        caption = "Test caption"
        hashtags = ["#test", "#viral"]
        
        # Call function
        success = await uploader.upload_video(video_path, caption, hashtags)
        
        # Verify
        assert success is True
        mock_subprocess.assert_called_once()
        mock_process.communicate.assert_called_once()

@pytest.mark.asyncio
async def test_upload_video_error(uploader):
    """Test error handling in video upload."""
    with patch('src.upload.asyncio.create_subprocess_exec') as mock_subprocess:
        # Configure mock to simulate error
        mock_process = MagicMock()
        mock_process.returncode = 1
        mock_process.communicate.return_value = (b"", b"Upload error")
        mock_subprocess.return_value = mock_process
        
        # Test data
        video_path = "test_video.mp4"
        caption = "Test caption"
        hashtags = ["#test", "#viral"]
        
        # Call function
        success = await uploader.upload_video(video_path, caption, hashtags)
        
        # Verify
        assert success is False
        mock_subprocess.assert_called_once()

@pytest.mark.asyncio
async def test_upload_videos(uploader):
    """Test uploading multiple videos to TikTok."""
    with patch('src.upload.TikTokUploader.upload_video') as mock_upload:
        # Configure mock
        mock_upload.return_value = True
        
        # Test data
        videos = [
            ("video1.mp4", "Caption 1", ["#test1", "#viral"]),
            ("video2.mp4", "Caption 2", ["#test2", "#viral"])
        ]
        
        # Call function
        results = await uploader.upload_videos(videos)
        
        # Verify
        assert len(results) == 2
        assert all(results)
        assert mock_upload.call_count == 2

@pytest.mark.asyncio
async def test_upload_videos_error_handling(uploader):
    """Test error handling in uploading multiple videos."""
    with patch('src.upload.TikTokUploader.upload_video') as mock_upload:
        # Configure mock to simulate error
        mock_upload.side_effect = Exception("Upload error")
        
        # Test data
        videos = [
            ("video1.mp4", "Caption 1", ["#test1", "#viral"]),
            ("video2.mp4", "Caption 2", ["#test2", "#viral"])
        ]
        
        # Call function
        results = await uploader.upload_videos(videos)
        
        # Verify
        assert len(results) == 2
        assert not any(results)
        assert mock_upload.call_count == 2

@pytest.mark.asyncio
async def test_upload_video_environment_variables(uploader):
    """Test environment variables are set correctly."""
    with patch('src.upload.asyncio.create_subprocess_exec') as mock_subprocess:
        # Configure mock
        mock_process = MagicMock()
        mock_process.returncode = 0
        mock_process.communicate.return_value = (b"Success", b"")
        mock_subprocess.return_value = mock_process
        
        # Test data
        video_path = "test_video.mp4"
        caption = "Test caption"
        hashtags = ["#test", "#viral"]
        
        # Call function
        await uploader.upload_video(video_path, caption, hashtags)
        
        # Verify environment variables in subprocess call
        call_args = mock_subprocess.call_args[1]
        env = call_args.get('env', {})
        assert env.get('TIKTOK_USERNAME') == 'test_user'
        assert env.get('TIKTOK_PASSWORD') == 'test_pass'

def test_format_hashtags(uploader):
    test_cases = [
        (["test", "video"], "test,video"),
        (["single"], "single"),
        ([], ""),
        (["hashtag1", "hashtag2", "hashtag3"], "hashtag1,hashtag2,hashtag3")
    ]
    
    for hashtags, expected in test_cases:
        assert uploader._format_hashtags(hashtags) == expected 