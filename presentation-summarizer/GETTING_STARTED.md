# Getting Started with Presentation Summarizer

## 🚀 Start the Web App (30 seconds)

### Windows
1. Open PowerShell in the project folder
2. Run: `.\run.bat`
3. Browser opens to **http://localhost:5000**

### macOS/Linux
1. Open Terminal in the project folder
2. Run: `chmod +x run.sh && ./run.sh`
3. Browser opens to **http://localhost:5000**

## 🌐 Web Interface Features

### Step 1: Upload
- Drag & drop your PowerPoint file
- Or click to browse and select

### Step 2: Configure
- **Summary Length**: Slide 200-800 words (default: 400)
- **AI Model**: 
  - GPT-3.5 Turbo: Fast & cost-effective ⚡
  - GPT-4: Better quality but slower 🎯

### Step 3: Review & Download
- See the generated title and summary
- Download as PowerPoint slide
- Edit and try again if needed

## 📋 Requirements

Before starting, make sure you have:

1. **Python 3.8+**
   ```bash
   python --version
   ```

2. **OpenAI API Key**
   - Get one at: https://platform.openai.com/api-keys
   - Set it: `set OPENAI_API_KEY=sk-...` (Windows)
   - Or: `export OPENAI_API_KEY=sk-...` (Mac/Linux)

## 🎯 Quick Tips

- **Large presentations**: Use GPT-3.5-turbo for faster processing
- **Better summaries**: Use GPT-4 (costs more, takes longer)
- **Fine-tune length**: Adjust the slider based on complexity
- **File size**: Maximum 50MB

## 🐛 Troubleshooting

**"Port 5000 already in use"**
- Change port in `app.py`: `port=5001`

**"API key not configured"**
- Set environment variable before running
- Or create `.env` file in project root

**"ModuleNotFoundError"**
- Reinstall: `pip install -r requirements.txt`

**Upload fails**
- Check file is .pptx format
- File size under 50MB
- Valid PowerPoint file

## 📚 Full Documentation

- `README.md` - Complete documentation
- `QUICKSTART.md` - Command-line quick start
- `WEB_DEPLOYMENT.md` - Deployment guide

## 🔗 Useful Links

- **OpenAI API**: https://platform.openai.com/
- **Python**: https://www.python.org/
- **Flask**: https://flask.palletsprojects.com/

---

**Questions?** Check the documentation files or review the source code in `src/`.
