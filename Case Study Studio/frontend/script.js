/* =============================================
   CASE STUDY GENERATOR - JAVASCRIPT
   ============================================= */

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const UPLOAD_ENDPOINT = '/upload';
const GENERATE_ENDPOINT = '/generate-case-study';
const DOWNLOAD_ENDPOINT = '/download';
const LIST_ENDPOINT = '/case-studies';

// State Management
const state = {
    uploadedFiles: [],
    currentCaseStudy: null,
    selectedTab: 'upload'
};

// DOM Elements
const elements = {
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    fileList: document.getElementById('fileList'),
    projectForm: document.getElementById('projectForm'),
    generateBtn: document.getElementById('generateBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    statusMessage: document.getElementById('statusMessage'),
    previewSection: document.getElementById('previewSection'),
    caseStudyPreview: document.getElementById('caseStudyPreview'),
    downloadBtn: document.getElementById('downloadBtn'),
    saveBtn: document.getElementById('saveBtn'),
    newCaseStudyBtn: document.getElementById('newCaseStudyBtn'),
    caseStudyList: document.getElementById('caseStudyList'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadCaseStudyHistory();
});

// =============================================
// EVENT LISTENERS
// =============================================

function initializeEventListeners() {
    // File upload events
    elements.uploadArea.addEventListener('click', () => {
        elements.fileInput.click();
    });

    elements.fileInput.addEventListener('change', handleFileInputChange);

    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleDrop);

    // Form and buttons
    elements.generateBtn.addEventListener('click', handleGenerateCaseStudy);
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.saveBtn.addEventListener('click', handleSave);
    elements.newCaseStudyBtn.addEventListener('click', handleNewCaseStudy);

    // Tab navigation
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleTabClick(e.target.dataset.tab);
        });
    });
}

// =============================================
// FILE UPLOAD HANDLERS
// =============================================

function handleFileInputChange(e) {
    const files = Array.from(e.target.files);
    addFilesToState(files);
}

function handleDragOver(e) {
    e.preventDefault();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    elements.uploadArea.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    addFilesToState(files);
}

function addFilesToState(files) {
    const validFiles = files.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        const validExtensions = ['pdf', 'docx', 'txt', 'xlsx', 'xls'];
        
        if (!validExtensions.includes(ext)) {
            showStatus(`Invalid file type: ${file.name}`, 'error');
            return false;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            showStatus(`File too large: ${file.name}`, 'error');
            return false;
        }
        
        return true;
    });

    state.uploadedFiles = [...state.uploadedFiles, ...validFiles];
    updateFileList();
    updateGenerateButtonState();
}

function updateFileList() {
    elements.fileList.innerHTML = '';
    
    if (state.uploadedFiles.length === 0) {
        return;
    }

    state.uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item-info">
                <div class="file-icon">${getFileIcon(file.name)}</div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">✕</button>
        `;
        elements.fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    state.uploadedFiles.splice(index, 1);
    updateFileList();
    updateGenerateButtonState();
}

function updateGenerateButtonState() {
    const isFormValid = document.getElementById('projectName').value.trim() !== '' &&
                       document.getElementById('clientName').value.trim() !== '' &&
                       document.getElementById('industry').value !== '' &&
                       state.uploadedFiles.length > 0;
    
    elements.generateBtn.disabled = !isFormValid;
}

// =============================================
// FORM VALIDATION
// =============================================

document.getElementById('projectName').addEventListener('change', updateGenerateButtonState);
document.getElementById('clientName').addEventListener('change', updateGenerateButtonState);
document.getElementById('industry').addEventListener('change', updateGenerateButtonState);

// =============================================
// CASE STUDY GENERATION
// =============================================

async function handleGenerateCaseStudy() {
    // Validate form
    const projectName = document.getElementById('projectName').value.trim();
    const clientName = document.getElementById('clientName').value.trim();
    const industry = document.getElementById('industry').value;
    const additionalContext = document.getElementById('additionalContext').value.trim();

    if (!projectName || !clientName || !industry || state.uploadedFiles.length === 0) {
        showStatus('Please fill in all required fields and upload at least one file', 'error');
        return;
    }

    try {
        // Show loading state
        elements.loadingSpinner.classList.remove('hidden');
        elements.generateBtn.disabled = true;
        showStatus('Uploading files and generating case study...', 'info');

        // Step 1: Upload files
        const formData = new FormData();
        state.uploadedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('projectName', projectName);
        formData.append('clientName', clientName);
        formData.append('industry', industry);

        const uploadResponse = await fetch(`${API_BASE_URL}${UPLOAD_ENDPOINT}`, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        const uploadData = await uploadResponse.json();
        const uploadedFiles = uploadData.uploaded_files || [];

        // Step 2: Generate case study
        showStatus('Generating case study from uploaded files...', 'info');

        const generateResponse = await fetch(`${API_BASE_URL}${GENERATE_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: uploadedFiles,
                projectName: projectName,
                clientName: clientName,
                industry: industry,
                additionalContext: additionalContext
            })
        });

        if (!generateResponse.ok) {
            throw new Error(`Generation failed: ${generateResponse.statusText}`);
        }

        const generateData = await generateResponse.json();
        state.currentCaseStudy = generateData.case_study;

        // Display preview
        displayCaseStudyPreview(state.currentCaseStudy);
        elements.previewSection.style.display = 'block';

        showStatus('Case study generated successfully!', 'success');
        elements.loadingSpinner.classList.add('hidden');
        elements.generateBtn.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
        elements.loadingSpinner.classList.add('hidden');
        elements.generateBtn.disabled = false;
    }
}

function displayCaseStudyPreview(caseStudy) {
    const sections = [
        { title: 'Problem Statement', key: 'problem_statement' },
        { title: 'Solution Approach', key: 'solution_approach' },
        { title: 'Key Metrics', key: 'key_metrics' },
        { title: 'Impact Summary', key: 'impact_summary' },
        { title: 'Implementation Details', key: 'implementation_details' },
        { title: 'Lessons Learned', key: 'lessons_learned' }
    ];

    let previewHTML = '';

    sections.forEach(section => {
        const content = caseStudy[section.key];
        if (content) {
            previewHTML += `<div class="case-study-section">`;
            previewHTML += `<h3>${section.title}</h3>`;
            
            if (Array.isArray(content)) {
                previewHTML += `<ul>`;
                content.forEach(item => {
                    previewHTML += `<li>${escapeHtml(String(item))}</li>`;
                });
                previewHTML += `</ul>`;
            } else {
                previewHTML += `<p>${escapeHtml(String(content))}</p>`;
            }
            
            previewHTML += `</div>`;
        }
    });

    elements.caseStudyPreview.innerHTML = previewHTML;
}

// =============================================
// DOWNLOAD AND SAVE
// =============================================

async function handleDownload() {
    if (!state.currentCaseStudy) {
        showStatus('No case study to download', 'error');
        return;
    }

    try {
        const projectName = document.getElementById('projectName').value || 'case_study';
        const filename = `${projectName}_${Date.now()}.docx`;
        
        // For demo purposes, show a message
        showStatus(`Download functionality requires backend integration. File would be: ${filename}`, 'info');
        
        // In a real implementation, you would download from the backend
        // const response = await fetch(`${API_BASE_URL}${DOWNLOAD_ENDPOINT}/${filename}`);
        // const blob = await response.blob();
        // downloadBlob(blob, filename);
    } catch (error) {
        showStatus(`Download failed: ${error.message}`, 'error');
    }
}

function handleSave() {
    if (!state.currentCaseStudy) {
        showStatus('No case study to save', 'error');
        return;
    }

    try {
        // Save to localStorage
        const caseStudy = {
            ...state.currentCaseStudy,
            savedAt: new Date().toISOString()
        };
        
        const saved = JSON.parse(localStorage.getItem('caseStudies') || '[]');
        saved.push(caseStudy);
        localStorage.setItem('caseStudies', JSON.stringify(saved));
        
        showStatus('Case study saved to history!', 'success');
        loadCaseStudyHistory();
    } catch (error) {
        showStatus(`Save failed: ${error.message}`, 'error');
    }
}

function handleNewCaseStudy() {
    // Reset form
    document.getElementById('projectForm').reset();
    state.uploadedFiles = [];
    state.currentCaseStudy = null;
    updateFileList();
    elements.previewSection.style.display = 'none';
    elements.statusMessage.classList.remove('show');
    updateGenerateButtonState();
}

// =============================================
// CASE STUDY HISTORY
// =============================================

function loadCaseStudyHistory() {
    const saved = JSON.parse(localStorage.getItem('caseStudies') || '[]');
    
    if (saved.length === 0) {
        elements.caseStudyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No saved case studies yet</p>';
        return;
    }

    elements.caseStudyList.innerHTML = '';

    saved.forEach((caseStudy, index) => {
        const card = document.createElement('div');
        card.className = 'case-study-card';
        
        const savedDate = new Date(caseStudy.savedAt).toLocaleDateString();
        
        card.innerHTML = `
            <div class="case-study-card-info">
                <h3>${caseStudy.metadata.project_name}</h3>
                <p>${caseStudy.metadata.client_name} | ${caseStudy.metadata.industry}</p>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Saved: ${savedDate}</p>
            </div>
            <div class="case-study-card-actions">
                <button class="btn btn-outline" onclick="viewCaseStudy(${index})">View</button>
                <button class="btn btn-danger" onclick="deleteCaseStudy(${index})">Delete</button>
            </div>
        `;
        
        elements.caseStudyList.appendChild(card);
    });
}

function viewCaseStudy(index) {
    const saved = JSON.parse(localStorage.getItem('caseStudies') || '[]');
    const caseStudy = saved[index];
    
    state.currentCaseStudy = caseStudy;
    displayCaseStudyPreview(caseStudy);
    
    // Populate form
    if (caseStudy.metadata) {
        document.getElementById('projectName').value = caseStudy.metadata.project_name || '';
        document.getElementById('clientName').value = caseStudy.metadata.client_name || '';
        document.getElementById('industry').value = caseStudy.metadata.industry || '';
    }
    
    elements.previewSection.style.display = 'block';
    handleTabClick('upload');
}

function deleteCaseStudy(index) {
    if (!confirm('Are you sure you want to delete this case study?')) {
        return;
    }
    
    const saved = JSON.parse(localStorage.getItem('caseStudies') || '[]');
    saved.splice(index, 1);
    localStorage.setItem('caseStudies', JSON.stringify(saved));
    
    loadCaseStudyHistory();
    showStatus('Case study deleted', 'success');
}

// =============================================
// TAB NAVIGATION
// =============================================

function handleTabClick(tabName) {
    state.selectedTab = tabName;
    
    // Update button states
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update content visibility
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // Load history when switching to history tab
    if (tabName === 'history') {
        loadCaseStudyHistory();
    }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

function showStatus(message, type = 'info') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message show ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.statusMessage.classList.remove('show');
    }, 5000);
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'docx': '📝',
        'doc': '📝',
        'txt': '📋',
        'xlsx': '📊',
        'xls': '📊'
    };
    return icons[ext] || '📁';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
