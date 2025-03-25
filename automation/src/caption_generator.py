import os
import asyncio
import json
import logging
from pathlib import Path
from typing import Optional, Tuple, List
import aiohttp
from .utils import load_config

class CaptionGenerator:
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the caption generator with configuration."""
        # Load configuration
        self.config = load_config(config_path)
        
        # Get API key from environment
        self.api_key = os.getenv('OPENROUTER_API_KEY')
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is not set")
        
        self.logger = logging.getLogger(__name__)
        
        # API endpoint
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        
        # Model settings
        self.model = "anthropic/claude-3-opus-20240229"
        self.max_tokens = 500
        self.temperature = 0.7

    async def generate_captions(
        self,
        video_paths: List[str],
        subtitle_paths: List[str]
    ) -> List[Tuple[str, List[str]]]:
        """Generate captions and hashtags for videos."""
        results = []
        
        for video_path, subtitle_path in zip(video_paths, subtitle_paths):
            try:
                # Read subtitle content
                with open(subtitle_path, 'r', encoding='utf-8') as f:
                    subtitle_content = f.read()
                
                # Generate caption and hashtags
                caption, hashtags = await self._generate_single_caption(
                    video_path,
                    subtitle_content
                )
                results.append((caption, hashtags))
                
            except Exception as e:
                self.logger.error(f"Error generating caption for {video_path}: {str(e)}")
                results.append(("", []))
        
        return results
    
    async def _generate_single_caption(
        self,
        video_path: str,
        subtitle_content: str
    ) -> Tuple[str, List[str]]:
        """Generate caption and hashtags for a single video."""
        prompt = self._create_prompt(video_path, subtitle_content)
        response = await self._call_api(prompt)
        return self._parse_response(response)
    
    def _create_prompt(self, video_path: str, subtitle_content: str) -> str:
        """Create the prompt for the API."""
        return f"""Based on the following video transcription, create an engaging TikTok caption and relevant hashtags.
        
Video: {video_path}
Transcription: {subtitle_content}

Please provide:
1. A catchy caption that will engage viewers
2. A list of relevant hashtags (max 5)

Format the response as:
CAPTION: [your caption here]
HASHTAGS: [hashtag1] [hashtag2] [hashtag3] [hashtag4] [hashtag5]"""
    
    async def _call_api(self, prompt: str) -> str:
        """Call the OpenRouter API."""
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "anthropic/claude-3-opus-20240229",
            "messages": [{"role": "user", "content": prompt}]
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=data) as response:
                if response.status != 200:
                    raise Exception(f"API call failed with status {response.status}")
                result = await response.json()
                return result['choices'][0]['message']['content']
    
    def _parse_response(self, response: str) -> Tuple[str, List[str]]:
        """Parse the API response into caption and hashtags."""
        lines = response.strip().split('\n')
        caption = ""
        hashtags = []
        
        for line in lines:
            if line.startswith('CAPTION:'):
                caption = line.replace('CAPTION:', '').strip()
            elif line.startswith('HASHTAGS:'):
                hashtags = line.replace('HASHTAGS:', '').strip().split()
        
        return caption, hashtags

async def main():
    generator = CaptionGenerator()
    # Example usage
    descriptions = [
        "Amazing soccer goal compilation with incredible saves and goals"
    ]
    captions = await generator.generate_captions(descriptions, descriptions)
    logger.info(f"Successfully generated {len(captions)} captions")
    return captions

if __name__ == "__main__":
    asyncio.run(main()) 