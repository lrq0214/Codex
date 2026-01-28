"""
Presentation Summarizer - API Documentation

This module provides a comprehensive API for the presentation summarizer.
"""

# ============================================================================
# QUICK API REFERENCE
# ============================================================================

# 1. READ A PRESENTATION
# ============================================================================
from src.presentation_reader import PresentationReader

reader = PresentationReader("presentation.pptx")

# Get all slides with metadata
slides = reader.get_slides_content()
# Returns: [
#     {
#         "slide_number": 1,
#         "title": "Title",
#         "content": ["content text"],
#         "notes": "speaker notes"
#     },
#     ...
# ]

# Get full text content
text = reader.extract_full_text()
# Returns: "Slide 1: Title\ncontent text\n..."

# Get presentation summary
summary = reader.get_presentation_summary()
# Returns: {
#     "file_name": "presentation.pptx",
#     "total_slides": 10,
#     "slides": [...]
# }


# 2. GENERATE SUMMARIES
# ============================================================================
from src.summarizer import PresentationSummarizer

summarizer = PresentationSummarizer(api_key="sk-...")

# Generate summary
summary = summarizer.generate_summary(
    content="Your presentation content here",
    max_length=400,  # words
    model="gpt-3.5-turbo"  # or "gpt-4"
)
# Returns: "A concise summary of the content..."

# Generate title
title = summarizer.generate_slide_title(
    content="Summary text",
    model="gpt-3.5-turbo"
)
# Returns: "Executive Summary"


# 3. CREATE SLIDES
# ============================================================================
from src.slide_generator import SlideGenerator, create_summary_presentation

# Method 1: Using SlideGenerator class
generator = SlideGenerator()
generator.add_summary_slide(
    title="Executive Summary",
    summary="Your summary content...",
    subtitle="Presentation Overview"
)
generator.save("output.pptx")

# Method 2: Using convenience function
create_summary_presentation(
    title="Executive Summary",
    summary="Your summary content...",
    output_path="output.pptx",
    subtitle="Presentation Overview"
)


# 4. COMPLETE WORKFLOW
# ============================================================================

def process_presentation(input_file, output_file, api_key):
    """
    Complete workflow: read → summarize → generate slide
    """
    # Step 1: Read presentation
    reader = PresentationReader(input_file)
    content = reader.extract_full_text()
    
    # Step 2: Initialize summarizer
    summarizer = PresentationSummarizer(api_key=api_key)
    
    # Step 3: Generate summary and title
    summary = summarizer.generate_summary(content, max_length=400)
    title = summarizer.generate_slide_title(summary)
    
    # Step 4: Create output presentation
    create_summary_presentation(
        title=title,
        summary=summary,
        output_path=output_file,
        subtitle="Executive Summary"
    )
    
    return {
        "title": title,
        "summary": summary,
        "output_file": output_file
    }

# Usage
result = process_presentation(
    input_file="presentation.pptx",
    output_file="summary.pptx",
    api_key="sk-..."
)
print(f"Created: {result['output_file']}")
print(f"Title: {result['title']}")


# 5. ERROR HANDLING
# ============================================================================

try:
    reader = PresentationReader("presentation.pptx")
except FileNotFoundError:
    print("File not found")
except ValueError as e:
    print(f"Invalid file: {e}")

try:
    summarizer = PresentationSummarizer()
except ValueError:
    print("API key not configured")

try:
    summary = summarizer.generate_summary(content)
except ValueError:
    print("Content is empty")
except Exception as e:
    print(f"API error: {e}")

try:
    generator = SlideGenerator()
    generator.save("output.pptx")
except ValueError:
    print("Invalid file extension")
except Exception as e:
    print(f"Failed to save: {e}")


# 6. CONFIGURATION
# ============================================================================

# From environment variable
import os
api_key = os.getenv("OPENAI_API_KEY")
summarizer = PresentationSummarizer(api_key=api_key)

# From .env file
from dotenv import load_dotenv
load_dotenv()
summarizer = PresentationSummarizer()

# Direct specification
summarizer = PresentationSummarizer(api_key="sk-...")


# 7. ADVANCED OPTIONS
# ============================================================================

# Different models
summarizer.generate_summary(content, model="gpt-4")  # Better quality
summarizer.generate_summary(content, model="gpt-3.5-turbo")  # Faster

# Adjust summary length
summarizer.generate_summary(content, max_length=200)   # Brief
summarizer.generate_summary(content, max_length=600)   # Detailed

# Custom slide formatting
generator = SlideGenerator()
# Width: 10 inches, Height: 7.5 inches (standard)
generator.add_summary_slide(
    title="My Title",
    summary="My summary",
    subtitle="Optional Subtitle"
)
generator.save("output.pptx")


# 8. BATCH PROCESSING
# ============================================================================

import os
from pathlib import Path

def batch_summarize(directory, output_dir, api_key):
    """
    Summarize all presentations in a directory
    """
    pptx_files = Path(directory).glob("*.pptx")
    
    summarizer = PresentationSummarizer(api_key=api_key)
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for pptx_file in pptx_files:
        try:
            reader = PresentationReader(str(pptx_file))
            content = reader.extract_full_text()
            
            summary = summarizer.generate_summary(content)
            title = summarizer.generate_slide_title(summary)
            
            output_path = Path(output_dir) / f"{pptx_file.stem}_summary.pptx"
            create_summary_presentation(title, summary, str(output_path))
            
            results.append({
                "input": pptx_file.name,
                "output": output_path.name,
                "title": title,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "input": pptx_file.name,
                "status": "error",
                "error": str(e)
            })
    
    return results

# Usage
results = batch_summarize("./inputs", "./outputs", api_key="sk-...")
for result in results:
    print(f"{result['input']}: {result['status']}")


# 9. ENVIRONMENT VARIABLES
# ============================================================================

"""
Required:
  OPENAI_API_KEY=sk-...

Optional:
  OPENAI_MODEL=gpt-3.5-turbo
  DEBUG=false
"""


# 10. DEPENDENCIES
# ============================================================================

"""
- python-pptx: Reading/writing PowerPoint files
- openai: OpenAI API client
- click: Command-line interface
- python-dotenv: Environment variable management
- flask: Web framework (for web app only)
- werkzeug: WSGI utilities (for web app only)
"""
