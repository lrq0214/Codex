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
   - Upload a test document (project deliverables)
   - Optionally upload template examples (case studies to match style)
   - Click "Generate Case Study"
   - Preview and download the result

---

### 📂 Example Usage

**Option 1: Generate from Project Files Only**
- Project Name: "Digital Transformation at TechCorp"
- Client Name: "TechCorp Industries"
- Industry: "Technology"
- Files: Project proposal (PDF), meeting notes (DOCX), financial impact (XLSX)

**Option 2: Generate Using Template Examples**
- Same project information as above
- Project Files: Project proposal, meeting notes, financial data
- Template Examples: 2-3 example case studies in PDF/DOCX format that show desired style
- Result: Case study matches the format and style of your template examples

**Expected Output:**
A professional one-page Word document with:
- Executive summary of the transformation
- Solution implemented
- Key metrics and ROI
- Business impact
- Implementation timeline
- Lessons learned

---

### 📎 Template Examples (Optional Feature)

**What are Template Examples?**
Upload 2-3 example case studies in PDF or DOCX format to guide the AI's writing style, format, and structure. The AI will use these as style references while generating your case study based on actual project deliverables.

**How to Use:**
1. Prepare 1-3 example case studies in PDF or DOCX format
2. In Step 2b "Upload Template Examples", drag-drop or browse your examples
3. Upload project deliverables as normal in Step 2a
4. Click "Generate Case Study"
5. The AI will follow the style/format of your templates while focusing on your project content

**Benefits:**
✅ Consistent writing style across case studies
✅ Matches your brand's case study format
✅ Faster generation with less post-editing needed
✅ Professional appearance aligned with examples
✅ Optional - works great with or without templates

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

| File Type | Extensions | Use Case | Can Use as Template? |
|-----------|-----------|----------|-----|
| PDF | .pdf | Reports, presentations, case studies | ✅ Yes |
| Word | .docx, .doc | Proposals, documentation, case studies | ✅ Yes (DOCX) |
| Excel | .xlsx, .xls | Data, metrics, budgets | ❌ No |
| Text | .txt | Notes, transcripts | ❌ No |

**Note:** Template examples should be PDF or DOCX files. Excel and text files are supported only as project deliverables.

---

### 🎯 Next Steps

1. Generate your first case study
2. Download and customize in Word
3. Save to history for future reference
4. Create multiple case studies for different projects
5. Share with clients and stakeholders

---

**Need Help?** See full documentation in README.md
