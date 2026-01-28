# ✅ Pre-Launch Checklist

Everything you need to run the Presentation Summarizer!

## 🔍 System Requirements

- [ ] Python 3.8 or higher installed
- [ ] Internet connection (for OpenAI API)
- [ ] At least 100MB free disk space
- [ ] PowerPoint file in .pptx format (up to 50MB)

**Check Python version:**
```bash
python --version
```

## 🔑 API Key Setup

- [ ] Create OpenAI account at https://platform.openai.com
- [ ] Generate API key from https://platform.openai.com/api-keys
- [ ] Copy the API key (starts with `sk-`)
- [ ] Set environment variable:
  - Windows: `set OPENAI_API_KEY=sk-your-key-here`
  - Mac/Linux: `export OPENAI_API_KEY=sk-your-key-here`

**Verify setup:**
```bash
echo $OPENAI_API_KEY  # Mac/Linux
echo %OPENAI_API_KEY%  # Windows
```

## 📦 Dependencies Installation

- [ ] Navigate to project directory
- [ ] Run: `pip install -r requirements.txt`
- [ ] Wait for completion (may take 1-2 minutes)

**Verify installation:**
```bash
pip list | grep -E "python-pptx|openai|flask|click"
```

## 🌐 Web Application Setup

- [ ] Ensure `app.py` exists in project root
- [ ] Ensure `templates/index.html` exists
- [ ] Ensure `static/` folder with CSS and JS files
- [ ] Check that `src/` folder has all modules

**Verify files:**
```bash
# Windows
dir /B app.py, templates\index.html, static\style.css

# Mac/Linux
ls app.py templates/index.html static/style.css
```

## 🚀 Launch Options

### Option 1: Web Interface (Recommended)

- [ ] Windows users: Double-click `run.bat` OR run `run.bat` in PowerShell
- [ ] Mac/Linux users: Run `chmod +x run.sh && ./run.sh`
- [ ] Browser opens to http://localhost:5000
- [ ] If not, manually open http://localhost:5000

### Option 2: Command Line

- [ ] Prepare your PowerPoint file
- [ ] Run: `python src/cli.py your_presentation.pptx`
- [ ] Output file created as `your_presentation_summary.pptx`

### Option 3: Python Script

- [ ] Create a Python script in project root
- [ ] Import from `src` folder
- [ ] Follow examples in `example_usage.py`

## 🧪 Test the Application

- [ ] Application starts without errors
- [ ] Web interface loads (http://localhost:5000)
- [ ] Upload button is visible and clickable
- [ ] File upload field accepts .pptx files
- [ ] API key validation passes (no warnings)

## 📝 Sample Test

1. [ ] Download or create a sample presentation
2. [ ] Upload through web interface
3. [ ] Verify file is recognized
4. [ ] Set summary length to 300 words
5. [ ] Click "Generate Summary"
6. [ ] Wait for AI to process
7. [ ] Review generated title and summary
8. [ ] Click "Download" 
9. [ ] Save the PowerPoint file
10. [ ] Open downloaded file in PowerPoint
11. [ ] Verify it contains the summary

## 🐛 Troubleshooting Checklist

### If app won't start:
- [ ] Python version is 3.8+
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] Port 5000 is not in use (change in app.py if needed)
- [ ] No typos in OPENAI_API_KEY

### If upload fails:
- [ ] File is .pptx format (not .ppt)
- [ ] File size is under 50MB
- [ ] File is a valid PowerPoint document
- [ ] Filename doesn't have special characters

### If summarization fails:
- [ ] OPENAI_API_KEY is set correctly
- [ ] API key is valid and has remaining quota
- [ ] Internet connection is active
- [ ] Presentation has readable text content

### If download fails:
- [ ] Browser download folder has write permissions
- [ ] Disk has at least 10MB free space
- [ ] Generated summary is not empty

## 📚 Documentation Review

- [ ] Read [INDEX.md](INDEX.md) - Documentation index
- [ ] Read [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start
- [ ] Read [README.md](README.md) - Full documentation
- [ ] Bookmark [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md) for later

## 🔒 Security & Privacy

- [ ] OPENAI_API_KEY is not shared publicly
- [ ] No sensitive files left in temp directory
- [ ] Understand that files are temporarily stored locally
- [ ] Use HTTPS if deploying publicly

## 📱 User Access

- [ ] Share URL for web access: `http://localhost:5000`
- [ ] Ensure firewall allows port 5000 (if needed)
- [ ] For remote access, use VPN or proper deployment method
- [ ] See [WEB_DEPLOYMENT.md](WEB_DEPLOYMENT.md) for cloud deployment

## ✨ Optional Enhancements

- [ ] Set up Git for version control
- [ ] Create `.env` file for credentials (copy from `.env.example`)
- [ ] Run tests: `python -m pytest tests/`
- [ ] Set up Docker for containerization
- [ ] Configure for production deployment

## 📋 Quick Reference

| Task | Command | Time |
|------|---------|------|
| Install | `pip install -r requirements.txt` | 1-2 min |
| Set Key | `set OPENAI_API_KEY=sk-...` | 30 sec |
| Start Web | `run.bat` or `./run.sh` | 5 sec |
| Run CLI | `python src/cli.py file.pptx` | Varies |
| View Docs | Open `INDEX.md` | 2 min |

## 🎯 Success Criteria

✅ Python installed and working  
✅ Dependencies installed successfully  
✅ OPENAI_API_KEY configured  
✅ Web app starts without errors  
✅ Browser opens to http://localhost:5000  
✅ File upload interface visible  
✅ Can upload PowerPoint file  
✅ Can generate summary  
✅ Can download result  
✅ Downloaded file opens in PowerPoint  

## 🎉 You're Ready!

If all boxes are checked, you're ready to:
- ✨ Upload presentations
- 🤖 Generate summaries
- 📊 Create executive slides
- ⬇️ Download PowerPoint files

**Need help?** Check [INDEX.md](INDEX.md) for documentation guides.

---

**Date:** January 27, 2026  
**Version:** 2.0.0  
**Status:** ✅ Ready for Use
