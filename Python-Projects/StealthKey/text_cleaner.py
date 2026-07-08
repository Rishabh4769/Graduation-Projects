"""
Text cleanup utility module.
Provides basic string replacement functions to normalize raw keylog 
tokens into a more readable text format.
"""

def clean_log_content(content: str):
    """
    Replaces special key identifiers with their readable equivalents.
    
    Args:
        content (str): The raw text content of the log file.
    Returns:
        str: The log content with normalized whitespace and key markers.
    """
    content = content.replace(" spacebar ", " ")
    content = content.replace(" enterPressed\n", "\n")
    content = content.replace(" capLockKey ", "c_lock")
    return content
