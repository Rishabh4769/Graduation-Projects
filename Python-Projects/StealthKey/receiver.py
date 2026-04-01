import os
from flask import Flask, request, abort
from datetime import datetime

# --- Configuration ---
# IMPORTANT: Use a strong, randomly generated secret key in a real environment
# This key must match the one used by the sender.
API_SECRET_KEY = "YOUR_SUPER_SECRET_KEY"
RECEIVE_FOLDER = "received_logs"
HOST = "0.0.0.0"  # Listen on all network interfaces
PORT = 5000

# --- Flask App ---
app = Flask(__name__)

@app.before_request
def check_secret_key():
    """Authenticate requests using a secret key header."""
    if request.path == '/upload':
        auth_header = request.headers.get("X-API-KEY")
        if not auth_header or auth_header != API_SECRET_KEY:
            print(f"Authentication failed for IP: {request.remote_addr}")
            abort(401, description="Invalid or missing API Key.")

@app.route("/upload", methods=["POST"])
def upload_file():
    """Handle incoming log file uploads."""
    # Ensure the receive folder exists
    if not os.path.exists(RECEIVE_FOLDER):
        os.makedirs(RECEIVE_FOLDER)
        print(f"Created receive folder: {RECEIVE_FOLDER}")

    if 'log_file' not in request.files:
        print("Upload request is missing the file part.")
        return "File part is missing", 400

    file = request.files['log_file']

    if file.filename == '':
        print("Upload request has no selected file.")
        return "No selected file", 400

    if file:
        filename = file.filename
        save_path = os.path.join(RECEIVE_FOLDER, os.path.basename(filename))
        
        # Avoid directory traversal attacks
        if os.path.dirname(save_path) != RECEIVE_FOLDER:
            return "Invalid filename", 400

        try:
            file.save(save_path)
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"Successfully received '{filename}' from {request.remote_addr} at {timestamp}")
            return "File uploaded successfully", 200
        except Exception as e:
            print(f"Error saving file '{filename}': {e}")
            return "Error saving file", 500

    return "An unknown error occurred", 500

def start_receiver():
    """Start the Flask log receiver."""
    print("--- Log Receiver Server ---")
    print(f"Starting server at http://{HOST}:{PORT}")
    print(f"Receive folder: {RECEIVE_FOLDER}")
    print("Waiting for log files...")
    # For production, use a proper WSGI server like Gunicorn or Waitress.
    # For development and simplicity, we use Flask's built-in server.
    app.run(host=HOST, port=PORT)

if __name__ == "__main__":
    start_receiver()