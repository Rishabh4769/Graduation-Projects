"""
Log Receiver Server.
A lightweight Flask application designed to receive log files from the 
LogSender. It enforces security through API key validation and ensures 
file system safety by preventing directory traversal and verifying upload paths.
"""

import os
from flask import Flask, request, abort, Response
from datetime import datetime
from typing import Tuple, Union

# --- Configuration ---
# IMPORTANT: Use a strong, randomly generated secret key in a real environment
# This key must match the one used by the sender.
API_SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY"
RECEIVE_FOLDER: str = "received_logs"
HOST: str = "0.0.0.0"  # Listen on all network interfaces
PORT: int = 5000

# --- Flask App ---
app: Flask = Flask(__name__)

@app.before_request
def check_secret_key() -> None:
    """
    Middleware to authenticate incoming requests. Rejects any request to 
    the /upload endpoint that lacks a valid X-API-KEY header.
    """
    if request.path == '/upload':
        auth_header = request.headers.get("X-API-KEY")
        if not auth_header or auth_header != API_SECRET_KEY:
            print(f"Authentication failed for IP: {request.remote_addr}")
            abort(401, description="Invalid or missing API Key.")

@app.route("/upload", methods=["POST"]) # type: ignore
def upload_file() -> Union[Tuple[str, int], Response]:
    """
    API Endpoint to receive log files. Validates the file part, checks 
    for filename safety, and saves the file to the receive folder.
    
    Returns:
        tuple: Status message and HTTP status code.
    """
    # Ensure the receive folder exists
    if not os.path.exists(RECEIVE_FOLDER):
        os.makedirs(RECEIVE_FOLDER)
        print(f"Created receive folder: {RECEIVE_FOLDER}")

    if 'log_file' not in request.files:
        print("Upload request is missing the file part.")
        return "File part is missing", 400

    file = request.files['log_file']

    if not file.filename or file.filename == '':
        print("Upload request has no selected file.")
        return "No selected file", 400

    if file:
        filename: str = file.filename
        save_path = os.path.join(RECEIVE_FOLDER, os.path.basename(filename))
        
        # Avoid directory traversal attacks
        if os.path.abspath(os.path.dirname(save_path)) != os.path.abspath(RECEIVE_FOLDER):
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

def start_receiver() -> None:
    """
    Initializes and starts the Flask development server to listen for 
    incoming log transmissions.
    """
    print("--- Log Receiver Server ---")
    print(f"Starting server at http://{HOST}:{PORT}")
    print(f"Receive folder: {RECEIVE_FOLDER}")
    print("Waiting for log files...")
    # For production, use a proper WSGI server like Gunicorn or Waitress.
    # For development and simplicity, we use Flask's built-in server.
    app.run(host=HOST, port=PORT)

if __name__ == "__main__":
    start_receiver()