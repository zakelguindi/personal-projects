# TikTok Content Automation

An end-to-end automated system for creating and uploading TikTok content. This project uses Python and Node.js to automate the process of content creation, processing, and uploading to TikTok.

## Features

- Automated content acquisition from YouTube and Pexels
- Video processing and transformation to TikTok format
- Subtitle generation using OpenAI Whisper
- Caption and hashtag generation using OpenRouter API
- Automated TikTok upload using Puppeteer
- Comprehensive logging system with Google Sheets integration

## Prerequisites

- Python 3.8+
- Node.js 14+
- FFmpeg
- Google Chrome (for Puppeteer)
- API keys for:
  - Pexels
  - OpenRouter
  - Google Sheets (for logging)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tiktok-automation.git
cd tiktok-automation
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
cd scripts
npm install
cd ..
```

4. Set up Google Sheets API:
   - Create a new Google Cloud Project
   - Enable the Google Sheets API
   - Create credentials (OAuth 2.0 Client ID)
   - Download the credentials and save as `credentials.json` in the project root

5. Configure the project:
   - Copy `config.json.example` to `config.json`
   - Fill in your API keys and settings
   - Add your TikTok credentials
   - Set up your Google Sheet ID for logging

## Project Structure

```
/automation
├── /src
│   ├── main.py                # Main orchestrator script
│   ├── scraper.py             # Content acquisition
│   ├── video_processor.py     # Video processing
│   ├── transcription.py       # Subtitle generation
│   ├── caption_generator.py   # Caption generation
│   ├── upload.py              # TikTok upload
│   └── logger.py              # Logging system
├── /scripts
│   └── upload_tiktok.js       # TikTok upload script
├── /assets
│   └── watermark.png          # Watermark image
├── /config
│   └── config.json            # Configuration file
└── /logs
    └── process.log            # Log files
```

## Usage

1. Start the automation system:
```bash
python src/main.py
```

The system will:
- Run on a daily schedule (configurable in `main.py`)
- Download content from configured sources
- Process videos to TikTok format
- Generate subtitles and captions
- Upload to TikTok
- Log all activities

## Configuration

Edit `config/config.json` to customize:
- API keys
- Video settings (resolution, duration)
- Content sources (YouTube channels, search queries)
- TikTok credentials
- Logging settings

## Logging

The system logs all activities to:
- Local log file (`logs/process.log`)
- Google Sheets (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational purposes only. Please ensure you comply with TikTok's terms of service and content policies when using this automation system. 