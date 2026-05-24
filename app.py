import eventlet
eventlet.monkey_patch()

import os
from flask import Flask, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'home_wifi_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

# Listen for incoming text messages
@socketio.on('send_message')
def handle_message(data):
    emit('receive_message', data, broadcast=True)

# Handle file, picture, audio, and folder-file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            print("❌ Upload Failed: No file part in request")
            return {'error': 'No file'}, 400
        
        file = request.files['file']
        user = request.form.get('user', 'Anonymous')
        file_type = request.form.get('type', 'file')
        
        if file.filename == '':
            print("❌ Upload Failed: Empty filename")
            return {'error': 'No file selected'}, 400
        
        if file:
            filename = secure_filename(file.filename)
            
            # Resolve directory paths clearly for the Render Linux environment
            upload_dir = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
                
            filepath = os.path.join(upload_dir, filename)
            file.save(filepath)
            
            file_url = f"/uploads/{filename}"
            print(f"✅ Success! File saved to: {filepath}")
            
            payload = {
                'user': user,
                'file_url': file_url,
                'filename': filename,
                'type': file_type
            }
            socketio.emit('receive_file', payload)
            return {'success': True}
            
    except Exception as e:
        print(f"❌ CRITICAL UPLOAD ERROR: {str(e)}")
        return {'error': str(e)}, 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, app.config['UPLOAD_FOLDER']), filename)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)