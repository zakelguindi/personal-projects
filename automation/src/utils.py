import os
import json
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

def load_config(config_path: str = None) -> Dict[str, Any]:
    """Load configuration from JSON file and environment variables."""
    # Load environment variables
    load_dotenv()
    
    # Determine config path
    if config_path is None:
        current_dir = Path(__file__).resolve().parent
        config_path = current_dir.parent / 'config' / 'config.json'
    
    # Load base configuration
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Add environment variables to config
    config['api_keys'] = {
        'openrouter': os.getenv('OPENROUTER_API_KEY'),
        'pexels': os.getenv('PEXELS_API_KEY')
    }
    
    config['tiktok'].update({
        'username': os.getenv('TIKTOK_USERNAME'),
        'password': os.getenv('TIKTOK_PASSWORD')
    })
    
    config['logging']['google_sheet_id'] = os.getenv('GOOGLE_SHEET_ID')
    
    # Parse comma-separated lists from environment variables
    config['content_sources'] = {
        'youtube_channels': os.getenv('YOUTUBE_CHANNELS', '').split(','),
        'search_queries': os.getenv('SEARCH_QUERIES', '').split(',')
    }
    
    # Validate required environment variables
    required_vars = [
        'OPENROUTER_API_KEY',
        'PEXELS_API_KEY',
        'TIKTOK_USERNAME',
        'TIKTOK_PASSWORD'
    ]
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")
    
    return config 