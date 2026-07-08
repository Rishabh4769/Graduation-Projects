"""
Log Lifecycle Management module.
Handles the creation and rotation of log files. Ensures that logs are 
stored in a specific directory, reuses daily files to prevent fragmentation, 
and schedules an automatic rotation at midnight every day.
"""

import os
import threading
import time
from datetime import datetime, timedelta

class LogCreator:
    def __init__(self, logs_folder: str = "logs"):
        """
        Initializes the LogCreator and ensures the environment is ready for logging.
        
        Args:
            logs_folder (str): The directory name where logs should be stored.
        """
        self.logs_folder = logs_folder
        self.current_log_file = None
        self.ensure_logs_folder()
        self.create_initial_log_file()
    
    def ensure_logs_folder(self):
        """
        Checks for the existence of the logs folder and creates it if missing.
        """
        if not os.path.exists(self.logs_folder):
            os.makedirs(self.logs_folder)
            print(f"Created logs folder: {self.logs_folder}")
    
    def get_log_filename(self):
        """
        Determines the appropriate filename for logging. It looks for an 
        existing file for the current date or generates a new one with a 
        detailed 12-hour timestamp if no daily file exists.
        
        Returns:
            str: The determined filename for the log.
        """
        date_str = datetime.now().strftime("%Y-%m-%d")
        # Check if any file for the current date already exists in the logs folder
        for filename in os.listdir(self.logs_folder):
            if filename.startswith(f"log_{date_str}") and filename.endswith(".txt"):
                return filename
        
        # If no file for today exists, create a new one with full 12-hour timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d_%I-%M-%S_%p")
        return f"log_{timestamp}.txt"
    
    def create_initial_log_file(self):
        """
        Establishes the path for the current log file and creates the file 
        on disk if it does not already exist.
        """
        filename = self.get_log_filename()
        self.current_log_file = os.path.join(self.logs_folder, filename)
        
        # Create empty log file if it doesn't exist
        if not os.path.exists(self.current_log_file):
            with open(self.current_log_file, "w", encoding="utf-8") as f:
                f.write("")
            print(f"Created log file: {self.current_log_file}")
    
    def get_current_log_file(self):
        """
        Returns the full file path of the log currently being used by the system.
        
        Returns:
            str: The active log file path.
        """
        return self.current_log_file
    
    def rotate_log_file(self):
        """
        Triggers the creation of a new log file, typically called by the 
        scheduler during day transitions.
        """
        self.create_initial_log_file()
        print(f"Log file rotated. New log: {self.current_log_file}")
    
    def time_until_midnight(self):
        """
        Calculates the number of seconds remaining until 12:00 AM of the next day.
        
        Returns:
            float: Seconds remaining until midnight.
        """
        now = datetime.now()
        next_midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        return (next_midnight - now).total_seconds()
    
    def scheduler(self):
        """
        Infinite loop meant for a background thread that sleeps until 
        midnight to perform the daily log rotation.
        """
        while True:
            sleep_time = self.time_until_midnight()
            print(f"Next log rotation in {sleep_time:.0f} seconds (at midnight)")
            time.sleep(sleep_time)
            self.rotate_log_file()

def start_log_creator(logs_folder: str = "logs"):
    """
    Initializes the LogCreator and starts the midnight rotation scheduler 
    in a background daemon thread.
    
    Args:
        logs_folder (str): The folder to manage logs in.
    Returns:
        LogCreator: The initialized manager instance.
    """
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
