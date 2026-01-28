"""Test cases for the presentation summarizer."""

import pytest
from pathlib import Path
from unittest.mock import Mock, patch
import sys
import os

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from presentation_reader import PresentationReader
from summarizer import PresentationSummarizer
from slide_generator import SlideGenerator, create_summary_presentation


class TestPresentationReader:
    """Tests for PresentationReader class."""
    
    def test_init_with_invalid_file(self):
        """Test initialization with non-existent file."""
        with pytest.raises(FileNotFoundError):
            PresentationReader("nonexistent.pptx")
    
    def test_init_with_wrong_extension(self):
        """Test initialization with wrong file extension."""
        # This would need a real file to test properly
        pass
    
    def test_extract_full_text_returns_string(self):
        """Test that extract_full_text returns a string."""
        # This would need a real presentation file
        pass


class TestPresentationSummarizer:
    """Tests for PresentationSummarizer class."""
    
    def test_init_without_api_key(self):
        """Test initialization fails without API key."""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError):
                PresentationSummarizer()
    
    def test_generate_summary_with_empty_content(self):
        """Test that generate_summary raises ValueError for empty content."""
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'test_key'}):
            summarizer = PresentationSummarizer()
            with pytest.raises(ValueError):
                summarizer.generate_summary("")
    
    @patch('openai.ChatCompletion.create')
    def test_generate_summary_success(self, mock_create):
        """Test successful summary generation."""
        mock_response = Mock()
        mock_response.choices = [Mock(message=Mock(content="Test summary"))]
        mock_create.return_value = mock_response
        
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'test_key'}):
            summarizer = PresentationSummarizer()
            result = summarizer.generate_summary("Test content")
            assert result == "Test summary"
            assert mock_create.called


class TestSlideGenerator:
    """Tests for SlideGenerator class."""
    
    def test_add_summary_slide_creates_slide(self):
        """Test that add_summary_slide creates a new slide."""
        generator = SlideGenerator()
        initial_count = len(generator.presentation.slides)
        
        generator.add_summary_slide(
            title="Test Title",
            summary="Test Summary"
        )
        
        assert len(generator.presentation.slides) == initial_count + 1
    
    def test_save_with_invalid_extension(self):
        """Test that save raises ValueError for invalid extension."""
        generator = SlideGenerator()
        
        with pytest.raises(ValueError):
            generator.save("output.txt")
    
    def test_save_creates_file(self, tmp_path):
        """Test that save creates a file."""
        generator = SlideGenerator()
        generator.add_summary_slide(
            title="Test",
            summary="Summary"
        )
        
        output_path = tmp_path / "test_output.pptx"
        generator.save(str(output_path))
        
        assert output_path.exists()


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
