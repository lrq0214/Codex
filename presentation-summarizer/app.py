"""Flask web application for the presentation summarizer."""

import os
import sys
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.presentation_reader import PresentationReader
from src.summarizer import PresentationSummarizer
from src.slide_generator import create_summary_presentation

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pptx'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize summarizer (will use env var for API key)
try:
    summarizer = PresentationSummarizer()
    SUMMARIZER_READY = True
except ValueError:
    SUMMARIZER_READY = False


def allowed_file(filename):
    """Check if file has allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html', summarizer_ready=SUMMARIZER_READY)


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and return presentation metadata."""
    try:
        # Check if API key is configured
        if not SUMMARIZER_READY:
            return jsonify({
                'error': 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
            }), 400
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File must be a .pptx file'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], timestamp + filename)
        file.save(filepath)
        
        # Read presentation
        reader = PresentationReader(filepath)
        presentation_data = reader.get_presentation_summary()
        
        return jsonify({
            'success': True,
            'file_path': filepath,
            'file_name': filename,
            'total_slides': presentation_data['total_slides'],
            'slides': presentation_data['slides']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Generate summary from uploaded presentation."""
    try:
        data = request.json
        file_path = data.get('file_path')
        max_length = int(data.get('max_length', 400))
        model = data.get('model', 'gpt-3.5-turbo')
        
        if not file_path or not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 400
        
        # Extract content
        reader = PresentationReader(file_path)
        content = reader.extract_full_text()
        
        # Generate summary
        summary = summarizer.generate_summary(
            content,
            max_length=max_length,
            model=model
        )
        
        # Generate title
        title = summarizer.generate_slide_title(summary, model=model)
        
        return jsonify({
            'success': True,
            'summary': summary,
            'title': title
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/download', methods=['POST'])
def download_summary():
    """Generate and download the summary presentation."""
    try:
        data = request.json
        title = data.get('title')
        summary = data.get('summary')
        file_name = data.get('file_name', 'summary.pptx')
        
        # Generate output filename
        base_name = file_name.rsplit('.', 1)[0] if '.' in file_name else file_name
        output_filename = f"{base_name}_summary.pptx"
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
        
        # Create summary presentation
        create_summary_presentation(
            title=title,
            summary=summary,
            output_path=output_path,
            subtitle="Executive Summary"
        )
        
        # Send file
        return send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/status', methods=['GET'])
def status():
    """Check application status."""
    return jsonify({
        'ready': SUMMARIZER_READY,
        'message': 'Application is ready' if SUMMARIZER_READY else 'API key not configured'
    })


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error."""
    return jsonify({'error': 'File is too large. Maximum size is 50MB'}), 413


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors."""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Check for API key
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: OPENAI_API_KEY environment variable not set")
        print("Please set it before running the application")
    
    print("🚀 Starting Presentation Summarizer Web App...")
    print("📊 Visit http://localhost:5000 in your browser")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
