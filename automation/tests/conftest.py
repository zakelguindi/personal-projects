import pytest
import asyncio
from pathlib import Path
import json
import os
import tempfile
import shutil
import sys

# Add the src directory to the Python path
src_path = Path(__file__).resolve().parent.parent / 'src'
sys.path.append(str(src_path))

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_config():
    """Load test configuration from test_config.json."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture(scope="function")
def temp_dir():
    """Create a temporary directory for test files."""
    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)

@pytest.fixture(scope="function")
def mock_env_vars():
    """Set up mock environment variables for testing."""
    env_vars = {
        "TIKTOK_USERNAME": "test_user",
        "TIKTOK_PASSWORD": "test_pass",
        "OPENROUTER_API_KEY": "test_key",
        "PEXELS_API_KEY": "test_key"
    }
    original_env = {}
    for key, value in env_vars.items():
        original_env[key] = os.environ.get(key)
        os.environ[key] = value
    
    yield env_vars
    
    # Restore original environment variables
    for key, value in original_env.items():
        if value is None:
            del os.environ[key]
        else:
            os.environ[key] = value

@pytest.fixture(scope="function")
def mock_files(temp_dir):
    """Create mock files for testing."""
    files = {
        "video1.mp4": b"mock video content",
        "video2.mp4": b"mock video content",
        "transcript1.srt": b"1\n00:00:00,000 --> 00:00:02,000\nTest subtitle",
        "watermark.png": b"mock image content"
    }
    
    for filename, content in files.items():
        file_path = Path(temp_dir) / filename
        file_path.write_bytes(content)
    
    return {name: str(Path(temp_dir) / name) for name in files}

@pytest.fixture(scope="function")
def mock_google_sheets():
    """Create a mock Google Sheets service."""
    class MockSheet:
        def append_row(self, row):
            pass
    
    class MockService:
        def open_by_key(self, key):
            return MockSheet()
    
    return MockService()

@pytest.fixture(scope="function")
def mock_ffmpeg():
    """Create a mock FFmpeg process."""
    class MockFFmpeg:
        def __init__(self):
            self.returncode = 0
            self.stdout = b""
            self.stderr = b""
        
        async def communicate(self):
            return self.stdout, self.stderr
    
    return MockFFmpeg()

@pytest.fixture(scope="function")
def mock_browser():
    """Create a mock Puppeteer browser."""
    class MockPage:
        async def goto(self, url):
            pass
        
        async def type(self, selector, text):
            pass
        
        async def click(self, selector):
            pass
        
        async def uploadFile(self, selector, filepath):
            pass
    
    class MockBrowser:
        async def newPage(self):
            return MockPage()
        
        async def close(self):
            pass
    
    return MockBrowser() 