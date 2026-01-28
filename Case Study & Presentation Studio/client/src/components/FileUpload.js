import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onUpload, loading }) {
  const [file, setFile] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [consultantName, setConsultantName] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file, {
        projectTitle,
        clientName,
        consultantName
      });
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <h2>Project Information</h2>
          <div className="form-group">
            <label>Project Title (optional)</label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Client Name (optional)</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            <div className="form-group">
              <label>Consultant Name (optional)</label>
              <input
                type="text"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                placeholder="Enter consultant name"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Upload Deliverable</h2>
          <div
            className={`drag-drop-area ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="drag-drop-content">
              <div className="upload-icon">📄</div>
              <p>Drag and drop your file here or click to browse</p>
              <p className="supported-files">
                Supported: PDF, DOCX, DOC, TXT, XLSX, XLS
              </p>
              <input
                type="file"
                id="file-input"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                hidden
              />
            </div>
            <label htmlFor="file-input" className="file-input-label">
              Choose File
            </label>
          </div>

          {file && (
            <div className="file-selected">
              <span className="checkmark">✓</span>
              <span className="file-name">{file.name}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="submit-btn"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Generate Case Study'
          )}
        </button>
      </form>
    </div>
  );
}

export default FileUpload;
