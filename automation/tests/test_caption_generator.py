import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from src.caption_generator import CaptionGenerator

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def generator(test_config):
    """Create a CaptionGenerator instance with test configuration."""
    with patch('src.caption_generator.load_config') as mock_load:
        mock_load.return_value = test_config
        return CaptionGenerator()

@pytest.mark.asyncio
async def test_generate_caption(generator):
    """Test generating caption and hashtags for a video."""
    with patch('src.caption_generator.CaptionGenerator._call_api') as mock_api:
        # Configure mock
        mock_api.return_value = """
        CAPTION: Check out this amazing video! 🎥
        HASHTAGS: #viral #trending #fyp #funny #entertainment
        """
        
        # Test paths
        video_path = "test_video.mp4"
        subtitle_path = "test_subtitles.srt"
        
        # Call function
        caption, hashtags = await generator.generate_caption(video_path, subtitle_path)
        
        # Verify
        assert caption == "Check out this amazing video! 🎥"
        assert len(hashtags) == 5
        assert "#viral" in hashtags
        assert "#trending" in hashtags
        mock_api.assert_called_once()

@pytest.mark.asyncio
async def test_create_prompt(generator):
    """Test creating the API prompt."""
    # Test paths
    video_path = "test_video.mp4"
    subtitle_content = "This is a test subtitle content."
    
    # Call function
    prompt = generator._create_prompt(video_path, subtitle_content)
    
    # Verify
    assert "test_video" in prompt
    assert subtitle_content in prompt
    assert "CAPTION:" in prompt
    assert "HASHTAGS:" in prompt

@pytest.mark.asyncio
async def test_call_api(generator):
    """Test calling the OpenRouter API."""
    with patch('src.caption_generator.aiohttp.ClientSession') as mock_session:
        # Configure mock
        mock_response = MagicMock()
        mock_response.status = 200
        mock_response.json.return_value = {
            "choices": [{
                "message": {
                    "content": "Test response"
                }
            }]
        }
        mock_session.return_value.__aenter__.return_value.post.return_value.__aenter__.return_value = mock_response
        
        # Test prompt
        prompt = "Test prompt"
        
        # Call function
        result = await generator._call_api(prompt)
        
        # Verify
        assert result == "Test response"
        mock_session.return_value.__aenter__.return_value.post.assert_called_once()

@pytest.mark.asyncio
async def test_call_api_error(generator):
    """Test error handling in API call."""
    with patch('src.caption_generator.aiohttp.ClientSession') as mock_session:
        # Configure mock to simulate error
        mock_response = MagicMock()
        mock_response.status = 400
        mock_response.text.return_value = "API Error"
        mock_session.return_value.__aenter__.return_value.post.return_value.__aenter__.return_value = mock_response
        
        # Test prompt
        prompt = "Test prompt"
        
        # Verify exception is raised
        with pytest.raises(Exception) as exc_info:
            await generator._call_api(prompt)
        assert "API call failed" in str(exc_info.value)

@pytest.mark.asyncio
async def test_parse_response(generator):
    """Test parsing API response."""
    # Test response
    response = """
    CAPTION: Amazing video! 🎥
    HASHTAGS: #viral #trending #fyp
    """
    
    # Call function
    caption, hashtags = generator._parse_response(response)
    
    # Verify
    assert caption == "Amazing video! 🎥"
    assert len(hashtags) == 3
    assert "#viral" in hashtags
    assert "#trending" in hashtags
    assert "#fyp" in hashtags

@pytest.mark.asyncio
async def test_generate_captions(generator):
    """Test generating captions for multiple videos."""
    with patch('src.caption_generator.CaptionGenerator.generate_caption') as mock_generate:
        # Configure mock
        mock_generate.return_value = (
            "Test caption",
            ["#test", "#viral"]
        )
        
        # Test paths
        video_paths = ["video1.mp4", "video2.mp4"]
        subtitle_paths = ["subtitle1.srt", "subtitle2.srt"]
        
        # Call function
        results = await generator.generate_captions(video_paths, subtitle_paths)
        
        # Verify
        assert len(results) == 2
        assert mock_generate.call_count == 2
        for caption, hashtags in results:
            assert caption == "Test caption"
            assert len(hashtags) == 2

@pytest.mark.asyncio
async def test_generate_captions_error_handling(generator):
    """Test error handling in generating multiple captions."""
    with patch('src.caption_generator.CaptionGenerator.generate_caption') as mock_generate:
        # Configure mock to simulate error
        mock_generate.side_effect = Exception("Generation error")
        
        # Test paths
        video_paths = ["video1.mp4", "video2.mp4"]
        subtitle_paths = ["subtitle1.srt", "subtitle2.srt"]
        
        # Call function
        results = await generator.generate_captions(video_paths, subtitle_paths)
        
        # Verify
        assert len(results) == 2
        assert mock_generate.call_count == 2
        for caption, hashtags in results:
            assert caption == ""
            assert len(hashtags) == 0

def test_extract_hashtags(generator):
    test_cases = [
        ("Test caption with #test #video", ["test", "video"]),
        ("No hashtags here", []),
        ("#single #hashtag #test", ["single", "hashtag", "test"]),
        ("Mixed case #Test #VIDEO #mixed", ["test", "video", "mixed"])
    ]
    
    for caption, expected in test_cases:
        assert generator._extract_hashtags(caption) == expected

def test_clean_caption(generator):
    test_cases = [
        ("Test caption with #test #video", "Test caption with"),
        ("No hashtags here", "No hashtags here"),
        ("#hashtag at start", "at start"),
        ("Multiple #test #video #hashtags", "Multiple")
    ]
    
    for caption, expected in test_cases:
        assert generator._clean_caption(caption) == expected 