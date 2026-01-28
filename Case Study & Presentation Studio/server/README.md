# Case Study Generator - Server

Express backend API for processing consulting project deliverables and generating case studies.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/upload
Uploads a file and generates a case study.

**Request:**
- `file` (multipart): The document file (PDF, DOCX, TXT, XLS, XLSX)
- `projectTitle` (optional): Project title
- `clientName` (optional): Client name
- `consultantName` (optional): Consultant name

**Response:**
```json
{
  "success": true,
  "caseStudy": {
    "projectTitle": "string",
    "clientName": "string",
    "consultantName": "string",
    "problem": "string",
    "solution": "string",
    "impact": "string",
    "keyTakeaways": ["string"]
  }
}
```

### POST /api/export-pdf
Generates a PDF from a case study.

**Request:**
```json
{
  "caseStudy": { /* case study object */ }
}
```

**Response:** PDF file

### GET /api/health
Health check endpoint.
