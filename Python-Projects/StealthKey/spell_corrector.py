"""
Natural Language Processing (NLP) utility module for StealthKey.
Responsible for downloading NLTK data, simulating backspace deletions in strings, 
stripping technical key identifiers, and performing dictionary-based 
spelling corrections using Levenshtein distance.
"""

import nltk  # type: ignore
import ssl
import re
from typing import List
from nltk.corpus import words # type: ignore
from nltk.metrics import edit_distance  # type: ignore

# Workaround for SSL certificate verification issue on macOS
try:
    unverified_https_context = ssl._create_unverified_context() # type: ignore
except AttributeError:
    pass
else:
    ssl._create_default_https_context = unverified_https_context # type: ignore

try:
    correct_words = set(words.words())  # type: ignore
except:
    nltk.download('words') # type: ignore
    correct_words = set(words.words()) # type: ignore

def apply_backspaces(text: str):
    """
    Scans the text for 'backspaceKey' tokens and removes the character 
    immediately preceding each token to simulate real typing behavior.
    
    Args:
        text (str): The raw log content containing backspace tokens.
    Returns:
        str: The processed text with characters 'deleted' via backspace.
    """
    token = " backspaceKey "
    while token in text:
        idx = text.find(token)
        before = text[:idx]
        after = text[idx + len(token):]
        
        # Splice the last character from the 'before' part
        if before:
            before = before[:-1]
            
        # Merge parts, removing leading whitespace from 'after' to keep words joined
        text = before + after.lstrip()
    return text

def clean_special_keys(text: str):
    """
    Uses regular expressions to remove technical key labels (e.g., Key.esc, 
    shiftPressedKey) while maintaining the structural integrity of the text.
    
    Args:
        text (str): The text to clean.
    Returns:
        str: Cleaned text containing only the intended characters and spacing.
    """
    # Remove pynput style keys: Key.esc, Key.caps_lock, etc.
    text = re.sub(r'Key\.\w+', '', text)
    # Remove other custom tokens like shiftPressedKey, ctrlKey+, etc.
    text = re.sub(r'\w+Key(\+)?', '', text)
    # Clean up multiple spaces but keep newlines intact
    text = re.sub(r' +', ' ', text)
    return text.strip()

def correct_word(word: str):
    """
    Checks a single word against the NLTK dictionary. if misspelled, it 
    suggests the closest match based on edit distance.
    
    Args:
        word (str): The word to check.
    Returns:
        str: The original word if correct, or the closest dictionary match.
    """
    if not word or len(word) == 0:
        return word
    
    if word.lower() in correct_words:
        return word
    
    else:
        candidates = [w for w in correct_words if w[0] == word[0].lower()]
        if not candidates:
            return word
        closest = min(candidates, key=lambda w: edit_distance(word.lower(), w))  # type: ignore
        return closest

def correct_text(text: str):
    """
    Main entry point for text processing. Applies backspaces, cleans noise, 
    and performs line-by-line spelling correction while preserving line breaks.
    
    Args:
        text (str): The full log content.
    Returns:
        str: The fully processed and spell-checked text.
    """
    if not text:
        return text
    
    # 1. Process backspaces to merge characters correctly
    text = apply_backspaces(text)
    # 2. Clean remaining special key noise
    text = clean_special_keys(text)
    
    # 3. Process line by line to preserve newlines (\n)
    lines = text.split('\n')
    corrected_lines: List[str] = []
    for line in lines:
        words_list = line.split()
        corrected_words = [correct_word(w) for w in words_list]
        corrected_lines.append(" ".join(corrected_words))
        
    return "\n".join(corrected_lines)