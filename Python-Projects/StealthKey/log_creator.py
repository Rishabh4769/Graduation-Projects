import os
import threading
import time
from datetime import datetime, timedelta
import shutil

class LogCreator:
    def __init__(self, logs_folder="logs"):
        self.logs_folder = logs_folder
        self.current_log_file = None
        self.ensure_logs_folder()
        self.create_initial_log_file()
    
    def ensure_logs_folder(self):
        """Create logs folder if it doesn't exist"""
        if not os.path.exists(self.logs_folder):
            os.makedirs(self.logs_folder)
            print(f"Created logs folder: {self.logs_folder}")
    
    def get_log_filename(self):
        """Generate log filename in format log_date&time.txt"""
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        return f"log_{timestamp}.txt"
    
    def create_initial_log_file(self):
        """Create the initial log file"""
        filename = self.get_log_filename()
        self.current_log_file = os.path.join(self.logs_folder, filename)
        
        # Create empty log file if it doesn't exist
        if not os.path.exists(self.current_log_file):
            with open(self.current_log_file, "w", encoding="utf-8") as f:
                f.write("")
            print(f"Created log file: {self.current_log_file}")
    
    def get_current_log_file(self):
        """Return the current log file path"""
        return self.current_log_file
    
    def rotate_log_file(self):
        """Create a new log file (called daily at 12:00 AM)"""
        self.create_initial_log_file()
        print(f"Log file rotated. New log: {self.current_log_file}")
    
    def time_until_midnight(self):
        """Calculate seconds until next midnight (12:00 AM)"""
        now = datetime.now()
        next_midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        return (next_midnight - now).total_seconds()
    
    def scheduler(self):
        """Schedule log file rotation at 12:00 AM daily"""
        while True:
            sleep_time = self.time_until_midnight()
            print(f"Next log rotation in {sleep_time:.0f} seconds (at midnight)")
            time.sleep(sleep_time)
            self.rotate_log_file()

def start_log_creator(logs_folder="logs"):
    """Start the log creator scheduler in a daemon thread"""
    log_creator = LogCreator(logs_folder)
    
    scheduler_thread = threading.Thread(target=log_creator.scheduler, daemon=True)
    scheduler_thread.start()
    
    return log_creator

if __name__ == "__main__":
    log_creator = start_log_creator()
    print(f"Log creator started. Current log file: {log_creator.get_current_log_file()}")
    
    # Keep the script running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Log creator stopped.")
