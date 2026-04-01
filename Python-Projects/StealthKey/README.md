# StealthKey

StealthKey is a Python-based keystroke logging workflow with log rotation, text cleanup, optional spell correction, and sender/receiver utilities for transferring generated logs.

## Files

- `main.py`: starts the StealthKey listener and background log cleanup flow.
- `stealthkey.py`: core listener and log-writing logic.
- `log_creator.py`: creates and rotates log files in `logs/`.
- `text_cleaner.py`: normalizes captured special-key text.
- `spell_corrector.py`: applies basic dictionary-based correction.
- `sender.py`: uploads generated logs to a receiver endpoint.
- `receiver.py`: Flask receiver for uploaded log files.

## Requirements

- Python 3.10+
- Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

Start the main StealthKey workflow:

```bash
python main.py
```

Start the receiver service:

```bash
python receiver.py
```

Start the log sender:

```bash
python sender.py
```

## Notes

- Update `API_SECRET_KEY` in both `sender.py` and `receiver.py` before using file transfer.
- The project writes logs into the local `logs/` directory by default.
