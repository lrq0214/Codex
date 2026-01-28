# Setup Instructions

## Initial Setup

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

This will install:
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **openai**: OpenAI API client
- **pdfkit**: PDF generation
- **dotenv**: Environment variable management

### 2. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key
PORT=5000
NODE_ENV=development
```

**Getting an OpenAI API Key:**
1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Create a new API key
4. Copy and paste it into your `.env` file

### 3. Install Frontend Dependencies

```bash
cd client
npm install
```

This will install:
- **react**: UI framework
- **react-dom**: React DOM renderer
- **axios**: HTTP client
- **react-scripts**: Build and development tools

### 4. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

You should see:
```
Server is running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Usage

1. **Open the Application**: Navigate to http://localhost:3000
2. **Enter Project Information** (optional):
   - Project Title
   - Client Name
   - Consultant Name
3. **Upload a File**: 
   - Drag and drop a document, or
   - Click to browse and select a file
4. **Generate Case Study**: Click "Generate Case Study"
5. **View Results**: 
   - Review the generated case study
   - Click "Export as PDF" to download
   - Click "New Case Study" to process another file

## File Upload Options

Upload any of these file types:
- PDF documents
- Microsoft Word (.docx, .doc)
- Plain text files (.txt)
- Excel spreadsheets (.xls, .xlsx)

Maximum file size: 50MB

## Development

### Run Backend in Development Mode
```bash
cd server
npm run dev
```

Uses `nodemon` to automatically restart the server when files change.

### Build Frontend for Production
```bash
cd client
npm run build
```

Creates optimized production build in `client/build/` directory.

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, change it:

```bash
# Edit server/.env
PORT=5001
```

Or on Windows PowerShell:
```powershell
$env:PORT=5001; npm start
```

### API Key Issues
- Double-check your OpenAI API key is correct
- Verify your account has credits
- Ensure the key is not expired or revoked

### File Upload Fails
- Check file size is under 50MB
- Verify file format is supported
- Check server logs for detailed error messages

### CORS Errors
- Verify backend is running on port 5000
- Check `proxy` field in `client/package.json`
- Restart both frontend and backend

### Dependencies Won't Install
```bash
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

## Testing the API Directly

Use curl or Postman to test the API:

```bash
# Health check
curl http://localhost:5000/api/health

# Upload file and generate case study
curl -X POST http://localhost:5000/api/upload \
  -F "file=@sample.pdf" \
  -F "projectTitle=Sample Project" \
  -F "clientName=Sample Client" \
  -F "consultantName=Sample Consultant"
```

## Production Deployment

### Backend Deployment (e.g., Heroku, AWS, Azure)

1. Build:
   ```bash
   cd server
   npm install --production
   ```

2. Set environment variables on hosting platform:
   - `OPENAI_API_KEY`
   - `PORT`
   - `NODE_ENV=production`

3. Start command:
   ```bash
   npm start
   ```

### Frontend Deployment (e.g., Vercel, Netlify, AWS S3)

1. Build:
   ```bash
   cd client
   npm run build
   ```

2. Update API endpoint in frontend if needed:
   - Change `proxy` in `client/package.json` to your deployed backend URL

3. Deploy `client/build/` directory

## Next Steps

- Customize case study templates in `server/services/caseStudyGenerator.js`
- Add user authentication for team collaboration
- Implement database for storing case studies
- Add more file format support
- Create case study templates library
- Implement batch processing for multiple files

## Support

For issues:
1. Check server logs in Terminal 1
2. Check browser console (F12) for frontend errors
3. Verify all environment variables are set correctly
4. Ensure both frontend and backend are running

---

**Ready to go!** Your application is now running and ready to process consulting deliverables.
