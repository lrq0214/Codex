# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Case Study Generator                        │
│                    Full-Stack Application                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + CSS)                        │
│                   http://localhost:3000                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ App.js (Main Component)                                    │ │
│  │  - State management (caseStudy, loading, error)            │ │
│  │  - Route handlers (upload, export, reset)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                    │                          │                  │
│         ┌──────────┴──────────┐              │                  │
│         ▼                     ▼              ▼                  │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐ │
│  │ FileUpload       │  │ CaseStudyPreview                    │ │
│  │ Component        │  │ Component                           │ │
│  │                  │  │                                     │ │
│  │ - Drag & drop    │  │ - Display results                  │ │
│  │ - File select    │  │ - Export PDF button                │ │
│  │ - Metadata form  │  │ - New case study button            │ │
│  │ - Validation     │  │ - Professional styling             │ │
│  └──────────────────┘  └─────────────────────────────────────┘ │
│         │                              │                        │
│         └──────────────┬───────────────┘                        │
│                        │                                        │
│                        ▼ (Axios HTTP)                          │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ POST /api/upload
                         │ POST /api/export-pdf
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                          │
│                   http://localhost:5000                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ server.js - Express Server                                │ │
│  │  - CORS enabled                                            │ │
│  │  - Multer file upload (temp storage)                       │ │
│  │  - Route handlers                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                        │                                        │
│     ┌──────────────────┼──────────────────┐                    │
│     │                  │                  │                    │
│     ▼                  ▼                  ▼                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ File Upload  │  │ Case Study   │  │ PDF Export   │         │
│  │ Handler      │  │ Generator    │  │ Handler      │         │
│  │              │  │              │  │              │         │
│  │ - Validate   │  │ - Parse docs │  │ - Format PDF │         │
│  │ - Store temp │  │ - Call AI    │  │ - Download   │         │
│  │ - Return path│  │ - Parse JSON │  │ - Cleanup    │         │
│  │ - Cleanup    │  │ - Structure  │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                         │                                       │
│                         ▼ (HTTP)                               │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ (API Key in .env)
                         │
                         ▼
         ┌───────────────────────────────────┐
         │    OpenAI API (GPT-4 Model)       │
         │                                   │
         │ - Analyzes document content       │
         │ - Extracts problem, solution      │
         │ - Generates impact summary        │
         │ - Creates key takeaways           │
         │ - Returns structured JSON         │
         └───────────────────────────────────┘
```

## Data Flow

### 1. File Upload Flow
```
User Browser
    │
    ├─ Enter project metadata (optional)
    ├─ Select or drag-drop file
    │
    ▼ (Submit)
    
Express Server (POST /api/upload)
    │
    ├─ Validate file type
    ├─ Check file size
    ├─ Save to server/uploads/ (temp)
    ├─ Read file content
    │
    ▼
    
Case Study Generator Service
    │
    ├─ Extract text from file
    ├─ Create AI prompt
    ├─ Call OpenAI GPT-4 API
    ├─ Parse JSON response
    │
    ▼
    
OpenAI GPT-4
    │
    ├─ Analyze consulting content
    ├─ Extract: Problem, Solution, Impact
    ├─ Generate: Key Takeaways
    ├─ Format as JSON
    │
    ▼
    
Backend Response
    │
    ├─ Return case study object
    ├─ Delete temp file
    ├─ Send to frontend
    │
    ▼
    
Frontend Display
    │
    ├─ Show case study preview
    ├─ Enable PDF export button
    ├─ Allow new upload
```

### 2. PDF Export Flow
```
User Browser (Click "Export as PDF")
    │
    ▼ (POST /api/export-pdf)
    
Express Server
    │
    ├─ Receive case study object
    │
    ▼
    
PDF Generator Service (PDFKit)
    │
    ├─ Create new PDF document
    ├─ Add title and metadata
    ├─ Format sections (Problem, Solution, Impact)
    ├─ Add key takeaways list
    ├─ Add footer with date
    │
    ▼
    
PDF Buffer
    │
    ├─ Set response headers
    ├─ Return as attachment
    ├─ Browser downloads file
```

## Component Hierarchy

```
App.js
├── Header
│   ├── Title
│   └── Subtitle
│
├── Main Content
│   ├── FileUpload (when no case study)
│   │   ├── Metadata Form
│   │   │   ├── Project Title Input
│   │   │   ├── Client Name Input
│   │   │   └── Consultant Name Input
│   │   ├── Drag-Drop Area
│   │   ├── File Input
│   │   └── Submit Button
│   │
│   └── CaseStudyPreview (when case study exists)
│       ├── Header
│       │   ├── Title
│       │   └── Close Button
│       ├── Document
│       │   ├── Title Section
│       │   ├── Problem Section
│       │   ├── Solution Section
│       │   ├── Impact Section
│       │   ├── Key Takeaways Section
│       │   └── Footer
│       └── Action Buttons
│           ├── Export PDF Button
│           └── New Case Study Button
│
├── Error Message (if error exists)
│
└── Footer
```

## API Routes & Handlers

```
GET /api/health
├─ Purpose: Health check
├─ Response: { status: "ok" }
└─ Time: <100ms

POST /api/upload
├─ Accepts: Multipart form data
│   ├─ file (required)
│   ├─ projectTitle (optional)
│   ├─ clientName (optional)
│   └─ consultantName (optional)
├─ Process:
│   ├─ Validate file
│   ├─ Save temporarily
│   ├─ Extract content
│   ├─ Call OpenAI API
│   ├─ Parse response
│   └─ Delete temp file
├─ Response: Case study object
└─ Time: 10-30 seconds

POST /api/export-pdf
├─ Accepts: JSON { caseStudy: {...} }
├─ Process:
│   ├─ Create PDF document
│   ├─ Format content
│   ├─ Generate buffer
│   └─ Return as attachment
├─ Response: PDF file
└─ Time: 2-5 seconds
```

## File Structure & Relationships

```
server/
├── server.js (main entry point)
│   ├─ Imports caseStudyGenerator
│   ├─ Imports pdfGenerator
│   └─ Defines API routes
│
└── services/
    ├── caseStudyGenerator.js
    │   ├─ generateCaseStudy(fileContent, metadata)
    │   ├─ OpenAI API integration
    │   └─ JSON parsing
    │
    └── pdfGenerator.js
        ├─ generatePDF(caseStudy)
        ├─ PDFKit formatting
        └─ Buffer generation

client/
├── src/index.js
│   └─ Entry point
│
├── App.js
│   ├─ State management
│   ├─ API integration
│   └─ Conditional rendering
│
├── components/
│   ├── FileUpload.js
│   │   ├─ File input handling
│   │   ├─ Drag-drop support
│   │   └─ Form validation
│   │
│   └── CaseStudyPreview.js
│       ├─ Display case study
│       └─ Export functionality
```

## State Management

```
App.js (Main State)
├── caseStudy: null | {
│   projectTitle: string
│   clientName: string
│   consultantName: string
│   problem: string
│   solution: string
│   impact: string
│   keyTakeaways: [string]
├── loading: boolean
└── error: null | string
```

## Environment & Configuration

```
server/.env
├── OPENAI_API_KEY (required)
├── PORT (default: 5000)
└── NODE_ENV (development/production)

client/package.json
└── proxy: "http://localhost:5000" (for development)
```

## Deployment Architecture (Example)

```
                    USER
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    Desktop       Tablet       Mobile
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   CDN / S3                Reverse Proxy
   (Frontend)              (Backend API)
        │                        │
        │                   ┌────┴────┐
        │                   │          │
        │                   ▼          ▼
        │            Load Balancer   Redis Cache
        │                   │
        │              ┌────┴────┐
        │              │          │
        │              ▼          ▼
        │          Server 1   Server 2
        │              │          │
        │              └────┬─────┘
        │                   │
        │         ┌─────────┴────────┐
        │         │                  │
        │         ▼                  ▼
        │      Database         OpenAI API
        │
        └─────────────────────────────┘
            (Single User Application)
```

---

This architecture supports:
- **Scalability**: Can be deployed across multiple servers
- **Reliability**: Error handling and validation throughout
- **Performance**: Efficient file processing and caching
- **Security**: File validation, API key protection, CORS
- **Maintainability**: Clear separation of concerns
