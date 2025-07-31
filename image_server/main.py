from flask import Flask, request, send_from_directory, jsonify, render_template
from flask_cors import CORS
import os

app = Flask(__name__, template_folder='templates')
CORS(app)

IMAGE_DIR = os.path.join(os.getcwd(), "images")

# Ensure the images folder exists at startup
if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

# Serve upload UI
@app.route('/', methods=['GET'])
def index():
    return render_template('upload.html')

# Ping endpoint
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok', 'message': 'Local Flask server is running.'})

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        file.save(os.path.join(IMAGE_DIR, file.filename))
        return jsonify({'status': 'success', 'filename': file.filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve images
@app.route('/images/<path:filename>', methods=['GET'])
def get_image(filename):
    try:
        return send_from_directory(IMAGE_DIR, filename)
    except FileNotFoundError:
        return jsonify({'error': 'Image not found'}), 404

# List all images
@app.route('/list', methods=['GET'])
def list_images():
    try:
        files = [f for f in os.listdir(IMAGE_DIR) if os.path.isfile(os.path.join(IMAGE_DIR, f))]
        return jsonify({'images': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("="*40)
    print("📁 Local Image Agent is starting up...")
    print(f"📂 Serving images from: {IMAGE_DIR}")
    print("🌐 Visit http://127.0.0.1:5678 in your browser to upload or view images.")
    print("🔄 Use /ping to check if the server is alive.")
    print("="*40)
    app.run(host='127.0.0.1', port=5678)