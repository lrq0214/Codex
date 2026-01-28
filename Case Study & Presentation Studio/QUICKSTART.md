# Quick Start Guide

## What You Get

A complete, production-ready Case Study Generator application that:
- Accepts consulting project deliverables via file upload
- Uses AI to analyze and summarize the documents
- Generates professional one-page case studies
- Exports results as PDF documents

## 5-Minute Setup

### 1. Get Your OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create a new API key and copy it

### 2. Configure Backend
```bash
cd server
cp .env.example .env
# Edit .env and paste your OpenAI API key
```

### 3. Install Dependencies
```bash
# Terminal 1 - Install and start backend
cd server
npm install
npm start

# Terminal 2 - Install and start frontend
cd client
npm install
npm start
```

### 4. Open Application
- Frontend automatically opens at http://localhost:3000
- Backend runs on http://localhost:5000

## Using the Application

1. **Fill in project details** (optional):
   - Project Title
   - Client Name
   - Consultant Name

2. **Upload a file**:
   - Drag and drop, or click to select
   - Supported formats: PDF, DOCX, TXT, XLSX, etc.

3. **Generate case study**:
   - Click "Generate Case Study"
   - Wait for AI processing (10-30 seconds)

4. **Export results**:
   - Click "Export as PDF" to download
   - Click "New Case Study" to process another file

## Key Features

✅ **Drag-and-drop file upload**  
✅ **AI-powered content analysis**  
✅ **Structured output** (Problem, Solution, Impact, Key Takeaways)  
✅ **Professional PDF export**  
✅ **Responsive design** (works on mobile and desktop)  
✅ **Error handling** with user-friendly messages  

## Project Structure

```
.
├── server/              # Backend API
│   ├── services/        # AI and PDF generation logic
│   ├── server.js        # Express server
│   └── .env.example     # Config template
├── client/              # Frontend React app
│   └── src/
│       ├── components/  # UI components
│       └── App.js       # Main app
├── README.md            # Full documentation
├── SETUP.md             # Detailed setup
├── TESTING.md           # API testing guide
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Common Tasks

### Add Your Own Logo
Edit `client/public/index.html` and add your branding

### Customize Case Study Format
Edit `server/services/caseStudyGenerator.js` to change the AI prompt

### Change the Color Theme
Edit `client/src/App.css` and update the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Deploy to Production
See `README.md` for deployment instructions

## Troubleshooting

### "Module not found" error
```bash
# Re-install dependencies
cd server && npm install
cd ../client && npm install
```

### "Cannot connect to backend"
- Ensure backend is running in Terminal 1
- Check that backend is on port 5000
- Verify proxy in `client/package.json`

### "Invalid API key"
- Double-check your OpenAI API key
- Ensure it doesn't have spaces
- Verify the key has active credits

### File upload not working
- Check file size (max 50MB)
- Verify file format is supported
- Check browser console for errors (F12)

## Next Steps

1. **Test with sample documents** - Try uploading a consulting report
2. **Customize the prompt** - Adjust AI behavior in `caseStudyGenerator.js`
3. **Add authentication** - Implement login for team collaboration
4. **Store results** - Add a database to save case studies
5. **Extend templates** - Create multiple case study formats

## Useful Commands

```bash
# Start backend in development mode (auto-reload)
cd server && npm run dev

# Build frontend for production
cd client && npm run build

# Test API endpoints
curl http://localhost:5000/api/health

# Check dependencies
npm list
```

## Documentation Files

- **README.md** - Full project documentation
- **SETUP.md** - Detailed installation and configuration
- **TESTING.md** - API testing guide with curl examples
- **.github/copilot-instructions.md** - Development guidelines
- **server/README.md** - Backend API documentation

## Support

If you encounter issues:
1. Check the **SETUP.md** troubleshooting section
2. Review server logs in Terminal 1
3. Check browser console (F12) for errors
4. Verify OpenAI API key is valid
5. Ensure both frontend and backend are running

## Architecture Overview

```
User Browser (http://localhost:3000)
    ↓
React Frontend (UI & Form)
    ↓
Express API (http://localhost:5000)
    ↓
OpenAI GPT-4 (Content Analysis)
    ↓
PDF Generation (PDFKit)
    ↓
User downloads PDF
```

## What Happens When You Upload

1. File sent to backend via multipart form
2. File saved temporarily to `server/uploads/`
3. Content extracted from file
4. AI analyzes content and generates structured output
5. Temporary file deleted
6. Results displayed in UI
7. User can download as PDF

## Performance Tips

- Keep documents under 20MB for faster processing
- Use clear, structured document formats (DOCX, PDF)
- Ensure good internet connection for API calls
- Close other applications to free up memory

## Production Checklist

Before deploying to production:

- [ ] Change gradient colors to match branding
- [ ] Add authentication for team access
- [ ] Implement database for storing case studies
- [ ] Add rate limiting to API endpoints
- [ ] Set up error logging and monitoring
- [ ] Configure CORS properly
- [ ] Add input validation and sanitization
- [ ] Implement request timeouts
- [ ] Set up SSL/HTTPS
- [ ] Add analytics tracking

---

**You're all set!** Start by uploading a sample consulting document and see the case study generator in action. 🚀

For detailed information, check out:
- Full docs: [README.md](README.md)
- API reference: [server/README.md](server/README.md)
- Testing guide: [TESTING.md](TESTING.md)
