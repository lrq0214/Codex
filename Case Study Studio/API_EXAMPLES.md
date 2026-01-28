# Case Study Studio - API Examples

## 1. Health Check

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-28T12:00:00.000000"
}
```

---

## 2. Upload Files

```bash
curl -X POST http://localhost:5000/api/upload \
  -F "files=@project_report.pdf" \
  -F "files=@meeting_notes.docx" \
  -F "projectName=Digital Transformation" \
  -F "clientName=Acme Corp" \
  -F "industry=Technology"
```

**Response:**
```json
{
  "success": true,
  "uploaded_files": [
    {
      "original_name": "project_report.pdf",
      "saved_name": "20260128_120000_project_report.pdf",
      "filepath": "uploads/20260128_120000_project_report.pdf",
      "size": 1024000
    },
    {
      "original_name": "meeting_notes.docx",
      "saved_name": "20260128_120000_meeting_notes.docx",
      "filepath": "uploads/20260128_120000_meeting_notes.docx",
      "size": 512000
    }
  ],
  "errors": [],
  "metadata": {
    "project_name": "Digital Transformation",
    "client_name": "Acme Corp",
    "industry": "Technology"
  }
}
```

---

## 3. Generate Case Study

```bash
curl -X POST http://localhost:5000/api/generate-case-study \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {
        "filepath": "uploads/20260128_120000_project_report.pdf",
        "original_name": "project_report.pdf"
      }
    ],
    "projectName": "Digital Transformation",
    "clientName": "Acme Corp",
    "industry": "Technology",
    "additionalContext": "Led the company through a complete digital overhaul"
  }'
```

**Response:**
```json
{
  "success": true,
  "case_study": {
    "problem_statement": "Acme Corporation faced significant operational inefficiencies...",
    "solution_approach": "We implemented a comprehensive digital transformation strategy...",
    "key_metrics": [
      "40% improvement in operational efficiency",
      "30% cost reduction",
      "95% system uptime achieved"
    ],
    "impact_summary": "The digital transformation initiative resulted in...",
    "implementation_details": "The implementation was executed in three phases...",
    "lessons_learned": "Key insights from the project included...",
    "metadata": {
      "project_name": "Digital Transformation",
      "client_name": "Acme Corp",
      "industry": "Technology",
      "model_used": "gpt-4"
    }
  },
  "output_file": "case_study_20260128_120000.docx",
  "output_path": "outputs/case_study_20260128_120000.docx",
  "generated_at": "2026-01-28T12:00:00.000000"
}
```

---

## 4. List Case Studies

```bash
curl http://localhost:5000/api/case-studies
```

**Response:**
```json
{
  "case_studies": [
    {
      "filename": "case_study_20260128_120000.docx",
      "created_at": "2026-01-28T12:00:00.000000",
      "size": 45000
    },
    {
      "filename": "case_study_20260128_110000.docx",
      "created_at": "2026-01-28T11:00:00.000000",
      "size": 42000
    }
  ]
}
```

---

## 5. Download Case Study

```bash
curl -O http://localhost:5000/api/download/case_study_20260128_120000.docx
```

Downloads the file to your current directory.

---

## Python Client Example

```python
import requests
import json

# Configuration
API_URL = "http://localhost:5000/api"

class CaseStudyClient:
    def __init__(self, base_url=API_URL):
        self.base_url = base_url
    
    def health_check(self):
        """Check API health"""
        response = requests.get(f"{self.base_url}/../health")
        return response.json()
    
    def upload_files(self, files, project_name, client_name, industry):
        """Upload project files"""
        file_list = [('files', open(f, 'rb')) for f in files]
        
        data = {
            'projectName': project_name,
            'clientName': client_name,
            'industry': industry
        }
        
        response = requests.post(
            f"{self.base_url}/upload",
            files=file_list,
            data=data
        )
        return response.json()
    
    def generate_case_study(self, files, project_name, client_name, 
                          industry, additional_context=""):
        """Generate case study from uploaded files"""
        payload = {
            'files': files,
            'projectName': project_name,
            'clientName': client_name,
            'industry': industry,
            'additionalContext': additional_context
        }
        
        response = requests.post(
            f"{self.base_url}/generate-case-study",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        return response.json()
    
    def list_case_studies(self):
        """List all generated case studies"""
        response = requests.get(f"{self.base_url}/case-studies")
        return response.json()
    
    def download_case_study(self, filename, save_path):
        """Download case study file"""
        response = requests.get(
            f"{self.base_url}/download/{filename}",
            stream=True
        )
        
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return save_path

# Usage Example
if __name__ == "__main__":
    client = CaseStudyClient()
    
    # Check health
    print("Health Check:", client.health_check())
    
    # Upload files
    files = ['project_report.pdf', 'meeting_notes.docx']
    upload_result = client.upload_files(
        files=files,
        project_name="Digital Transformation",
        client_name="Acme Corp",
        industry="Technology"
    )
    print("Upload Result:", upload_result)
    
    # Generate case study
    if upload_result['success']:
        case_study = client.generate_case_study(
            files=upload_result['uploaded_files'],
            project_name="Digital Transformation",
            client_name="Acme Corp",
            industry="Technology",
            additional_context="Complete digital overhaul project"
        )
        print("Generated Case Study:", case_study)
        
        # Download the generated file
        if case_study['success']:
            client.download_case_study(
                filename=case_study['output_file'],
                save_path=f"downloaded_{case_study['output_file']}"
            )
            print("Downloaded case study file")
    
    # List all case studies
    case_studies = client.list_case_studies()
    print("All Case Studies:", case_studies)
```

---

## JavaScript/Fetch Example

```javascript
class CaseStudyAPI {
    constructor(baseUrl = 'http://localhost:5000/api') {
        this.baseUrl = baseUrl;
    }
    
    async uploadFiles(files, metadata) {
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('files', file);
        });
        
        formData.append('projectName', metadata.projectName);
        formData.append('clientName', metadata.clientName);
        formData.append('industry', metadata.industry);
        
        const response = await fetch(`${this.baseUrl}/upload`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }
    
    async generateCaseStudy(uploadedFiles, metadata) {
        const payload = {
            files: uploadedFiles,
            projectName: metadata.projectName,
            clientName: metadata.clientName,
            industry: metadata.industry,
            additionalContext: metadata.additionalContext || ''
        };
        
        const response = await fetch(`${this.baseUrl}/generate-case-study`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        return response.json();
    }
    
    async listCaseStudies() {
        const response = await fetch(`${this.baseUrl}/case-studies`);
        return response.json();
    }
    
    async downloadCaseStudy(filename) {
        const response = await fetch(`${this.baseUrl}/download/${filename}`);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}

// Usage Example
const api = new CaseStudyAPI();

// Upload and generate
async function createCaseStudy() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    
    const metadata = {
        projectName: 'Digital Transformation',
        clientName: 'Acme Corp',
        industry: 'Technology'
    };
    
    try {
        // Upload files
        const uploadResult = await api.uploadFiles(files, metadata);
        console.log('Upload successful:', uploadResult);
        
        // Generate case study
        const caseStudy = await api.generateCaseStudy(
            uploadResult.uploaded_files,
            metadata
        );
        console.log('Case study generated:', caseStudy);
        
        // Download the result
        await api.downloadCaseStudy(caseStudy.output_file);
        
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## Error Handling Examples

### File Upload Error
```json
{
  "error": "File too large. Maximum size is 50MB"
}
```

### Missing Required Fields
```json
{
  "error": "No files provided"
}
```

### Generation Error
```json
{
  "error": "Case study generation failed: OpenAI API error"
}
```

### File Not Found
```json
{
  "error": "File not found"
}
```

---

**Last Updated**: January 2026
