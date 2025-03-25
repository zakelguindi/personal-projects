import pytest
import asyncio
from pathlib import Path
import json
from unittest.mock import patch, MagicMock
from src.main import ContentOrchestrator

@pytest.fixture
def test_config():
    config_path = Path(__file__).parent / 'test_config.json'
    with open(config_path, 'r') as f:
        return json.load(f)

@pytest.fixture
def orchestrator(test_config):
    with patch('src.main.json.load') as mock_load, \
         patch('src.main.ContentScraper') as mock_scraper, \
         patch('src.main.VideoProcessor') as mock_processor, \
         patch('src.main.TranscriptionService') as mock_transcriber, \
         patch('src.main.CaptionGenerator') as mock_caption_gen, \
         patch('src.main.TikTokUploader') as mock_uploader, \
         patch('src.main.AutomationLogger') as mock_logger:
        mock_load.return_value = test_config
        mock_scraper.return_value = MagicMock()
        mock_processor.return_value = MagicMock()
        mock_transcriber.return_value = MagicMock()
        mock_caption_gen.return_value = MagicMock()
        mock_uploader.return_value = MagicMock()
        mock_logger.return_value = MagicMock()
        return ContentOrchestrator()

@pytest.mark.asyncio
async def test_run_pipeline_success(orchestrator):
    # Mock successful responses from all components
    orchestrator.scraper.get_content.return_value = ["video1.mp4", "video2.mp4"]
    orchestrator.processor.process_videos.return_value = ["processed1.mp4", "processed2.mp4"]
    orchestrator.transcriber.transcribe_videos.return_value = ["transcript1.srt", "transcript2.srt"]
    orchestrator.caption_gen.generate_captions.return_value = [
        ("Caption 1", ["test", "video"]),
        ("Caption 2", ["test", "video"])
    ]
    orchestrator.uploader.upload_videos.return_value = [True, True]
    
    await orchestrator.run_pipeline()
    
    # Verify all components were called
    orchestrator.scraper.get_content.assert_called_once()
    orchestrator.processor.process_videos.assert_called_once()
    orchestrator.transcriber.transcribe_videos.assert_called_once()
    orchestrator.caption_gen.generate_captions.assert_called_once()
    orchestrator.uploader.upload_videos.assert_called_once()
    
    # Verify logging
    orchestrator.logger.log_success.assert_called()

@pytest.mark.asyncio
async def test_run_pipeline_scraper_error(orchestrator):
    # Mock scraper error
    orchestrator.scraper.get_content.side_effect = Exception("Scraper error")
    
    await orchestrator.run_pipeline()
    
    # Verify error was logged
    orchestrator.logger.log_error.assert_called()
    
    # Verify subsequent components were not called
    orchestrator.processor.process_videos.assert_not_called()
    orchestrator.transcriber.transcribe_videos.assert_not_called()
    orchestrator.caption_gen.generate_captions.assert_not_called()
    orchestrator.uploader.upload_videos.assert_not_called()

@pytest.mark.asyncio
async def test_run_pipeline_processor_error(orchestrator):
    # Mock successful scraping but failed processing
    orchestrator.scraper.get_content.return_value = ["video1.mp4"]
    orchestrator.processor.process_videos.side_effect = Exception("Processing error")
    
    await orchestrator.run_pipeline()
    
    # Verify error was logged
    orchestrator.logger.log_error.assert_called()
    
    # Verify subsequent components were not called
    orchestrator.transcriber.transcribe_videos.assert_not_called()
    orchestrator.caption_gen.generate_captions.assert_not_called()
    orchestrator.uploader.upload_videos.assert_not_called()

@pytest.mark.asyncio
async def test_run_pipeline_partial_success(orchestrator):
    # Mock mixed results
    orchestrator.scraper.get_content.return_value = ["video1.mp4", "video2.mp4"]
    orchestrator.processor.process_videos.return_value = ["processed1.mp4"]  # One failed
    orchestrator.transcriber.transcribe_videos.return_value = ["transcript1.srt"]
    orchestrator.caption_gen.generate_captions.return_value = [("Caption 1", ["test", "video"])]
    orchestrator.uploader.upload_videos.return_value = [True]
    
    await orchestrator.run_pipeline()
    
    # Verify all components were called
    orchestrator.scraper.get_content.assert_called_once()
    orchestrator.processor.process_videos.assert_called_once()
    orchestrator.transcriber.transcribe_videos.assert_called_once()
    orchestrator.caption_gen.generate_captions.assert_called_once()
    orchestrator.uploader.upload_videos.assert_called_once()
    
    # Verify warning was logged
    orchestrator.logger.log_warning.assert_called()

@pytest.mark.asyncio
async def test_schedule_runs(orchestrator):
    # Mock successful pipeline run
    orchestrator.run_pipeline.return_value = None
    
    # Run for a short duration
    await asyncio.sleep(0.1)
    orchestrator.stop_scheduling()
    
    # Verify pipeline was called
    orchestrator.run_pipeline.assert_called()

def test_stop_scheduling(orchestrator):
    orchestrator.stop_scheduling()
    assert orchestrator.is_running is False 