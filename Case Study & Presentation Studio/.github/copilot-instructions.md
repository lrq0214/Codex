# Project Setup and Development Guidelines

This document provides custom instructions for working with the Case Study Generator application in VS Code with GitHub Copilot.

## Project Overview

The Case Study Generator is a full-stack web application built with:
- **Frontend**: React 18 with modern CSS
- **Backend**: Node.js/Express with OpenAI API integration
- **Key Feature**: Transforms consulting deliverables into professional one-page case studies

## Development Workflow

### 1. Before Starting Work
- Ensure both backend (port 5000) and frontend (port 3000) are running
- Check that OpenAI API key is configured in `server/.env`
- Verify all dependencies are installed

### 2. Code Structure
- Backend business logic: `server/services/`
- React components: `client/src/components/`
- Styling: Component-level CSS files (co-located with components)
- API routes: `server/server.js`

### 3. Common Development Tasks

#### Adding a New Feature
1. Identify if it's frontend or backend
2. Create/modify files in appropriate directory
3. Update related service files if needed
4. Test via API or UI

#### Fixing a Bug
1. Reproduce the issue
2. Check server logs (Terminal 1) and browser console (F12)
3. Make changes to appropriate files
4. Test thoroughly before committing

#### Adding Dependencies
- Backend: `cd server && npm install package-name`
- Frontend: `cd client && npm install package-name`
- Update relevant service files to use the package

### 4. API Integration
- All frontend-backend communication uses Axios
- Backend API endpoints documented in `server/README.md`
- Update `client/package.json` proxy if backend URL changes

### 5. File Upload Handling
- Handled by Multer on backend
- Files temporarily stored in `server/uploads/`
- Automatically deleted after processing
- Supported formats: PDF, DOCX, DOC, TXT, XLS, XLSX (max 50MB)

### 6. Case Study Generation
- Uses OpenAI GPT-4 API
- Configured in `server/services/caseStudyGenerator.js`
- Generates: problem, solution, impact, key takeaways
- Results formatted as structured JSON

### 7. PDF Export
- Generated using PDFKit library
- One-page format optimized for printing
- Created in `server/services/pdfGenerator.js`

## Guidelines for Copilot Assistance

### When Asking About Frontend Changes
- Specify the component (FileUpload, CaseStudyPreview, App)
- Mention styling approach (CSS modules, inline, component-level)
- Ask for responsive design if needed

### When Asking About Backend Changes
- Specify which service or route to modify
- Include context about API requirements
- Ask for error handling implementation

### When Asking About File Upload
- Remember Multer handles upload, stores temporarily, then deletes
- Consider file size limits and validation
- Think about user feedback during processing

### When Asking About AI Integration
- Reference OpenAI GPT-4 model
- Consider prompt engineering for quality outputs
- Remember to handle API rate limits and errors

## Testing Approach

### Manual Testing
1. **Upload Test**: Try uploading each supported file format
2. **UI Test**: Test on different screen sizes (responsive)
3. **Error Test**: Try invalid files, network errors, API failures
4. **Content Test**: Verify case study quality with different inputs

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Upload with test file
curl -X POST http://localhost:5000/api/upload \
  -F "file=@test.pdf" \
  -F "projectTitle=Test"
```

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in server or client directory |
| CORS error | Verify backend running, check proxy in package.json |
| API key error | Check `.env` file, verify key is valid |
| File upload fails | Check file size, format, and server logs |
| Port already in use | Change PORT in `.env` or use different terminal |

## Performance Tips

- Minimize OpenAI API calls (cache results if needed)
- Optimize PDF generation for large documents
- Use lazy loading for frontend components
- Consider implementing request debouncing

## Security Reminders

- Never commit `.env` file (use `.env.example`)
- Validate all file uploads on backend
- Sanitize user inputs for AI prompt injection
- Implement rate limiting for production
- Consider adding authentication for team features

## Code Style

- **Backend**: Standard Node.js conventions, proper error handling
- **Frontend**: React hooks, functional components, semantic HTML
- **CSS**: BEM-like naming, mobile-first responsive design
- **Comments**: Add comments for complex logic, API interactions

## Documentation

- Update `README.md` for major feature changes
- Keep `SETUP.md` current with installation steps
- Document API changes in `server/README.md`
- Add comments to non-obvious code sections

## Debugging Tips

- **Backend**: Check `console.log` output in Terminal 1, check logs directory
- **Frontend**: Use React DevTools browser extension, check F12 console
- **API**: Use curl or Postman to test endpoints directly
- **File Upload**: Check `server/uploads/` directory for temporary files

## Future Enhancement Areas

- User authentication and project history
- Template customization
- Batch processing
- Real-time collaboration
- Multi-language support
- Advanced analytics

## Questions to Ask Copilot

Good questions include:
- "How should I structure a new API endpoint?"
- "Help me optimize the PDF generation"
- "How can I add error boundaries to React components?"
- "What's the best way to handle large file uploads?"
- "How do I improve the case study prompt for better outputs?"

Avoid:
- Vague requests without context
- Asking to write entire files without guidance
- Security-sensitive changes without review
- Major architecture changes without discussion

---

**Last Updated**: January 2024
**Version**: 1.0.0
