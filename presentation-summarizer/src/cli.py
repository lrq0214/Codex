"""Command-line interface for the presentation summarizer."""

import click
from pathlib import Path
from presentation_reader import PresentationReader
from summarizer import PresentationSummarizer
from slide_generator import create_summary_presentation


@click.command()
@click.argument("input_file", type=click.Path(exists=True))
@click.option(
    "--output",
    "-o",
    type=click.Path(),
    help="Output file path (default: input_filename_summary.pptx)",
)
@click.option(
    "--api-key",
    envvar="OPENAI_API_KEY",
    help="OpenAI API key (or set OPENAI_API_KEY environment variable)",
)
@click.option(
    "--max-length",
    type=int,
    default=400,
    help="Maximum length of summary in words (default: 400)",
)
@click.option(
    "--model",
    type=str,
    default="gpt-3.5-turbo",
    help="OpenAI model to use (default: gpt-3.5-turbo)",
)
@click.option(
    "--include-original",
    is_flag=True,
    help="Include summary slide in the original presentation instead of creating new file",
)
def main(
    input_file: str,
    output: str,
    api_key: str,
    max_length: int,
    model: str,
    include_original: bool,
):
    """
    Create an executive summary slide from a presentation deck.
    
    This tool reads a PowerPoint presentation, extracts its content,
    uses AI to generate a concise summary, and creates a new slide
    with the executive summary.
    
    Example:
        python cli.py presentation.pptx --output summary.pptx
    """
    try:
        click.echo("📊 Presentation Summarizer")
        click.echo("-" * 50)
        
        # Read presentation
        click.echo(f"📖 Reading presentation: {input_file}")
        reader = PresentationReader(input_file)
        presentation_content = reader.extract_full_text()
        click.echo(f"✓ Extracted content from {reader.presentation.slides.__len__()} slides")
        
        # Initialize summarizer
        click.echo("🤖 Initializing AI summarizer...")
        summarizer = PresentationSummarizer(api_key=api_key)
        
        # Generate summary
        click.echo(f"✍️  Generating summary (max {max_length} words)...")
        summary = summarizer.generate_summary(
            presentation_content,
            max_length=max_length,
            model=model
        )
        click.echo("✓ Summary generated successfully")
        
        # Generate title
        click.echo("📝 Generating slide title...")
        title = summarizer.generate_slide_title(summary, model=model)
        click.echo(f"✓ Title: {title}")
        
        # Determine output path
        if not output:
            input_path = Path(input_file)
            output = str(input_path.parent / f"{input_path.stem}_summary.pptx")
        
        # Create presentation
        click.echo(f"💾 Creating summary presentation...")
        create_summary_presentation(
            title=title,
            summary=summary,
            output_path=output,
            subtitle="Executive Summary"
        )
        click.echo(f"✓ Presentation saved to: {output}")
        
        click.echo("-" * 50)
        click.echo("✨ Done! Your executive summary slide is ready.")
        
    except FileNotFoundError as e:
        click.echo(f"❌ Error: {str(e)}", err=True)
        raise click.Exit(1)
    except ValueError as e:
        click.echo(f"❌ Error: {str(e)}", err=True)
        raise click.Exit(1)
    except Exception as e:
        click.echo(f"❌ Unexpected error: {str(e)}", err=True)
        raise click.Exit(1)


if __name__ == "__main__":
    main()
