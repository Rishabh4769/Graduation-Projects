"""
Automated log transmission module. 
Monitors the local logs directory and securely uploads completed log files 
to a remote Flask receiver using authenticated HTTP POST requests. 
Includes logic to ensure files aren't uploaded while still being written.
"""

import os
import time
import requests
import threading
from datetime import datetime
from typing import Set, List

# --- Configuration ---
# This must be the public IP address or domain name of your receiver.
# If running on the same machine for testing, you can use "http://127.0.0.1:5000".
RECEIVER_URL = "https://9a2c-103-10-3-1.ngrok-free.app/upload" 


# IMPORTANT: This key must match the API_SECRET_KEY in receiver.py
API_SECRET_KEY = "YOUR_SUPER_SECRET_KEY"

LOGS_FOLDER = "logs"

class LogSender:
    def __init__(self, receiver_url: str, api_key: str, logs_folder: str = "logs"):
        """
        Initializes the LogSender with server details and monitoring targets.
        
        Args:
            receiver_url (str): The destination URL for log uploads.
            api_key (str): The secret key used for server-side authentication.
            logs_folder (str): Local path to the directory containing logs.
        """
        self.receiver_url = receiver_url
        self.api_key = api_key
        self.logs_folder = logs_folder
        self.sent_files: Set[str] = set()
        self.running = False

    def send_file(self, file_path: str):
        """
        Reads a log file and transmits it to the receiver. 
        Marks the file as sent upon a successful 200 OK response.
        
        Args:
            file_path (str): The full path to the file to be sent.
        Returns:
            bool: True if the file was sent successfully, False otherwise.
        """
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return False

        try:
            with open(file_path, "rb") as f:
                files = {'log_file': (os.path.basename(file_path), f, 'text/plain')}
                headers = {'X-API-KEY': self.api_key}
                
                print(f"Sending {os.path.basename(file_path)} to {self.receiver_url}...")
                
                response = requests.post(self.receiver_url, files=files, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    self.sent_files.add(file_path)
                    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    print(f"Successfully sent: {os.path.basename(file_path)} at {timestamp}")
                    return True
                else:
                    print(f"Failed to send {os.path.basename(file_path)}. Status: {response.status_code}, Response: {response.text}")
                    return False

        except requests.exceptions.RequestException as e:
            print(f"Error sending {os.path.basename(file_path)}: {e}")
            return False
            
    def get_pending_files(self) -> List[str]:
        """
        Identifies log files in the directory that have not been successfully 
        transmitted in the current session.
        
        Returns:
            list: A list of paths to pending log files.
        """
        if not os.path.exists(self.logs_folder):
            return []
        
        pending: List[str] = []
        for filename in sorted(os.listdir(self.logs_folder)):
            if filename.startswith("log_") and filename.endswith(".txt"):
                file_path = os.path.join(self.logs_folder, filename)
                if file_path not in self.sent_files:
                    pending.append(file_path)
        
        return pending

    def monitor_and_send(self, check_interval : int = 60):
        """
        Execution loop for the sender. Scans for files and attempts to 
        upload them if their file size has stabilized (indicating completion).
        
        Args:
            check_interval (int): Seconds to wait between folder scans.
        """
        self.running = True
        print("--- Log Sender ---")
        print(f"Monitoring folder: {self.logs_folder}")
        print(f"Sending to: {self.receiver_url}")

        while self.running:
            try:
                pending_files = self.get_pending_files()
                
                if not pending_files:
                    time.sleep(check_interval)
                    continue

                print(f"Found {len(pending_files)} pending file(s).")
                for file_path in pending_files:
                    # Optional: Check if file is still being written to
                    try:
                        size_before = os.path.getsize(file_path)
                        time.sleep(1)
                        size_after = os.path.getsize(file_path)
                        
                        if size_before == size_after:
                            self.send_file(file_path)
                        else:
                            print(f"Skipping {os.path.basename(file_path)}, as it is still being modified.")
                    except FileNotFoundError:
                        continue # File might have been deleted between listing and sending

                time.sleep(check_interval)
            
            except Exception as e:
                print(f"An error occurred in the monitoring loop: {e}")
                time.sleep(check_interval)

    def stop(self):
        """
        Signals the monitoring loop to stop gracefully.
        """
        self.running = False
        print("Sender stopped.")

def start_sender(check_interval : int = 60):
    """
    Helper function to instantiate the LogSender and run its monitoring 
    loop in a background daemon thread.
    
    Args:
        check_interval (int): How frequently to check for new logs.
    Returns:
        LogSender: The instance of the sender currently running.
    """
    sender = LogSender(RECEIVER_URL, API_SECRET_KEY, LOGS_FOLDER)
    
    sender_thread = threading.Thread(
        target=sender.monitor_and_send,
        args=(check_interval,),
        daemon=True
    )
    sender_thread.start()
    return sender

if __name__ == "__main__":
    # How often to check for new log files (in seconds)
    CHECK_INTERVAL = 60
    
    sender = start_sender(CHECK_INTERVAL)
    
    try:
        # Keep the main thread alive to allow the background sender to run
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        sender.stop()
        print("Log sender shut down.")