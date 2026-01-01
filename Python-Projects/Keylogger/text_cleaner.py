def clean_log_content(content):
    content = content.replace(" spacebar ", " ")
    content = content.replace(" enterPressed\n", "\n")
    content = content.replace(" capLockKey ", "c_lock")
    return content
