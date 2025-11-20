# Network Packet Sniffer with Alert System

## Overview

This project is a desktop application for real-time network packet capture and analysis with integrated anomaly detection and visualization.

Built with Python, it combines:

- **Packet sniffing** using Scapy for TCP/UDP/ICMP protocols.
- **Real-time alerts** for port scanning and traffic flooding.
- Persistent **SQL database logging** of packets and alerts.
- A professional **Tkinter GUI** for interactive monitoring.
- **Scatter plot visualizations** of packet and alert trends.
- **PDF report export** for offline analysis.

This tool is useful for network administrators, security analysts, and hobbyists interested in network traffic monitoring and basic intrusion detection.

---

## Features

- **Capture controls:** Start and stop live network packet capture with optional BPF filtering.
- **Alert detection:** Detect port scans and flooding by configurable thresholds.
- **Data display:** Real-time packet and alert logs with sortable tables.
- **Configurable settings:** Adjust filter expressions, time window for analysis, thresholds for alerts.
- **Visualization:** View and save scatter plots visualizing traffic and alert counts.
- **Export reports:** Generate styled PDF reports with session summaries.
- **Persistent storage:** Uses SQLite database to store and query captured data.

---

## Installation

### Prerequisites

- Python 3.8 or higher
- `scapy`
- `matplotlib`
- `reportlab`
- (Optional) `numpy` for data analysis and graph jittering

### Install dependencies

`$ pip install scapy matplotlib reportlab numpy`


---

## Usage

1. Clone the repo and open the project directory.
2. Run the main Python script:
  `python Sniffer.py`

3. Configure optional filters and thresholds in the GUI.
4. Click **Start Capture** to begin monitoring.
5. View real-time packets and alerts in their respective tabs.
6. Use **Show Graph** to visualize traffic trends.
7. Save graphs or export PDF reports from session data.
8. Clear logs or adjust settings as needed.

---

## Configuration

- **BPF Filter:** Use Berkeley Packet Filter syntax (e.g., `tcp`, `udp`, `port 80`).
- **Time Window:** Analysis interval in seconds for alert detection.
- **Max Ports Scanned:** Threshold for number of unique ports scanned triggering port scan alert.
- **Max Packets Flood:** Packet count threshold triggering flooding alert.

---

## How It Works

- The sniffer captures packets continuously in a background thread.
- Each packet is analyzed and logged in real time.
- Anomalies are detected by counting source IP behavior within the time window.
- Alerts are raised and displayed in the GUI immediately.
- Data is saved in an SQLite database categorized by session.
- Visualizations and reports are generated from the stored session data.

---

## Limitations & Future Work

- Current anomaly detection is simple rule-based; future versions could integrate machine learning.
- Visualization can be expanded with more detailed network metrics.
- Support for live embedded matplotlib plotting in the Tkinter GUI.
- Cross-platform testing and optimizations.
- User authentication and remote monitoring capabilities.

---

## Author

Rishabh Joshi - [rishabh.public.mail@gmail.com]
