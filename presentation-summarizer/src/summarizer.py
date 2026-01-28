"""Module for summarizing presentation content using AI."""

import os
from typing import Optional
import openai
from dotenv import load_dotenv


class PresentationSummarizer:
    """Handles AI-powered summarization of presentation content."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the summarizer.
        
        Args:
            api_key: OpenAI API key. If not provided, loads from environment.
        """
        load_dotenv()
        
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError(
                "OpenAI API key not found. "
                "Please provide it as an argument or set OPENAI_API_KEY environment variable."
            )
        
        openai.api_key = self.api_key
    
    def generate_summary(
        self,
        content: str,
        max_length: int = 500,
        model: str = "gpt-3.5-turbo"
    ) -> str:
        """
        Generate a concise summary of the presentation content.
        
        Args:
            content: The text content to summarize
            max_length: Maximum length of the summary in words
            model: The OpenAI model to use
        
        Returns:
            The generated summary
        
        Raises:
            ValueError: If content is empty
            Exception: If API call fails
        """
        if not content or not content.strip():
            raise ValueError("Content cannot be empty")
        
        prompt = f"""You are an executive summary expert. 
Read the following presentation content and create a concise executive summary.
The summary should:
- Be approximately {max_length} words or less
- Highlight the key points and main takeaways
- Be suitable for a single slide presentation
- Use clear, professional language
- Be structured with bullet points where appropriate

Presentation Content:
{content}

Executive Summary:"""
        
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at creating executive summaries for presentations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=int(max_length / 0.75),  # Approximate conversion
            )
            
            return response.choices[0].message.content.strip()
        
        except openai.error.AuthenticationError:
            raise Exception("Authentication failed. Please check your OpenAI API key.")
        except openai.error.RateLimitError:
            raise Exception("Rate limit exceeded. Please wait before trying again.")
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
    
    def generate_slide_title(
        self,
        content: str,
        model: str = "gpt-3.5-turbo"
    ) -> str:
        """
        Generate a suitable title for the executive summary slide.
        
        Args:
            content: The summary content
            model: The OpenAI model to use
        
        Returns:
            A suitable slide title
        """
        prompt = f"""Based on the following executive summary, generate a concise and impactful slide title (5-10 words).
The title should be professional and capture the essence of the presentation.

Summary:
{content}

Title:"""
        
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at creating compelling slide titles."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=30,
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            return "Executive Summary"  # Fallback title
