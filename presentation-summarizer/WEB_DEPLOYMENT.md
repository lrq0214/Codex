# Web Application Deployment Guide

## Running the Web Application Locally

### Quick Start (5 minutes)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set OpenAI API key:**
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY = "sk-..."
   
   # Windows CMD
   set OPENAI_API_KEY=sk-...
   
   # Linux/Mac
   export OPENAI_API_KEY=sk-...
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open in browser:**
   ```
   http://localhost:5000
   ```

## Features

- 📤 **File Upload**: Drag and drop or click to upload presentations
- 🎯 **Smart Summary**: AI-powered content extraction and summarization
- ⚙️ **Customization**: Adjust summary length and choose AI model
- 📊 **Live Preview**: See your summary before downloading
- ⬇️ **One-Click Download**: Export as professional PowerPoint slide

## Application Structure

```
presentation-summarizer/
├── app.py                    # Flask application
├── templates/
│   └── index.html           # Web interface
├── static/
│   ├── style.css           # Styling
│   └── script.js           # Frontend logic
├── src/
│   ├── presentation_reader.py
│   ├── summarizer.py
│   ├── slide_generator.py
│   └── cli.py
└── requirements.txt
```

## API Endpoints

### GET /
Renders the main web interface.

### GET /api/status
Check if the application is ready.

**Response:**
```json
{
  "ready": true,
  "message": "Application is ready"
}
```

### POST /api/upload
Upload a PowerPoint presentation.

**Request:**
- Content-Type: multipart/form-data
- File field: .pptx file

**Response:**
```json
{
  "success": true,
  "file_path": "/tmp/...",
  "file_name": "presentation.pptx",
  "total_slides": 10,
  "slides": [...]
}
```

### POST /api/summarize
Generate a summary for the uploaded presentation.

**Request:**
```json
{
  "file_path": "/tmp/...",
  "max_length": 400,
  "model": "gpt-3.5-turbo"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "...",
  "title": "..."
}
```

### POST /api/download
Download the summary as a PowerPoint file.

**Request:**
```json
{
  "title": "Executive Summary",
  "summary": "...",
  "file_name": "presentation.pptx"
}
```

**Response:** PowerPoint file (binary)

## Configuration

### Environment Variables

```bash
OPENAI_API_KEY=sk-...          # Required: OpenAI API key
OPENAI_MODEL=gpt-3.5-turbo     # Optional: Default model
DEBUG=false                     # Optional: Debug mode
```

### Flask Configuration

In `app.py`, you can modify:
- `UPLOAD_FOLDER`: Where uploaded files are stored
- `ALLOWED_EXTENSIONS`: File types allowed (.pptx only)
- `MAX_FILE_SIZE`: Maximum upload size (default: 50MB)
- Port (default: 5000)
- Host (default: 0.0.0.0)

## Troubleshooting

### "Port already in use" error
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac: 
lsof -i :5000
kill -9 <PID>
```

### "API key not configured" warning
Make sure to set the OPENAI_API_KEY environment variable before starting the app.

### Large file upload fails
Increase `MAX_FILE_SIZE` in `app.py`:
```python
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB
```

### Slow summarization
- Use `gpt-3.5-turbo` model (faster, cheaper)
- Reduce `max_length` value
- Check your internet connection

## Performance Tips

1. **Use GPT-3.5-turbo** for faster processing
2. **Adjust summary length** based on needs (300-500 words typical)
3. **Keep presentations under 50 slides** for best performance
4. **Close other applications** to free up system resources

## Security Considerations

⚠️ **Important Notes:**
- Files are stored in the system temp directory
- Temporary files are not automatically deleted
- Consider deploying with proper file cleanup policies
- Use HTTPS in production
- Validate file uploads
- Set rate limits if deploying publicly

## Deployment to Cloud

### Heroku Deployment

1. Create `Procfile`:
   ```
   web: gunicorn app:app
   ```

2. Create `runtime.txt`:
   ```
   python-3.11.0
   ```

3. Deploy:
   ```bash
   heroku create app-name
   heroku config:set OPENAI_API_KEY=sk-...
   git push heroku main
   ```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
EXPOSE 5000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t presentation-summarizer .
docker run -e OPENAI_API_KEY=sk-... -p 5000:5000 presentation-summarizer
```

## Next Steps

- Read the main [README.md](README.md)
- Check [QUICKSTART.md](QUICKSTART.md) for CLI usage
- Review example code in [example_usage.py](example_usage.py)
