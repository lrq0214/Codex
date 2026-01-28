# Presentation Summarizer

An intelligent tool that converts presentation decks into concise executive summary slides using AI.

## Features

- **Automatic Content Extraction**: Reads PowerPoint presentations and extracts all text content
- **AI-Powered Summarization**: Uses OpenAI's GPT models to generate concise, professional summaries
- **Smart Title Generation**: Automatically creates compelling slide titles
- **Professional Formatting**: Generates beautifully formatted summary slides
- **Easy-to-Use CLI**: Simple command-line interface for quick processing
- **Customizable Output**: Control summary length and output location

## Installation

### Prerequisites
- Python 3.8 or higher
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Setup

1. Navigate to the project directory:
```bash
cd presentation-summarizer
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up your OpenAI API key:
```bash
# Option 1: Set environment variable
export OPENAI_API_KEY=your_api_key_here

# Option 2: Create .env file in the project root
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

## Usage

### Web Application (Easiest!)

**Run the web interface in 30 seconds:**

```bash
# Windows
run.bat

# macOS/Linux
chmod +x run.sh
./run.sh
```

Then visit **http://localhost:5000** in your browser!

**Features:**
- Drag & drop file upload
- Live preview of summary
- Adjustable summary length
- Choose between GPT-3.5 and GPT-4
- One-click download

For more details, see [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md)

### Command Line

Basic usage:
```bash
python src/cli.py your_presentation.pptx
```

With custom output file:
```bash
python src/cli.py your_presentation.pptx --output summary_output.pptx
```

Advanced options:
```bash
python src/cli.py your_presentation.pptx \
    --output my_summary.pptx \
    --max-length 500 \
    --model gpt-4 \
    --api-key your_key_here
```

### Options

- `input_file`: Path to the PowerPoint presentation (required)
- `--output, -o`: Output file path (default: input_filename_summary.pptx)
- `--api-key`: OpenAI API key (or use OPENAI_API_KEY environment variable)
- `--max-length`: Maximum summary length in words (default: 400)
- `--model`: OpenAI model to use (default: gpt-3.5-turbo)
- `--include-original`: Add summary to original presentation instead of creating new file

### Python API

You can also use the library programmatically:

```python
from src.presentation_reader import PresentationReader
from src.summarizer import PresentationSummarizer
from src.slide_generator import create_summary_presentation

# Read presentation
reader = PresentationReader("presentation.pptx")
content = reader.extract_full_text()

# Generate summary
summarizer = PresentationSummarizer(api_key="your_api_key")
summary = summarizer.generate_summary(content, max_length=400)
title = summarizer.generate_slide_title(summary)

# Create summary presentation
create_summary_presentation(
    title=title,
    summary=summary,
    output_path="summary.pptx",
    subtitle="Executive Summary"
)
```

## Project Structure

```
presentation-summarizer/
├── app.py                      # Flask web application
├── run.bat                     # Windows startup script
├── run.sh                      # macOS/Linux startup script
├── src/
│   ├── __init__.py              # Package initialization
│   ├── cli.py                   # Command-line interface
│   ├── presentation_reader.py   # PowerPoint reading utilities
│   ├── summarizer.py            # AI summarization engine
│   └── slide_generator.py       # Slide creation utilities
├── templates/
│   └── index.html              # Web interface
├── static/
│   ├── style.css              # Frontend styling
│   └── script.js              # Frontend interactivity
├── tests/                        # Test files
├── samples/                      # Sample presentations
├── requirements.txt              # Python dependencies
├── .env.example                  # Environment variables template
├── README.md                     # This file
├── QUICKSTART.md                # Quick start guide
└── WEB_DEPLOYMENT.md           # Web app deployment guide
```

## How It Works

1. **Reading**: Extracts text from all slides, including titles, content, and speaker notes
2. **Summarization**: Sends the extracted content to OpenAI's API with a carefully crafted prompt
3. **Title Generation**: Creates a compelling slide title based on the summary
4. **Formatting**: Generates a professional PowerPoint slide with proper formatting
5. **Output**: Saves the summary slide to a new or existing presentation

## Features Explained

### Content Extraction
- Reads all text shapes from each slide
- Preserves slide order and structure
- Extracts speaker notes for additional context

### Smart Summarization
- Uses GPT-3.5-turbo or GPT-4 for high-quality summaries
- Maintains key points and main takeaways
- Formats output as bullet points when appropriate
- Configurable summary length

### Professional Formatting
- Clean, modern slide design
- Dark blue titles for visual appeal
- Properly sized text for readability
- Professional color scheme

## Examples

### Example 1: Basic Summarization
```bash
python src/cli.py quarterly_earnings.pptx
# Creates: quarterly_earnings_summary.pptx
```

### Example 2: Custom Summary Length
```bash
python src/cli.py product_roadmap.pptx --max-length 300 --output roadmap_brief.pptx
```

### Example 3: Using GPT-4 for Better Quality
```bash
python src/cli.py annual_report.pptx --model gpt-4
```

## Requirements

- python-pptx: For reading and creating PowerPoint files
- openai: For accessing OpenAI's API
- click: For the CLI interface
- python-dotenv: For environment variable management

## Error Handling

The tool includes robust error handling for:
- Missing or invalid input files
- OpenAI API authentication errors
- Rate limiting
- Invalid file formats
- Missing API keys

## Tips for Best Results

1. **Quality Input**: Ensure your presentations have clear, well-written content
2. **API Key**: Use a valid OpenAI API key with sufficient credits
3. **Model Selection**: Use gpt-4 for more nuanced summaries (slower, more expensive)
4. **Summary Length**: Adjust --max-length based on complexity (300-500 words is typical)
5. **Content Structure**: Presentations with clear slide titles produce better summaries

## Troubleshooting

### "API key not found" error
Make sure to set the OPENAI_API_KEY environment variable or use --api-key flag.

### "Rate limit exceeded" error
You've exceeded OpenAI's rate limits. Wait a moment and try again.

### "Invalid PPTX file" error
Ensure the input file is a valid PowerPoint presentation (.pptx format).

### Slow summarization
Large presentations may take time. GPT-4 is slower than GPT-3.5-turbo.

## Limitations

- Only supports .pptx files (not .ppt or other formats)
- Requires internet connection for OpenAI API calls
- Content-based limits depend on OpenAI API token limits
- Free tier has rate limits

## Future Enhancements

- [ ] Support for PDF presentations
- [ ] Batch processing multiple presentations
- [ ] Custom summary templates
- [ ] Integration with other AI services
- [ ] Multi-language support
- [ ] Image and chart recognition
- [ ] Cloud deployment (AWS, GCP, Azure)
- [ ] Mobile app version
- [ ] Real-time collaboration features
- [ ] Summary history and management

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start guide
- **[WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md)** - Web application deployment guide
- **[example_usage.py](example_usage.py)** - Python API examples

## License

This project is provided as-is for educational and commercial use.

## Support

For issues, questions, or suggestions, please check the project documentation or open an issue.

---

**Created**: January 2026
**Version**: 2.0.0
**Last Updated**: January 27, 2026
