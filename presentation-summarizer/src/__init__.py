"""Presentation Summarizer - Convert presentation decks to executive summary slides."""

__version__ = "1.0.0"
__author__ = "AI Assistant"

from presentation_reader import PresentationReader
from summarizer import PresentationSummarizer
from slide_generator import SlideGenerator, create_summary_presentation

__all__ = [
    "PresentationReader",
    "PresentationSummarizer",
    "SlideGenerator",
    "create_summary_presentation",
]
