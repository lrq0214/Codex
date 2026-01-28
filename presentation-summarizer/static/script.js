// Global state
let currentFilePath = null;
let currentFileName = null;
let currentSummary = null;
let currentTitle = null;

// DOM elements
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const filePreview = document.getElementById('file-preview');
const changeFileBtn = document.getElementById('change-file-btn');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const editBtn = document.getElementById('edit-btn');
const maxLengthSlider = document.getElementById('max-length');
const lengthDisplay = document.getElementById('length-display');
const modelSelect = document.getElementById('model');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const statusAlert = document.getElementById('status-alert');

// Step sections
const stepUpload = document.getElementById('step-upload');
const stepConfigure = document.getElementById('step-configure');
const stepReview = document.getElementById('step-review');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkApplicationStatus();
});

function setupEventListeners() {
    // Upload area
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    // File input
    fileInput.addEventListener('change', handleFileSelect);

    // Change file button
    changeFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Slider
    maxLengthSlider.addEventListener('input', () => {
        lengthDisplay.textContent = maxLengthSlider.value;
    });

    // Generate button
    generateBtn.addEventListener('click', generateSummary);

    // Download button
    downloadBtn.addEventListener('click', downloadSummary);

    // Edit button
    editBtn.addEventListener('click', goBackToConfigure);
}

function checkApplicationStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            if (!data.ready) {
                showAlert(
                    'API Key Not Configured',
                    'Please set your OPENAI_API_KEY environment variable to use this application.',
                    'warning'
                );
                generateBtn.disabled = true;
            }
        })
        .catch(error => {
            console.error('Error checking status:', error);
        });
}

function handleFileSelect() {
    const file = fileInput.files[0];
    
    if (!file) return;

    if (!file.name.endsWith('.pptx')) {
        showAlert('Invalid File', 'Please upload a PowerPoint (.pptx) file', 'error');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        showAlert('File Too Large', 'File must be smaller than 50MB', 'error');
        return;
    }

    showLoading(true, 'Uploading and analyzing your presentation...');

    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        
        if (data.error) {
            showAlert('Upload Error', data.error, 'error');
            return;
        }

        currentFilePath = data.file_path;
        currentFileName = data.file_name;

        // Update file preview
        document.getElementById('file-name').textContent = data.file_name;
        document.getElementById('slide-count').textContent = `${data.total_slides} slides`;
        
        // Show file preview and hide upload area
        uploadArea.style.display = 'none';
        filePreview.classList.remove('hidden');

        // Move to configure step
        stepUpload.style.display = 'block';
        stepConfigure.style.display = 'block';
        stepReview.style.display = 'none';

        showAlert(
            'File Uploaded Successfully',
            `Loaded presentation with ${data.total_slides} slides`,
            'success'
        );
    })
    .catch(error => {
        showLoading(false);
        showAlert('Error', error.message, 'error');
    });
}

function generateSummary() {
    if (!currentFilePath) {
        showAlert('Error', 'Please upload a file first', 'error');
        return;
    }

    const maxLength = parseInt(maxLengthSlider.value);
    const model = modelSelect.value;

    showLoading(true, 'Generating summary with AI...');
    generateBtn.disabled = true;

    fetch('/api/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file_path: currentFilePath,
            max_length: maxLength,
            model: model
        })
    })
    .then(response => response.json())
    .then(data => {
        showLoading(false);
        generateBtn.disabled = false;

        if (data.error) {
            showAlert('Summarization Error', data.error, 'error');
            return;
        }

        currentSummary = data.summary;
        currentTitle = data.title;

        // Display summary
        document.getElementById('summary-title').textContent = currentTitle;
        document.getElementById('summary-content').textContent = currentSummary;

        // Move to review step
        stepReview.style.display = 'block';
        stepConfigure.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        showAlert('Summary Generated Successfully', 'Review and download your summary slide', 'success');
    })
    .catch(error => {
        showLoading(false);
        generateBtn.disabled = false;
        showAlert('Error', error.message, 'error');
    });
}

function downloadSummary() {
    if (!currentSummary || !currentTitle) {
        showAlert('Error', 'No summary to download', 'error');
        return;
    }

    showLoading(true, 'Creating PowerPoint presentation...');

    fetch('/api/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: currentTitle,
            summary: currentSummary,
            file_name: currentFileName
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Download failed');
            });
        }
        return response.blob();
    })
    .then(blob => {
        showLoading(false);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const baseName = currentFileName.replace('.pptx', '');
        link.download = `${baseName}_summary.pptx`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showAlert('Download Complete', 'Your summary presentation is ready!', 'success');
    })
    .catch(error => {
        showLoading(false);
        showAlert('Download Error', error.message, 'error');
    });
}

function goBackToConfigure() {
    stepReview.style.display = 'none';
    stepConfigure.scrollIntoView({ behavior: 'smooth' });
}

function showLoading(show, text = 'Processing...') {
    if (show) {
        loadingText.textContent = text;
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showAlert(title, message, type = 'info') {
    statusAlert.textContent = message;
    statusAlert.className = `alert alert-${type}`;
    statusAlert.classList.remove('alert-hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusAlert.classList.add('alert-hidden');
    }, 5000);
}
