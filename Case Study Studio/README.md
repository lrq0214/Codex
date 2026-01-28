# Case Study Studio Application

A professional web application that allows consulting firms to upload project deliverables and automatically generate templated one-page case studies using AI.

## Features

✨ **Key Features:**
- **File Upload**: Support for PDF, DOCX, TXT, XLSX documents (up to 50MB each)
- **Template Examples** (Optional): Upload 2-3 example case studies to guide the AI's writing style and format
- **AI-Powered Generation**: Uses OpenAI GPT-4 to analyze and summarize project deliverables
- **Templated Output**: Structured case studies with:
  - Problem Statement
  - Solution Approach
  - Key Metrics
  - Impact Summary
  - Implementation Details
  - Lessons Learned
- **Professional Formatting**: DOCX output with polished formatting
- **Case Study History**: Save and manage previously generated case studies
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Client-side storage for case study history

## Project Structure

```
Case Study Studio/
├── backend/
│   ├── app.py                    # Flask API application
│   ├── case_study_generator.py   # Case study generation logic
│   ├── file_processor.py         # File parsing and content extraction
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example             # Environment variables template
│   ├── uploads/                 # Directory for uploaded files
│   └── outputs/                 # Directory for generated case studies
└── frontend/
    ├── index.html               # Main HTML interface
    ├── styles.css              # Responsive CSS styling
    └── script.js               # Client-side JavaScript
```

## Tech Stack

**Backend:**
- Python 3.8+
- Flask 2.3+ (Web framework)
- Flask-CORS (Cross-origin requests)
- OpenAI API (GPT-4 for generation)
- PyPDF2 (PDF parsing)
- python-docx (DOCX generation)

**Frontend:**
- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript
- Local Storage API

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   # OPENAI_API_KEY=sk-...your-key-here...
   ```

5. **Run the Flask application:**
   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Option A: Using Python's built-in server**
   ```bash
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

3. **Option B: Using Node.js http-server**
   ```bash
   npx http-server -p 8000
   ```

4. **Option C: Direct file access**
   Simply open `index.html` in your web browser (file:// protocol)

## API Endpoints

### Health Check
```
GET /health
```

### Upload Files
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- files: Array of files (PDF, DOCX, TXT, XLSX)
- projectName: String - Name of the project
- clientName: String - Name of the client
- industry: String - Industry vertical

Response:
{
  "success": true,
  "uploaded_files": [...],
  "metadata": {...}
}
```

### Generate Case Study
```
POST /api/generate-case-study
Content-Type: application/json

Body:
{
  "files": [{"filepath": "...", "original_name": "..."}],
  "projectName": "string",
  "clientName": "string",
  "industry": "string",
  "additionalContext": "string"
}

Response:
{
  "success": true,
  "case_study": {...},
  "output_file": "case_study_...docx",
  "generated_at": "ISO-8601 timestamp"
}
```

### Download Case Study
```
GET /api/download/<filename>
```

### List Case Studies
```
GET /api/case-studies

Response:
{
  "case_studies": [
    {
      "filename": "case_study_...docx",
      "created_at": "ISO-8601 timestamp",
      "size": 45000
    }
  ]
}
```

## Usage Guide

### Step 1: Enter Project Information
1. Fill in the project name
2. Enter client name
3. Select the industry vertical
4. (Optional) Add additional context about the project

### Step 2: Upload Deliverables
1. Click on the upload area or drag files
2. Upload project documentation in any supported format:
   - Project reports (PDF, DOCX)
   - Meeting notes (TXT, DOCX)
   - Financial data (XLSX)
   - Presentations (DOCX converted to)

### Step 3: Generate Case Study
1. Click "Generate Case Study" button
2. Wait for AI analysis and generation
3. Review the templated case study in the preview

### Step 4: Download or Save
1. **Download**: Export as DOCX for further editing in Word
2. **Save to History**: Store in browser's local storage for future reference
3. **Create Another**: Reset form to generate a new case study

## Configuration

### OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create `.env` file in backend directory:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   FLASK_ENV=development
   ```

### CORS Configuration

If your frontend is on a different domain, update the CORS settings in `app.py`:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"]
    }
})
```

## Supported File Formats

| Format | Extension | Purpose |
|--------|-----------|---------|
| PDF | .pdf | Reports, presentations |
| Word | .docx, .doc | Documentation, proposals |
| Excel | .xlsx, .xls | Data, metrics, financials |
| Text | .txt | Notes, transcripts |

## Case Study Template

The generated case studies follow this structure:

```
PROJECT NAME - CASE STUDY
Client: [CLIENT NAME] | Industry: [INDUSTRY]

PROBLEM STATEMENT
[Description of the business challenge or opportunity]

SOLUTION APPROACH
[Overview of how the problem was addressed]

KEY METRICS
• Metric 1
• Metric 2
• Metric 3

IMPACT SUMMARY
[Quantifiable business impact and results]

IMPLEMENTATION DETAILS
[Key steps and execution approach]

LESSONS LEARNED
[Insights and recommendations for future projects]
```

## Troubleshooting

### Issue: "No module named 'openai'"
**Solution**: Ensure you've installed requirements
```bash
pip install -r requirements.txt
```

### Issue: "OpenAI API key not found"
**Solution**: Create `.env` file with valid API key:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### Issue: CORS errors in browser
**Solution**: Backend and frontend must have compatible CORS configuration:
- Frontend should be on same origin or listed in CORS_ORIGINS
- Update API_BASE_URL in frontend/script.js if on different server

### Issue: File upload fails
**Solution**: Check file constraints:
- File size must be under 50MB
- Format must be: PDF, DOCX, TXT, XLSX, XLS
- Check backend logs for detailed errors

## Development

### Adding New File Formats
1. Update `ALLOWED_EXTENSIONS` in `backend/app.py`
2. Add extraction method in `backend/file_processor.py`
3. Test file parsing

### Customizing Case Study Template
Edit the `_get_template()` method in `backend/case_study_generator.py`:
```python
def _get_template(self):
    return {
        "your_field": "description",
        ...
    }
```

### Modifying AI Prompt
Adjust the system prompt in `case_study_generator.py` `generate()` method to change the tone, format, or focus of generated case studies.

## Performance Tips

- **Keep files under 10MB** for faster processing
- **Use text documents** (TXT) when possible - faster than PDF
- **Batch uploads** - process multiple projects separately for better results
- **Cache results** - case studies are saved locally to avoid regeneration

## Security Considerations

⚠️ **Important**: 
- Never commit `.env` file with real API keys to version control
- Use environment variables for all sensitive configuration
- Validate and sanitize all file inputs
- Implement rate limiting for production use
- Use HTTPS for all API endpoints in production

## Production Deployment

### Backend Deployment (Heroku Example)
```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
heroku config:set OPENAI_API_KEY=sk-your-key-here
```

### Frontend Deployment (Netlify/Vercel)
1. Update API_BASE_URL in script.js to production backend
2. Deploy frontend directory to Netlify/Vercel
3. Configure environment variables in deployment dashboard

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Support

For issues, questions, or suggestions:
- Check the Troubleshooting section
- Review the API documentation
- Check the browser console for errors
- Review backend logs in terminal

## Future Enhancements

🚀 **Planned Features:**
- [ ] Multiple language support
- [ ] Custom template creation
- [ ] Batch processing
- [ ] Team collaboration features
- [ ] Advanced analytics and metrics
- [ ] Integration with document management systems
- [ ] Image and chart extraction from PDFs
- [ ] Export to PDF format
- [ ] Email delivery of case studies
- [ ] API authentication and rate limiting

## Credits

Built with Python Flask and OpenAI GPT-4 API

---

**Last Updated**: January 2026
**Version**: 1.0.0
