import React from 'react';
import './CaseStudyPreview.css';

function CaseStudyPreview({ caseStudy, onExportPDF, onReset }) {
  const handleEditField = (field, newValue) => {
    // Note: In a full implementation, you would manage this state in App.js
    // For now, this is a placeholder for edit functionality
    console.log(`Edit ${field}: ${newValue}`);
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Your Case Study</h2>
        <button className="close-btn" onClick={onReset}>×</button>
      </div>

      <div className="case-study-document">
        <div className="document-header">
          <h1>CASE STUDY</h1>
          <div className="document-info">
            <p className="project-title">{caseStudy.projectTitle}</p>
            <p className="document-meta">
              <strong>Client:</strong> {caseStudy.clientName}
            </p>
            <p className="document-meta">
              <strong>Consultant:</strong> {caseStudy.consultantName}
            </p>
          </div>
        </div>

        <section className="case-study-section">
          <h2>Problem</h2>
          <p>{caseStudy.problem}</p>
        </section>

        <section className="case-study-section">
          <h2>Solution</h2>
          <p>{caseStudy.solution}</p>
        </section>

        <section className="case-study-section">
          <h2>Impact</h2>
          <p>{caseStudy.impact}</p>
        </section>

        {caseStudy.keyTakeaways && caseStudy.keyTakeaways.length > 0 && (
          <section className="case-study-section">
            <h2>Key Takeaways</h2>
            <ul className="takeaways-list">
              {caseStudy.keyTakeaways.map((takeaway, index) => (
                <li key={index}>{takeaway}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="document-footer">
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="export-btn" onClick={onExportPDF}>
          📥 Export as PDF
        </button>
        <button className="new-case-btn" onClick={onReset}>
          ✚ New Case Study
        </button>
      </div>
    </div>
  );
}

export default CaseStudyPreview;
