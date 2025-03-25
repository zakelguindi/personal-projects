# Test Suite for TikTok Content Automation

This directory contains the test suite for the TikTok Content Automation project. The tests cover all major components of the system, including content acquisition, video processing, transcription, caption generation, and TikTok upload functionality.

## Test Structure

The test suite is organized as follows:

- `test_scraper.py`: Tests for content acquisition from YouTube and Pexels
- `test_video_processor.py`: Tests for video processing and FFmpeg operations
- `test_transcription.py`: Tests for video transcription using OpenAI Whisper
- `test_caption_generator.py`: Tests for caption and hashtag generation
- `test_upload.py`: Tests for TikTok video upload functionality
- `test_logger.py`: Tests for logging system and Google Sheets integration
- `test_main.py`: Tests for the main orchestrator and pipeline coordination
- `conftest.py`: Common test fixtures and configurations
- `pytest.ini`: Pytest configuration settings
- `requirements-test.txt`: Test-specific dependencies
- `run_tests.py`: Script to run all tests with coverage reporting

## Running Tests

### Prerequisites

1. Python 3.8 or higher
2. FFmpeg installed and available in system PATH
3. Node.js 14 or higher (for TikTok upload tests)

### Installation

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install test dependencies:
   ```bash
   pip install -r requirements-test.txt
   ```

### Running Tests

You can run the tests in several ways:

1. Run all tests with coverage reporting:
   ```bash
   python run_tests.py
   ```

2. Run specific test files:
   ```bash
   pytest tests/test_scraper.py
   pytest tests/test_video_processor.py
   ```

3. Run tests with specific markers:
   ```bash
   pytest -m unit  # Run only unit tests
   pytest -m integration  # Run only integration tests
   ```

4. Run tests with verbose output:
   ```bash
   pytest -v
   ```

5. Run tests with detailed failure information:
   ```bash
   pytest -vv
   ```

## Test Coverage

The test suite includes:

- Unit tests for individual components
- Integration tests for component interactions
- Mock objects for external services (YouTube, Pexels, TikTok, etc.)
- Error handling and edge case testing
- Asynchronous operation testing

Coverage reports are generated in HTML format and can be found in the `htmlcov` directory after running the tests.

## Writing New Tests

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Use the provided fixtures from `conftest.py`
3. Mock external services and API calls
4. Include both success and error cases
5. Test edge cases and boundary conditions
6. Add appropriate markers (@pytest.mark.unit or @pytest.mark.integration)

## Test Configuration

The test configuration is managed through:

- `test_config.json`: Test-specific configuration settings
- `pytest.ini`: Pytest configuration and markers
- Environment variables in `conftest.py`

## Contributing

When contributing to the test suite:

1. Ensure all tests pass before submitting changes
2. Maintain or improve test coverage
3. Update documentation as needed
4. Follow the project's coding standards
5. Include appropriate test cases for new features

## Troubleshooting

Common issues and solutions:

1. **FFmpeg not found**: Ensure FFmpeg is installed and in your system PATH
2. **Node.js dependencies**: Run `npm install` in the `scripts` directory
3. **Google Sheets API**: Ensure credentials are properly configured
4. **Test timeouts**: Adjust timeout settings in `pytest.ini` if needed

## License

This test suite is part of the TikTok Content Automation project and is licensed under the MIT License. 