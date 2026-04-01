# NetScope

NetScope is a Python desktop application for capturing network traffic, storing packet metadata in SQLite, detecting simple anomalies, and exporting session reports and graphs.

## Features

- Live packet capture with protocol filtering
- Packet and alert logging in `network_traffic.db`
- Basic detection for port scanning and traffic flooding
- Session graphs and PDF export from the desktop UI

## Requirements

- Python 3.10+
- Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

```bash
python netscope.py
```

## Notes

- Packet capture typically requires elevated privileges depending on the operating system.
- Captured session data is stored locally in `network_traffic.db`.
