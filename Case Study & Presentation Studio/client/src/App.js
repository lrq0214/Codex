import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import CaseStudyPreview from './components/CaseStudyPreview';
import './App.css';

function App() {
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file, metadata) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectTitle', metadata.projectTitle);
      formData.append('clientName', metadata.clientName);
      formData.append('consultantName', metadata.consultantName);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setCaseStudy(response.data.caseStudy);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error processing file');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!caseStudy) return;

    try {
      const response = await axios.post('/api/export-pdf', { caseStudy }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${caseStudy.projectTitle}-case-study.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error exporting PDF');
      console.error('Export error:', err);
    }
  };

  const handleReset = () => {
    setCaseStudy(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Case Study Generator</h1>
        <p>Transform your consulting deliverables into professional case studies</p>
      </header>

      <main className="app-main">
        {!caseStudy ? (
          <>
            <FileUpload onUpload={handleUpload} loading={loading} />
            {error && <div className="error-message">{error}</div>}
          </>
        ) : (
          <>
            <CaseStudyPreview 
              caseStudy={caseStudy} 
              onExportPDF={handleExportPDF}
              onReset={handleReset}
            />
            {error && <div className="error-message">{error}</div>}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Case Study Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
