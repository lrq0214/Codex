# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd presentation-summarizer
pip install -r requirements.txt
```

### 2. Set Up OpenAI API Key
```bash
# Option A: Environment Variable
export OPENAI_API_KEY=sk-...your-key-here...

# Option B: Create .env file
copy .env.example .env
# Then edit .env and add your API key
```

### 3. Run the Tool
```bash
python src/cli.py your_presentation.pptx
```

That's it! Your summary will be saved as `your_presentation_summary.pptx`

## Common Commands

### Basic Usage
```bash
python src/cli.py presentation.pptx
```

### Custom Output Location
```bash
python src/cli.py presentation.pptx --output summary.pptx
```

### Shorter Summary
```bash
python src/cli.py presentation.pptx --max-length 300
```

### Better Quality (Slower)
```bash
python src/cli.py presentation.pptx --model gpt-4
```

### All Options
```bash
python src/cli.py presentation.pptx \
    --output summary.pptx \
    --max-length 400 \
    --model gpt-3.5-turbo \
    --api-key sk-...
```

## Using as a Python Library

```python
from src.presentation_reader import PresentationReader
from src.summarizer import PresentationSummarizer
from src.slide_generator import create_summary_presentation

# Read presentation
reader = PresentationReader("presentation.pptx")
content = reader.extract_full_text()

# Summarize
summarizer = PresentationSummarizer(api_key="your_key")
summary = summarizer.generate_summary(content)
title = summarizer.generate_slide_title(summary)

# Create output
create_summary_presentation(title, summary, "output.pptx")
```

## Troubleshooting

**"API key not found"**
- Make sure you set OPENAI_API_KEY environment variable
- Or use `--api-key` flag

**"File not found"**
- Check that the presentation file exists
- Use absolute path if in different directory

**"Invalid PPTX file"**
- Ensure it's PowerPoint format (.pptx, not .ppt)
- Make sure the file isn't corrupted

**Slow processing**
- Large presentations take time
- Using gpt-4 is slower than gpt-3.5-turbo

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [example_usage.py](example_usage.py) for programmatic usage
- Review the [tests](tests/) for code examples
