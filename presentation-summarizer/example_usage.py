"""Quick start example for the presentation summarizer."""

import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from presentation_reader import PresentationReader
from summarizer import PresentationSummarizer
from slide_generator import create_summary_presentation


def summarize_presentation(input_file: str, output_file: str = None, api_key: str = None):
    """
    Quick function to summarize a presentation.
    
    Args:
        input_file: Path to the presentation file
        output_file: Path for the output (optional)
        api_key: OpenAI API key (optional, uses environment variable if not provided)
    """
    print("🚀 Starting presentation summarization...\n")
    
    # Set default output file
    if not output_file:
        input_path = Path(input_file)
        output_file = str(input_path.parent / f"{input_path.stem}_summary.pptx")
    
    try:
        # Step 1: Read the presentation
        print(f"📖 Reading presentation from: {input_file}")
        reader = PresentationReader(input_file)
        content = reader.extract_full_text()
        print(f"✅ Extracted content from {len(reader.presentation.slides)} slides\n")
        
        # Step 2: Initialize summarizer
        print("🤖 Initializing AI summarizer...")
        summarizer = PresentationSummarizer(api_key=api_key)
        print("✅ Summarizer ready\n")
        
        # Step 3: Generate summary
        print("✍️  Generating executive summary...")
        summary = summarizer.generate_summary(content, max_length=400)
        print("✅ Summary generated\n")
        print("Summary Preview:")
        print("-" * 60)
        print(summary)
        print("-" * 60 + "\n")
        
        # Step 4: Generate title
        print("📝 Generating slide title...")
        title = summarizer.generate_slide_title(summary)
        print(f"✅ Title: {title}\n")
        
        # Step 5: Create output presentation
        print(f"💾 Creating summary presentation...")
        create_summary_presentation(
            title=title,
            summary=summary,
            output_path=output_file,
            subtitle="Executive Summary"
        )
        print(f"✅ Summary presentation saved to: {output_file}\n")
        
        print("=" * 60)
        print("✨ Done! Your executive summary slide is ready to use.")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    return True


if __name__ == "__main__":
    # Example usage
    # Replace 'your_presentation.pptx' with your actual file
    
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        api_key = os.getenv("OPENAI_API_KEY")
        
        summarize_presentation(input_file, output_file, api_key)
    else:
        print("Usage: python example_usage.py <input_file.pptx> [output_file.pptx]")
        print("\nExample:")
        print("  python example_usage.py presentation.pptx")
        print("  python example_usage.py presentation.pptx summary_output.pptx")
