# Case Study Generator - Configuration Guide

## Environment Setup

### Backend Configuration (`.env` file)

Create a `.env` file in the `backend/` directory with the following variables:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Application Settings
MAX_FILE_SIZE_MB=50
ALLOWED_EXTENSIONS=pdf,docx,txt,xlsx,xls

# Storage Settings
UPLOAD_FOLDER=uploads
OUTPUT_FOLDER=outputs

# CORS Settings (for production)
CORS_ORIGINS=http://localhost:8000,https://yourdomain.com

# Server Settings
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Frontend Configuration (`script.js`)

Update API endpoint in `frontend/script.js`:

```javascript
// Development
const API_BASE_URL = 'http://localhost:5000/api';

// Production
// const API_BASE_URL = 'https://api.yourdomain.com/api';
```

---

## OpenAI Configuration

### Getting Your API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in with your account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (you won't see it again!)
6. Add to `.env` file:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

### API Models

The application uses GPT-4 for generation. To change the model:

**In `backend/case_study_generator.py`:**
```python
class CaseStudyGenerator:
    def __init__(self):
        self.model = "gpt-4"  # Change to "gpt-3.5-turbo" for cost savings
```

### Model Comparison

| Model | Cost | Speed | Quality |
|-------|------|-------|---------|
| gpt-4 | $$$ | Slow | Best |
| gpt-3.5-turbo | $ | Fast | Good |

---

## File Upload Configuration

### Allowed File Types

Edit in `backend/app.py`:
```python
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'xlsx', 'xls'}
```

### File Size Limits

```python
# In app.py
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE
```

### Add New File Type Support

1. **Update allowed extensions:**
   ```python
   ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'xlsx', 'xls', 'pptx'}  # Added pptx
   ```

2. **Add extraction method in `file_processor.py`:**
   ```python
   def _extract_pptx(self, filepath):
       """Extract text from PowerPoint"""
       try:
           from pptx import Presentation
           presentation = Presentation(filepath)
           content = []
           for slide in presentation.slides:
               for shape in slide.shapes:
                   if hasattr(shape, "text"):
                       content.append(shape.text)
           return '\n'.join(content)
       except ImportError:
           return "python-pptx not available"
   ```

3. **Update main extract method:**
   ```python
   def extract_content(self, filepath):
       file_ext = Path(filepath).suffix.lower()
       
       if file_ext == '.pptx':
           return self._extract_pptx(filepath)
       # ... rest of conditions
   ```

4. **Install required dependency:**
   ```bash
   pip install python-pptx
   ```

---

## Case Study Template Customization

### Modify Template Sections

Edit `backend/case_study_generator.py`:

```python
def _get_template(self):
    """Customize case study structure"""
    return {
        "executive_summary": "Brief overview",
        "problem_statement": "Business challenge",
        "solution_approach": "Solution overview",
        "key_metrics": ["metric1", "metric2"],
        "impact_summary": "Business impact",
        "implementation_details": "How it was done",
        "lessons_learned": "Key insights",
        "recommendations": "Future suggestions"  # New section
    }
```

### Update Prompt for Different Tone

**Professional/Formal:**
```python
prompt = f"""
Generate a formal, executive-level case study...
"""
```

**Casual/Conversational:**
```python
prompt = f"""
Generate a conversational, engaging case study...
"""
```

**Technical/Detailed:**
```python
prompt = f"""
Generate a detailed, technical case study with implementation specifics...
"""
```

---

## Output Format Customization

### Change Document Styling

Edit `backend/case_study_generator.py` - `save_to_docx()` method:

```python
def save_to_docx(self, case_study, filepath):
    """Customize document appearance"""
    doc = Document()
    
    # Change title font
    title = doc.add_paragraph()
    title_run = title.add_run(f"{case_study['metadata']['project_name']}")
    title_run.font.size = Pt(24)  # Change from Pt(18)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(37, 99, 235)  # Blue
    
    # Change heading style
    heading = doc.add_heading(section_title, level=2)
    heading_format = heading.paragraph_format
    heading_format.space_before = Pt(12)
    heading_format.space_after = Pt(6)
    
    # Add custom styles
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
```

### Export to Different Formats

**Add JSON export:**
```python
def save_to_json(self, case_study, filepath):
    import json
    with open(filepath, 'w') as f:
        json.dump(case_study, f, indent=2)
```

**Add Markdown export:**
```python
def save_to_markdown(self, case_study, filepath):
    with open(filepath, 'w') as f:
        f.write(f"# {case_study['metadata']['project_name']}\n\n")
        f.write(f"**Client:** {case_study['metadata']['client_name']}\n")
        f.write(f"**Industry:** {case_study['metadata']['industry']}\n\n")
        # ... add sections in markdown
```

---

## Frontend Customization

### Update Colors and Branding

Edit `frontend/styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Change blue */
    --secondary-color: #1e40af;    /* Change dark blue */
    --success-color: #16a34a;      /* Change green */
    --brand-font: 'Georgia', serif; /* Change font */
}

/* Change header background */
.header {
    background: linear-gradient(135deg, #FF6B6B, #FF8E72);
}
```

### Add Company Logo

In `frontend/index.html`:
```html
<header class="header">
    <div class="header-content">
        <img src="logo.png" alt="Company Logo" class="logo">
        <h1>📋 Case Study Generator</h1>
        <p>Your company description</p>
    </div>
</header>
```

Update CSS:
```css
.logo {
    max-width: 100px;
    margin-bottom: 1rem;
}
```

### Customize Industry Options

In `frontend/index.html`:
```html
<select id="industry" name="industry">
    <option value="">Select an industry</option>
    <option value="Technology">Technology</option>
    <option value="Finance">Finance</option>
    <!-- Add your industries -->
    <option value="Your Industry">Your Industry</option>
</select>
```

---

## Security Configuration

### Enable HTTPS in Production

**In `backend/app.py`:**
```python
import ssl

if __name__ == '__main__':
    # Development
    app.run(debug=True)
    
    # Production with SSL
    # context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    # context.load_cert_chain('cert.pem', 'key.pem')
    # app.run(ssl_context=context)
```

### Add Rate Limiting

```bash
pip install Flask-Limiter
```

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/generate-case-study', methods=['POST'])
@limiter.limit("5 per hour")
def generate_case_study():
    # ... function code
```

### Add API Authentication

```python
from functools import wraps
import secrets

VALID_API_KEYS = set([secrets.token_urlsafe(32)])

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key not in VALID_API_KEYS:
            return {'error': 'Invalid API key'}, 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/generate-case-study', methods=['POST'])
@require_api_key
def generate_case_study():
    # ... protected endpoint
```

---

## Deployment Configuration

### Docker Configuration

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

ENV OPENAI_API_KEY=${OPENAI_API_KEY}

EXPOSE 5000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t case-study-generator .
docker run -e OPENAI_API_KEY=sk-... -p 5000:5000 case-study-generator
```

### Heroku Deployment

1. **Create `Procfile`:**
   ```
   web: gunicorn app:app
   ```

2. **Install gunicorn:**
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

3. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set OPENAI_API_KEY=sk-...
   git push heroku main
   ```

### AWS Lambda Deployment

Use AWS SAM template or Zappa:
```bash
pip install zappa
zappa init  # Initialize
zappa deploy production  # Deploy
```

---

## Monitoring and Logging

### Enable Application Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.route('/api/generate-case-study', methods=['POST'])
def generate_case_study():
    logger.info("Generating case study")
    try:
        # ... code
        logger.info("Case study generated successfully")
    except Exception as e:
        logger.error(f"Error: {str(e)}")
```

### Add Health Monitoring

```python
@app.route('/health', methods=['GET'])
def health_check():
    """Detailed health check"""
    return {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'openai_api': check_openai_connection(),
        'storage': check_storage_space()
    }
```

---

## Performance Optimization

### Caching

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def extract_and_process(filepath):
    return processor.extract_content(filepath)
```

### Async Processing

```python
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=3)

@app.route('/api/generate-case-study', methods=['POST'])
def generate_case_study():
    future = executor.submit(process_case_study, data)
    # Return job ID, allow polling for results
```

---

## Testing Configuration

Create `test_config.py`:
```python
import os

class TestConfig:
    TESTING = True
    UPLOAD_FOLDER = 'test_uploads'
    OUTPUT_FOLDER = 'test_outputs'
    OPENAI_API_KEY = 'test-key'
    MAX_FILE_SIZE = 50 * 1024 * 1024
```

Run tests:
```bash
pytest tests/ -v
```

---

**Last Updated**: January 2026
**Configuration Version**: 1.0.0
