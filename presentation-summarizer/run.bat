@echo off
REM Presentation Summarizer - Windows Startup Script

echo.
echo ======================================
echo   Presentation Summarizer Web App
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install/upgrade dependencies
echo.
echo Installing dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Check for API key
if not defined OPENAI_API_KEY (
    echo.
    echo WARNING: OPENAI_API_KEY is not set!
    echo.
    echo You need to set your OpenAI API key:
    echo   set OPENAI_API_KEY=sk-your-key-here
    echo.
    echo Or create a .env file with:
    echo   OPENAI_API_KEY=sk-your-key-here
    echo.
)

REM Start the application
echo.
echo ======================================
echo Starting Flask web server...
echo ======================================
echo.
echo Opening http://localhost:5000 in your browser...
echo Press CTRL+C to stop the server
echo.

timeout /t 2 /nobreak
start http://localhost:5000

python app.py
