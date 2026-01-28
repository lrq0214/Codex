# API Testing Guide

## Prerequisites

- Backend running on `http://localhost:5000`
- Sample files for testing
- curl or Postman (optional)

## Health Check

### Using curl
```bash
curl http://localhost:5000/api/health
```

### Expected Response
```json
{
  "status": "ok"
}
```

## File Upload and Case Study Generation

### Using curl

```bash
# With all metadata
curl -X POST http://localhost:5000/api/upload \
  -F "file=@path/to/your/file.pdf" \
  -F "projectTitle=Digital Transformation Initiative" \
  -F "clientName=Acme Corporation" \
  -F "consultantName=Jane Consultant"

# Minimal upload (with just file)
curl -X POST http://localhost:5000/api/upload \
  -F "file=@document.pdf"
```

### Expected Response
```json
{
  "success": true,
  "caseStudy": {
    "projectTitle": "Digital Transformation Initiative",
    "clientName": "Acme Corporation",
    "consultantName": "Jane Consultant",
    "problem": "The client faced challenges with legacy system integration and data silos across departments...",
    "solution": "We implemented a comprehensive cloud migration strategy with modern APIs and data architecture...",
    "impact": "Achieved 35% operational cost reduction and improved data accessibility across the organization...",
    "keyTakeaways": [
      "Cloud-first approach accelerates modernization",
      "Proper data governance enables better insights",
      "Change management is critical for adoption"
    ]
  }
}
```

## PDF Export

### Using curl

```bash
curl -X POST http://localhost:5000/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "caseStudy": {
      "projectTitle": "Sample Project",
      "clientName": "Sample Client",
      "consultantName": "Sample Consultant",
      "problem": "Problem description here",
      "solution": "Solution description here",
      "impact": "Impact description here",
      "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
    }
  }' \
  -o case-study.pdf
```

### Expected Output
Downloads a PDF file with the case study formatted as a one-page document.

## Using Postman

### Setup

1. **Create a new collection** called "Case Study Generator"

2. **Add Health Check request**
   - Method: GET
   - URL: `http://localhost:5000/api/health`
   - Click Send

3. **Add Upload request**
   - Method: POST
   - URL: `http://localhost:5000/api/upload`
   - Go to Body tab
   - Select "form-data"
   - Add fields:
     - Key: `file` | Type: File | Value: Select a file
     - Key: `projectTitle` | Type: Text | Value: Your project title
     - Key: `clientName` | Type: Text | Value: Client name
     - Key: `consultantName` | Type: Text | Value: Consultant name
   - Click Send

4. **Add Export PDF request**
   - Method: POST
   - URL: `http://localhost:5000/api/export-pdf`
   - Headers: Add `Content-Type: application/json`
   - Body: Raw JSON
   ```json
   {
     "caseStudy": {
       "projectTitle": "Test Project",
       "clientName": "Test Client",
       "consultantName": "Test Consultant",
       "problem": "Test problem",
       "solution": "Test solution",
       "impact": "Test impact",
       "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
     }
   }
   ```
   - Right-click and select "Send and Download" to save PDF

## Test Scenarios

### Scenario 1: Basic Upload
1. Create a simple text file with consulting project details
2. Upload with metadata
3. Verify case study is generated correctly

### Scenario 2: Different File Formats
Test with:
- PDF document
- Word document (.docx)
- Excel spreadsheet (.xlsx)
- Plain text (.txt)

### Scenario 3: Error Handling
1. Try uploading an unsupported file type (e.g., .exe)
   - Expected: Error message about invalid file type
2. Try uploading a file larger than 50MB
   - Expected: Error message about file size
3. Upload with empty file
   - Expected: Error message about no file

### Scenario 4: Missing Metadata
Upload without optional fields:
- Should still generate case study with default values
- Project title defaults to "Untitled Project"

### Scenario 5: Large Document
1. Create a comprehensive consulting report (5+ pages)
2. Upload and generate case study
3. Verify summary captures key points

## Performance Testing

### Load Testing
```bash
# Using Apache Bench (ab)
ab -n 10 -c 2 http://localhost:5000/api/health
```

### Concurrent File Uploads
```bash
# Using parallel uploads
for i in {1..3}; do
  curl -X POST http://localhost:5000/api/upload \
    -F "file=@test$i.pdf" &
done
wait
```

## Debugging Failed Requests

### Check Backend Logs
Look for error messages in Terminal 1 where server is running:
```
Error generating case study: [error details]
```

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Wrong endpoint URL | Verify URL is correct |
| 400 Bad Request | Missing required field | Include all required fields |
| 500 Server Error | API key issue | Check OPENAI_API_KEY in .env |
| File size exceeded | File > 50MB | Reduce file size |
| Invalid file type | Unsupported format | Use PDF, DOCX, TXT, XLS, XLSX |

## Expected Response Times

- Health check: <100ms
- File upload (1-5MB): 10-30 seconds (depends on OpenAI API)
- PDF generation: 2-5 seconds
- Large document (20MB+): 30-60 seconds

## Cleanup After Testing

1. Remove test files from `server/uploads/` (should be empty)
2. Check server logs for any lingering errors
3. Verify no temporary files remain

## Browser Testing

### Test File Upload via UI

1. Open `http://localhost:3000`
2. Fill in optional fields:
   - Project Title
   - Client Name
   - Consultant Name
3. Drag and drop a file (or click to select)
4. Click "Generate Case Study"
5. Wait for processing
6. Review generated case study
7. Click "Export as PDF" to download
8. Click "New Case Study" to test again

### Test Responsive Design

Open DevTools (F12):
- Switch to device toolbar (Ctrl+Shift+M)
- Test on various screen sizes:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1920px)

## Test Data

### Sample Consulting Brief
```
PROJECT SUMMARY: Digital Transformation Initiative

CLIENT: TechFlow Industries
CONSULTANT: Strategic Solutions LLC

CHALLENGE:
TechFlow Industries, a mid-sized manufacturing company, struggled with outdated legacy systems that prevented real-time data visibility. Multiple departments operated in silos with incompatible systems, leading to duplicated efforts and delayed decision-making.

APPROACH:
We conducted a comprehensive systems audit and designed a phased cloud migration strategy. We implemented integrated ERP systems, established data governance frameworks, and provided change management support.

OUTCOMES:
- Reduced operational costs by 35%
- Improved data visibility across departments
- Decreased order-to-delivery cycle by 40%
- Increased employee adoption rate to 95%

KEY LEARNINGS:
1. Executive sponsorship is critical
2. Change management requires sustained effort
3. Modern infrastructure enables better analytics
```

---

**Testing Complete Checklist**

- [ ] Health check endpoint works
- [ ] Single file upload succeeds
- [ ] All file formats supported
- [ ] PDF export works
- [ ] Error handling for invalid files
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] No lingering temporary files
