# NetScope v2

A professional network traffic monitor and anomaly detector. The original Tkinter desktop UI has been replaced with a FastAPI backend and a React frontend.

## Architecture

```
NetScope/
├── backend/
│   ├── main.py        # FastAPI app — REST endpoints + WebSocket
│   ├── sniffer.py     # PacketSniffer (Scapy, decoupled from UI)
│   ├── database.py    # SQLite layer (parameterised queries only)
│   ├── report.py      # PDF report generation (ReportLab)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── hooks/
│   │   │   ├── useCapture.js    # Capture state + API calls
│   │   │   └── useWebSocket.js  # Auto-reconnecting WS client
│   │   └── components/
│   │       ├── Sidebar.jsx
│   │       ├── CaptureBar.jsx   # Controls + settings panel
│   │       ├── Dashboard.jsx    # Stat cards + recent activity
│   │       ├── PacketTable.jsx  # Filterable live packet table
│   │       ├── AlertTable.jsx   # Filterable alert table
│   │       ├── TrafficChart.jsx # Chart.js line chart
│   │       └── Sessions.jsx     # Historical sessions browser
│   └── package.json
├── netscope.py        # Original Tkinter app (preserved)
├── network_traffic.db # SQLite database
├── start_backend.sh
└── start_frontend.sh
```

## Requirements

- Python 3.10+
- Node.js 18+
- Raw packet capture requires elevated privileges

## Setup & Run

### Backend

```bash
./start_backend.sh
```

This creates a `.venv`, installs Python dependencies, and starts the API on `http://127.0.0.1:8000`.

> On macOS/Linux, Scapy needs root for raw capture. The script handles this automatically.

### Frontend

In a second terminal:

```bash
./start_frontend.sh
```

Opens the React app at `http://localhost:5173`.

## API Reference

Interactive docs available at `http://127.0.0.1:8000/api/docs` while the backend is running.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/capture/start` | Start capture with settings |
| `POST` | `/api/capture/stop`  | Stop capture |
| `POST` | `/api/capture/settings` | Update detection thresholds live |
| `GET`  | `/api/capture/status` | Current capture state |
| `GET`  | `/api/sessions` | List all sessions |
| `GET`  | `/api/sessions/{id}/summary` | Session packet/alert counts |
| `GET`  | `/api/sessions/{id}/packets` | Paginated packet rows |
| `GET`  | `/api/sessions/{id}/alerts`  | Alert rows |
| `GET`  | `/api/sessions/{id}/port-usage` | Port distribution |
| `GET`  | `/api/sessions/{id}/graph`   | Time-bucketed chart data |
| `GET`  | `/api/sessions/{id}/report`  | Download PDF report |
| `WS`   | `/ws/stream` | Live packet/alert push stream |

## Security Notes

- CORS is restricted to `localhost:5173` only
- All SQL uses parameterised queries — no injection surface
- BPF filter input is whitelist-validated (`tcp`, `udp`, `icmp`, `ip`)
- All numeric settings are bounded via Pydantic validators
- The API runs on `127.0.0.1` (loopback) by default — not exposed to the network
- No credentials or secrets are stored or transmitted
