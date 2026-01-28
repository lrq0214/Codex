## Case Study Studio - Quick Start Guide

### 🚀 Start the Application (2 Minutes)

#### Terminal 1 - Backend (Flask API)
```bash
cd backend
pip install -r requirements.txt
# Add your OpenAI API key to .env file first
python app.py
```
Server runs on: `http://localhost:5000`

#### Terminal 2 - Frontend (Web Interface)
```bash
cd frontend
python -m http.server 8000
# or: npx http-server -p 8000
```
Open in browser: `http://localhost:8000`

---

### 📝 First Time Usage

1. **Get OpenAI API Key** (if you don't have one)
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key

2. **Configure Backend**
   - In `backend/.env` file, add:
     ```
     OPENAI_API_KEY=sk-your-key-here
     ```

3. **Test the Application**
   - Navigate to frontend in browser
   - Enter sample project information
   - Upload a test document
   - Click "Generate Case Study"
   - Preview and download the result

---

### 📂 Example Usage

**Sample Project Upload:**
- Project Name: "Digital Transformation at TechCorp"
- Client Name: "TechCorp Industries"
- Industry: "Technology"
- Files: Project proposal (PDF), meeting notes (DOCX), financial impact (XLSX)

**Expected Output:**
A professional one-page Word document with:
- Executive summary of the transformation
- Solution implemented
- Key metrics and ROI
- Business impact
- Implementation timeline
- Lessons learned

---

### 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `pip install -r requirements.txt` |
| "API key not found" | Add OPENAI_API_KEY to .env file |
| "CORS error" | Ensure both services running on correct ports |
| "File upload fails" | Check file size < 50MB and format in [PDF, DOCX, TXT, XLSX] |

---

### 💡 Tips for Best Results

✅ **Do:**
- Use clear, descriptive file names
- Include key deliverables (proposals, reports, data)
- Provide additional context in the context field
- Keep files between 1-10MB for faster processing

❌ **Don't:**
- Upload corrupted or encrypted files
- Use extremely large files (>50MB)
- Leave project fields blank
- Upload files with no relevant content

---

### 📊 Supported Formats

| File Type | Extensions | Use Case |
|-----------|-----------|----------|
| PDF | .pdf | Reports, presentations |
| Word | .docx, .doc | Proposals, documentation |
| Excel | .xlsx, .xls | Data, metrics, budgets |
| Text | .txt | Notes, transcripts |

---

### 🎯 Next Steps

1. Generate your first case study
2. Download and customize in Word
3. Save to history for future reference
4. Create multiple case studies for different projects
5. Share with clients and stakeholders

---

**Need Help?** See full documentation in README.md
