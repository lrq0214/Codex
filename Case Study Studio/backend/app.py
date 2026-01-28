"""
Case Study Studio Application
Allows users to upload consulting project deliverables and generate templated case studies
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import openai
from dotenv import load_dotenv
from case_study_generator import CaseStudyGenerator
from file_processor import FileProcessor

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'xlsx', 'xls'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize services
openai.api_key = os.getenv('OPENAI_API_KEY')
generator = CaseStudyGenerator()
processor = FileProcessor()


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200


@app.route('/api/upload', methods=['POST'])
def upload_files():
    """
    Upload consulting project deliverables and optional template examples
    Accepts multiple file uploads
    """
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400

        files = request.files.getlist('files')
        template_files = request.files.getlist('template_files')
        
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400

        # Get metadata
        project_name = request.form.get('projectName', 'Unnamed Project')
        client_name = request.form.get('clientName', 'Anonymous Client')
        industry = request.form.get('industry', 'General')

        uploaded_files = []
        uploaded_templates = []
        errors = []

        # Process project deliverable files
        for file in files:
            if file.filename == '':
                errors.append('Empty filename')
                continue

            if not allowed_file(file.filename):
                errors.append(f'{file.filename}: Invalid file type')
                continue

            try:
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                unique_filename = timestamp + filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                file.save(filepath)
                uploaded_files.append({
                    'original_name': file.filename,
                    'saved_name': unique_filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'type': 'deliverable'
                })
            except Exception as e:
                errors.append(f'{file.filename}: {str(e)}')

        # Process template files
        for file in template_files:
            if file.filename == '':
                continue

            if not allowed_file(file.filename):
                errors.append(f'{file.filename}: Invalid template file type')
                continue

            try:
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                unique_filename = 'template_' + timestamp + filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                file.save(filepath)
                uploaded_templates.append({
                    'original_name': file.filename,
                    'saved_name': unique_filename,
                    'filepath': filepath,
                    'size': os.path.getsize(filepath),
                    'type': 'template'
                })
            except Exception as e:
                errors.append(f'{file.filename} (template): {str(e)}')

        if not uploaded_files:
            return jsonify({'error': 'No files uploaded successfully', 'details': errors}), 400

        return jsonify({
            'success': True,
            'uploaded_files': uploaded_files,
            'template_files': uploaded_templates,
            'total_files': len(uploaded_files) + len(uploaded_templates),
            'errors': errors,
            'metadata': {
                'project_name': project_name,
                'client_name': client_name,
                'industry': industry
            }
        }), 200

    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500


@app.route('/api/generate-case-study', methods=['POST'])
def generate_case_study():
    """
    Generate a templated case study from uploaded files and optional template references
    """
    try:
        data = request.get_json()

        if not data or 'files' not in data:
            return jsonify({'error': 'No files specified for processing'}), 400

        files = data['files']
        template_files = data.get('template_files', [])
        
        if not isinstance(files, list) or len(files) == 0:
            return jsonify({'error': 'Files must be a non-empty array'}), 400

        # Get metadata
        project_name = data.get('projectName', 'Unnamed Project')
        client_name = data.get('clientName', 'Anonymous Client')
        industry = data.get('industry', 'General')
        additional_context = data.get('additionalContext', '')

        # Extract content from project deliverable files
        extracted_content = {}
        for file_info in files:
            filepath = file_info.get('filepath')
            if filepath and os.path.exists(filepath):
                try:
                    content = processor.extract_content(filepath)
                    extracted_content[file_info.get('original_name')] = content
                except Exception as e:
                    extracted_content[file_info.get('original_name')] = f"Error processing: {str(e)}"

        # Extract content from template files (for reference)
        template_content = {}
        for file_info in template_files:
            filepath = file_info.get('filepath')
            if filepath and os.path.exists(filepath):
                try:
                    content = processor.extract_content(filepath)
                    template_content[file_info.get('original_name')] = content
                except Exception as e:
                    template_content[file_info.get('original_name')] = f"Error processing: {str(e)}"

        # Generate case study with template reference
        case_study = generator.generate(
            project_name=project_name,
            client_name=client_name,
            industry=industry,
            extracted_content=extracted_content,
            template_content=template_content if template_content else None,
            additional_context=additional_context
        )

        # Save case study
        output_filename = f"case_study_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        generator.save_to_docx(case_study, output_path)

        return jsonify({
            'success': True,
            'case_study': case_study,
            'output_file': output_filename,
            'output_path': output_path,
            'generated_at': datetime.now().isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': f'Case study generation failed: {str(e)}'}), 500


@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download generated case study"""
    try:
        filepath = os.path.join(OUTPUT_FOLDER, secure_filename(filename))
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404

        return send_file(filepath, as_attachment=True)
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500


@app.route('/api/case-studies', methods=['GET'])
def list_case_studies():
    """List all generated case studies"""
    try:
        case_studies = []
        for filename in os.listdir(OUTPUT_FOLDER):
            if filename.endswith('.docx'):
                filepath = os.path.join(OUTPUT_FOLDER, filename)
                case_studies.append({
                    'filename': filename,
                    'created_at': datetime.fromtimestamp(os.path.getctime(filepath)).isoformat(),
                    'size': os.path.getsize(filepath)
                })
        
        return jsonify({
            'case_studies': sorted(case_studies, key=lambda x: x['created_at'], reverse=True)
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to list case studies: {str(e)}'}), 500


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File too large. Maximum size is 50MB'}), 413


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
