#!/bin/bash
# Presentation Summarizer - macOS/Linux Startup Script

echo ""
echo "======================================"
echo "  Presentation Summarizer Web App"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/downloads/"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    exit 1
fi

# Install/upgrade dependencies
echo ""
echo "Installing dependencies..."
pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

# Check for API key
if [ -z "$OPENAI_API_KEY" ]; then
    echo ""
    echo "WARNING: OPENAI_API_KEY is not set!"
    echo ""
    echo "You need to set your OpenAI API key:"
    echo "  export OPENAI_API_KEY=sk-your-key-here"
    echo ""
    echo "Or create a .env file with:"
    echo "  OPENAI_API_KEY=sk-your-key-here"
    echo ""
fi

# Start the application
echo ""
echo "======================================"
echo "Starting Flask web server..."
echo "======================================"
echo ""
echo "Opening http://localhost:5000 in your browser..."
echo "Press CTRL+C to stop the server"
echo ""

sleep 2
open http://localhost:5000 2>/dev/null || xdg-open http://localhost:5000 2>/dev/null || echo "Please open http://localhost:5000 in your browser"

python app.py
