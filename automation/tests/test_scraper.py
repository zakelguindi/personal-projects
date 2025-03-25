import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from scraper import ContentScraper

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def scraper(test_config):
    """Create a ContentScraper instance with test configuration."""
    with patch('scraper.json.load') as mock_load:
        mock_load.return_value = test_config
        return ContentScraper()

@pytest.mark.asyncio
async def test_download_youtube_video(scraper):
    """Test downloading a YouTube video."""
    with patch('scraper.yt_dlp.YoutubeDL') as mock_ytdl:
        # Configure mock
        mock_ytdl_instance = MagicMock()
        mock_ytdl.return_value = mock_ytdl_instance
        mock_ytdl_instance.download.return_value = 0
        
        # Test video URL
        video_url = "https://www.youtube.com/watch?v=test123"
        
        # Call function
        result = await scraper._download_youtube_video(video_url)
        
        # Verify
        assert result is not None
        mock_ytdl_instance.download.assert_called_once_with([video_url])

@pytest.mark.asyncio
async def test_fetch_pexels_video(scraper):
    """Test fetching a video from Pexels."""
    with patch('scraper.aiohttp.ClientSession') as mock_session:
        # Configure mock
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.json.return_value = {
            "videos": [{
                "video_files": [{
                    "link": "https://test.com/video.mp4",
                    "width": 1920,
                    "height": 1080
                }]
            }]
        }
        mock_session.return_value.__aenter__.return_value.get.return_value.__aenter__.return_value = mock_response
        
        # Test query
        query = "test query"
        
        # Call function
        result = await scraper._fetch_pexels_video(query)
        
        # Verify
        assert result is not None
        assert "link" in result
        assert result["width"] == 1920
        assert result["height"] == 1080

@pytest.mark.asyncio
async def test_get_content(scraper):
    """Test getting content from all sources."""
    with patch('scraper._download_youtube_video') as mock_youtube, \
         patch('scraper._fetch_pexels_video') as mock_pexels:
        # Configure mocks
        mock_youtube.return_value = "youtube_video.mp4"
        mock_pexels.return_value = {
            "link": "pexels_video.mp4",
            "width": 1920,
            "height": 1080
        }
        
        # Call function
        results = await scraper.get_content()
        
        # Verify
        assert len(results) > 0
        assert "youtube_video.mp4" in results
        assert "pexels_video.mp4" in results

@pytest.mark.asyncio
async def test_get_content_error_handling(scraper):
    """Test error handling in get_content."""
    with patch('scraper._download_youtube_video') as mock_youtube, \
         patch('scraper._fetch_pexels_video') as mock_pexels:
        # Configure mocks to raise exceptions
        mock_youtube.side_effect = Exception("YouTube error")
        mock_pexels.side_effect = Exception("Pexels error")
        
        # Call function
        results = await scraper.get_content()
        
        # Verify
        assert len(results) == 0 