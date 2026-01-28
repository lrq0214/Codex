# Case Study Generator

A full-stack web application that transforms consulting project deliverables into professional, templated one-page case studies. Users can upload documents (PDF, DOCX, TXT, etc.), and the application automatically generates a structured summary of the problem, solution, and impact.

## Features

- 📤 **File Upload**: Drag-and-drop or click to upload consulting deliverables
- 🤖 **AI-Powered Generation**: Uses OpenAI GPT-4 to analyze and summarize content
- 📋 **Structured Output**: Automatically generates problem, solution, impact, and key takeaways
- 📊 **Professional Preview**: Beautiful, one-page case study preview
- 📥 **PDF Export**: Download case studies as professional PDF documents
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
.
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # App styling
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                # Node.js/Express backend
│   ├── services/          # Business logic
│   │   ├── caseStudyGenerator.js
│   │   └── pdfGenerator.js
│   ├── server.js          # Express server
│   ├── .env.example       # Environment variables template
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone/setup the repository**
   ```bash
   cd "Case Study & Presentation Studio"
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# App opens on http://localhost:3000
```

## API Documentation

### POST `/api/upload`
Uploads a file and generates a case study.

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@deliverable.pdf" \
  -F "projectTitle=Digital Transformation" \
  -F "clientName=Tech Corp" \
  -F "consultantName=John Consultant"
```

**Response:**
```json
{
  "success": true,
  "caseStudy": {
    "projectTitle": "Digital Transformation",
    "clientName": "Tech Corp",
    "consultantName": "John Consultant",
    "problem": "The client faced legacy system integration challenges...",
    "solution": "We implemented a modern cloud-based architecture...",
    "impact": "Reduced operational costs by 30% and improved efficiency...",
    "keyTakeaways": [
      "Cloud migration improved scalability",
      "Reduced technical debt significantly",
      "Enhanced team productivity"
    ]
  }
}
```

### POST `/api/export-pdf`
Generates and downloads a PDF case study.

**Request:**
```json
{
  "caseStudy": { /* case study object from upload response */ }
}
```

**Response:** PDF file (attachment)

### GET `/api/health`
Health check endpoint.

## Configuration

Create a `.env` file in the server directory with:

```env
OPENAI_API_KEY=sk-your-api-key-here
PORT=5000
NODE_ENV=development
```

## Supported File Types

- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Plain Text (.txt)
- Excel (.xls, .xlsx)
- Maximum file size: 50MB

## Technology Stack

**Frontend:**
- React 18
- Axios (HTTP client)
- CSS3 (responsive design)

**Backend:**
- Node.js & Express.js
- OpenAI API (GPT-4)
- PDFKit (PDF generation)
- Multer (file upload)

## Environment Variables

### Server (.env)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

### Client
Update the `proxy` field in `client/package.json` to match your backend URL.

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm start   # Starts with hot reload
```

## Building for Production

**Backend:**
```bash
cd server
npm install --production
# Set NODE_ENV=production and deploy
```

**Frontend:**
```bash
cd client
npm run build
# Deploy the build/ directory to your hosting
```

## Features in Detail

### AI-Powered Analysis
The application uses OpenAI's GPT-4 model to intelligently parse and summarize consulting deliverables, extracting:
- **Problem**: The business challenge addressed
- **Solution**: The consulting approach and recommendations
- **Impact**: Quantifiable or qualitative results
- **Key Takeaways**: Important lessons learned

### Beautiful UI/UX
- Modern gradient design with purple theme
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Drag-and-drop file upload
- Real-time validation and feedback

### Professional Output
- One-page format optimized for printing
- Clean, business-appropriate styling
- PDF export with proper formatting
- Customizable metadata (project title, client name, consultant name)

## Troubleshooting

### "Cannot find module" errors
```bash
# Backend
cd server && npm install

# Frontend
cd client && npm install
```

### OpenAI API Key errors
- Verify your API key is correct and has credits
- Check that `OPENAI_API_KEY` is set in `.env`
- Ensure the key has access to GPT-4 model

### CORS errors
- Verify backend is running on the correct port
- Check `proxy` setting in `client/package.json` matches backend URL
- In development, CORS middleware is enabled

### File upload issues
- Check file size (max 50MB)
- Verify file format is supported
- Ensure server has write permissions to `server/uploads/` directory

## Future Enhancements

- [ ] User authentication and project history
- [ ] Case study templates customization
- [ ] Batch upload processing
- [ ] Real-time collaboration
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Integration with document storage (Google Drive, OneDrive)
- [ ] Case study templates library
- [ ] Team workspace management

## Security Considerations

- All file uploads are validated for file type and size
- Uploaded files are deleted after processing
- API requests require proper CORS configuration
- Consider adding authentication for production
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints

## Performance Optimization

- Implement request debouncing for file upload
- Cache case study results
- Optimize PDF generation for large documents
- Consider implementing webhooks for async processing
- Add request timeouts and error handling

## License

Proprietary - All rights reserved

## Support

For issues or questions, please contact the development team.

---

**Last Updated:** January 2024
**Version:** 1.0.0
