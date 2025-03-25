import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from logger import AutomationLogger

@pytest.fixture
def test_config():
    """Load test configuration."""
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def logger(test_config):
    """Create an AutomationLogger instance with test configuration."""
    with patch('logger.json.load') as mock_load, \
         patch('logger.gspread.authorize') as mock_auth, \
         patch('logger.gspread.open_by_key') as mock_open:
        mock_load.return_value = test_config
        mock_auth.return_value = MagicMock()
        mock_open.return_value = MagicMock()
        return AutomationLogger()

def test_init(logger):
    assert logger.config is not None
    assert logger.sheet is not None
    assert logger.logger is not None

@pytest.mark.asyncio
async def test_log_event(logger):
    """Test logging an event."""
    with patch('logger.logging.getLogger') as mock_logger:
        # Configure mock
        mock_log = MagicMock()
        mock_logger.return_value = mock_log
        
        # Test data
        message = "Test event"
        level = "info"
        
        # Call function
        await logger.log_event(message, level)
        
        # Verify
        mock_log.info.assert_called_once_with(message)

@pytest.mark.asyncio
async def test_log_success(logger):
    """Test logging a success event."""
    with patch('logger.AutomationLogger.log_event') as mock_log_event:
        # Test data
        message = "Test success"
        
        # Call function
        await logger.log_success(message)
        
        # Verify
        mock_log_event.assert_called_once_with(message, "success")

@pytest.mark.asyncio
async def test_log_error(logger):
    """Test logging an error event."""
    with patch('logger.AutomationLogger.log_event') as mock_log_event:
        # Test data
        message = "Test error"
        
        # Call function
        await logger.log_error(message)
        
        # Verify
        mock_log_event.assert_called_once_with(message, "error")

@pytest.mark.asyncio
async def test_log_warning(logger):
    """Test logging a warning event."""
    with patch('logger.AutomationLogger.log_event') as mock_log_event:
        # Test data
        message = "Test warning"
        
        # Call function
        await logger.log_warning(message)
        
        # Verify
        mock_log_event.assert_called_once_with(message, "warning")

@pytest.mark.asyncio
async def test_log_event_google_sheets(logger):
    """Test logging to Google Sheets."""
    with patch('logger.gspread.Worksheet.append_row') as mock_append:
        # Test data
        message = "Test event"
        level = "info"
        timestamp = "2024-03-20 10:00:00"
        
        # Call function
        await logger.log_event(message, level)
        
        # Verify
        mock_append.assert_called_once()
        call_args = mock_append.call_args[0][0]
        assert call_args[0] == timestamp
        assert call_args[1] == message
        assert call_args[2] == level

@pytest.mark.asyncio
async def test_log_event_google_sheets_error(logger):
    """Test error handling in Google Sheets logging."""
    with patch('logger.gspread.Worksheet.append_row') as mock_append:
        # Configure mock to simulate error
        mock_append.side_effect = Exception("Google Sheets error")
        
        # Test data
        message = "Test event"
        level = "info"
        
        # Call function and verify it doesn't raise an exception
        await logger.log_event(message, level)
        mock_append.assert_called_once()

@pytest.mark.asyncio
async def test_init_google_sheets(logger):
    """Test Google Sheets initialization."""
    with patch('logger.gspread.authorize') as mock_auth, \
         patch('logger.gspread.open_by_key') as mock_open:
        # Configure mocks
        mock_auth.return_value = MagicMock()
        mock_open.return_value = MagicMock()
        
        # Call function
        await logger._init_google_sheets()
        
        # Verify
        mock_auth.assert_called_once()
        mock_open.assert_called_once()

@pytest.mark.asyncio
async def test_init_google_sheets_error(logger):
    """Test error handling in Google Sheets initialization."""
    with patch('logger.gspread.authorize') as mock_auth:
        # Configure mock to simulate error
        mock_auth.side_effect = Exception("Google Sheets auth error")
        
        # Verify exception is raised
        with pytest.raises(Exception) as exc_info:
            await logger._init_google_sheets()
        assert "Failed to initialize Google Sheets" in str(exc_info.value)

def test_format_event(logger):
    test_event = {
        "type": "test",
        "message": "Test message",
        "timestamp": "2024-01-01T00:00:00"
    }
    
    formatted = logger._format_event(test_event)
    
    assert isinstance(formatted, list)
    assert len(formatted) == 4  # timestamp, type, message, status
    assert formatted[0] == test_event["timestamp"]
    assert formatted[1] == test_event["type"]
    assert formatted[2] == test_event["message"]
    assert formatted[3] == "success" 