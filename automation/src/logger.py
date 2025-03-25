import logging
import os
from pathlib import Path
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials
from typing import Optional

from .utils import load_config

class AutomationLogger:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the logger with configuration."""
        # Load configuration
        self.config = load_config(config_path)
        
        # Set up file logging
        log_file = self.config['logging']['log_file']
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        self.logger = logging.getLogger('automation')
        self.logger.setLevel(logging.INFO)
        
        # File handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        )
        self.logger.addHandler(file_handler)
        
        # Initialize Google Sheets if configured
        self.sheet = None
        if self.config['logging'].get('google_sheet_id'):
            self._init_google_sheets()
    
    async def _init_google_sheets(self) -> None:
        """Initialize Google Sheets connection."""
        try:
            credentials = Credentials.from_service_account_file(
                self.config['logging']['google_credentials_file'],
                scopes=['https://www.googleapis.com/auth/spreadsheets']
            )
            gc = gspread.authorize(credentials)
            self.sheet = gc.open_by_key(self.config['logging']['google_sheet_id']).sheet1
        except Exception as e:
            self.logger.error(f"Failed to initialize Google Sheets: {str(e)}")
            raise
    
    async def log_event(self, message: str, level: str = "info") -> None:
        """Log an event to both file and Google Sheets."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Log to file
        log_method = getattr(self.logger, level.lower(), self.logger.info)
        log_method(message)
        
        # Log to Google Sheets if configured
        if self.sheet:
            try:
                self.sheet.append_row([timestamp, message, level])
            except Exception as e:
                self.logger.error(f"Failed to log to Google Sheets: {str(e)}")
    
    async def log_success(self, message: str) -> None:
        """Log a success event."""
        await self.log_event(message, "success")
    
    async def log_error(self, message: str) -> None:
        """Log an error event."""
        await self.log_event(message, "error")
    
    async def log_warning(self, message: str) -> None:
        """Log a warning event."""
        await self.log_event(message, "warning")

def main():
    # Example usage
    logger = AutomationLogger()
    
    # Log some example events
    logger.log_success("Video Processing")
    
    logger.log_warning("API Rate Limit")
    
    try:
        raise ValueError("Example error")
    except Exception as e:
        logger.log_error("Video Upload")

if __name__ == "__main__":
    main() 