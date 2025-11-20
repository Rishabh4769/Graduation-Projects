import os
import sqlite3
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from threading import Thread
from queue import Queue, Empty
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet
from scapy.all import sniff, IP, TCP, UDP, ICMP
import time
import datetime
import numpy as np
from collections import defaultdict

# =================== Database setup ==================== #
def init_db():
    conn = sqlite3.connect('network_traffic.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS packets (
            timestamp TEXT,
            src_ip TEXT,
            dst_port INTEGER,
            length INTEGER,
            protocol TEXT,
            flags TEXT,
            session_id TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            timestamp TEXT,
            src_ip TEXT,
            alert_type TEXT,
            description TEXT,
            session_id TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_packet_db(packet_data):
    with sqlite3.connect('network_traffic.db') as conn:
        c = conn.cursor()
        c.execute('INSERT INTO packets VALUES (?, ?, ?, ?, ?, ?, ?)', packet_data)
        conn.commit()

def log_alert_db(alert_data):
    with sqlite3.connect('network_traffic.db') as conn:
        c = conn.cursor()
        c.execute('INSERT INTO alerts VALUES (?, ?, ?, ?, ?)', alert_data)
        conn.commit()

# ========= Packet Sniffer with anomaly detection ========= #
class PacketSniffer:
    def __init__(self, packet_queue, alert_queue, session_id, filter_exp=None):
        self.packet_queue = packet_queue
        self.alert_queue = alert_queue
        self.session_id = session_id
        self.filter = filter_exp
        self.connections = defaultdict(set)
        self.packet_counts = defaultdict(int)
        self.time_window = 10
        self.max_ports_scanned = 5
        self.max_packets_flood = 30
        self.last_cleanup = time.time()
        self.running = False
        self.alerted_ips = set()

    def start(self):
        self.running = True
        self.sniff_thread = Thread(target=self.sniff_packets, daemon=True)
        self.sniff_thread.start()

    def stop(self):
        self.running = False

    def sniff_packets(self):
        try:
            if self.filter:
                valid_filters = ["tcp", "udp", "icmp", "ip"]
                if self.filter.lower() not in valid_filters:
                    print(f"[WARN] Invalid filter '{self.filter}', capturing all packets instead.")
                    sniff(prn=self.packet_callback, store=0, stop_filter=lambda x: not self.running)
                else:
                    sniff(prn=self.packet_callback, filter=self.filter, store=0, stop_filter=lambda x: not self.running)
            else:
                sniff(prn=self.packet_callback, store=0, stop_filter=lambda x: not self.running)
        except Exception as e:
            print(f"[ERROR] Sniffer error: {e}")


    def packet_callback(self, pkt):
        if not self.running:
            return False
        if IP in pkt:
            timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
            src_ip = pkt[IP].src
            length = len(pkt)
            protocol = 'IP'
            dst_port = None
            flags = ''

            if TCP in pkt:
                protocol = 'TCP'
                dst_port = pkt[TCP].dport
                flags = str(pkt[TCP].flags)
            elif UDP in pkt:
                protocol = 'UDP'
                try:
                    dst_port = pkt[UDP].dport
                except Exception:
                    dst_port = None
            elif ICMP in pkt:
                protocol = 'ICMP'
                dst_port = 0

            dst_port_val = int(dst_port) if dst_port is not None else 0

            self.packet_queue.put((timestamp, src_ip, dst_port_val, length, protocol, flags, self.session_id))

            self.connections[src_ip].add(dst_port)
            self.packet_counts[src_ip] += 1

            current_time = time.time()
            if current_time - self.last_cleanup > self.time_window:
                self.connections.clear()
                self.packet_counts.clear()
                self.alerted_ips.clear()
                self.last_cleanup = current_time

            if len(self.connections[src_ip]) > self.max_ports_scanned and src_ip not in self.alerted_ips:
                alert_msg = f"Port scanning detected from {src_ip} ({len(self.connections[src_ip])} ports)"
                self.alert_queue.put((timestamp, src_ip, 'Port Scanning', alert_msg, self.session_id))
                self.alerted_ips.add(src_ip)
                print(f"[ALERT] {alert_msg}")

            if self.packet_counts[src_ip] > self.max_packets_flood and f"{src_ip}_flood" not in self.alerted_ips:
                alert_msg = f"Traffic flooding from {src_ip} ({self.packet_counts[src_ip]} packets)"
                self.alert_queue.put((timestamp, src_ip, 'Flooding', alert_msg, self.session_id))
                self.alerted_ips.add(f"{src_ip}_flood")
                print(f"[ALERT] {alert_msg}")

# ======================= GUI App =========================== #
class NetworkSnifferApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Network Packet Sniffer with Alert System")
        self.geometry("1200x800")
        self.configure(bg='#2e3440')
        self.resizable(True, True)

        self.session_id = time.strftime('%Y%m%d_%H%M%S')

        style = ttk.Style(self)
        style.theme_use('clam')

        style.configure('TFrame', background='#2e3440')
        style.configure('TLabel', background='#2e3440', foreground='#d8dee9', font=('Segoe UI', 11))
        style.configure('TButton',
                        font=('Segoe UI', 10, 'bold'),
                        foreground='#2e3440',
                        background='#88c0d0',
                        borderwidth=0,
                        focusthickness=3,
                        focuscolor='none',
                        relief='flat')
        style.map('TButton',
                  background=[('active', '#81a1c1'), ('pressed', '#5e81ac')],
                  foreground=[('active', '#ffffff'), ('pressed', '#ffffff')])

        style.configure("TNotebook.Tab", padding=[15, 8], background='#3b4252', foreground='#88c0d0', font=('Segoe UI', 10))
        style.map("TNotebook.Tab",
                  background=[("selected", "#434c5e")],
                  foreground=[("selected", "#d8dee9")])

        style.configure('Treeview', background='#3b4252', foreground='#d8dee9', fieldbackground='#3b4252', font=('Consolas', 9))
        style.configure('Treeview.Heading', background='#4c566a', foreground='#eceff4', font=('Segoe UI', 10, 'bold'))

        self.packet_queue = Queue()
        self.alert_queue = Queue()

        init_db()
        self.sniffer = PacketSniffer(self.packet_queue, self.alert_queue, self.session_id)

        self.last_graph_x = []
        self.last_graph_y_packet = []
        self.last_graph_y_alert = []

        self.create_menu()
        self.create_widgets()
        self.after(100, self.update_ui)

    def create_menu(self):
        menubar = tk.Menu(self, bg='#2e3440', fg='#d8dee9', font=('Segoe UI', 10))
        self.config(menu=menubar)

        file_menu = tk.Menu(menubar, tearoff=0, bg='#3b4252', fg='#d8dee9')
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Export PDF", command=self.export_pdf)
        file_menu.add_separator()
        file_menu.add_command(label="Exit", command=self.quit)

        tools_menu = tk.Menu(menubar, tearoff=0, bg='#3b4252', fg='#d8dee9')
        menubar.add_cascade(label="Tools", menu=tools_menu)
        tools_menu.add_command(label="Clear Logs", command=self.clear_logs)

    def create_widgets(self):
        title_frame = ttk.Frame(self)
        title_frame.pack(fill=tk.X, padx=20, pady=(10, 5))

        title_lbl = tk.Label(title_frame, text="Network Packet Sniffer", font=('Segoe UI', 24, 'bold'),
                             bg='#2e3440', fg='#88c0d0')
        title_lbl.pack()

        control_frame = ttk.Frame(self)
        control_frame.pack(fill=tk.X, padx=20, pady=10)

        self.start_btn = ttk.Button(control_frame, text="▶ Start Capture", command=self.start_capture, width=18)
        self.start_btn.pack(side=tk.LEFT, padx=5)

        self.stop_btn = ttk.Button(control_frame, text="⏹ Stop Capture", command=self.stop_capture, state=tk.DISABLED, width=18)
        self.stop_btn.pack(side=tk.LEFT, padx=5)

        ttk.Button(control_frame, text="📄 Export PDF", command=self.export_pdf, width=18).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="📊 Show Graph", command=self.show_graph, width=18).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="💾 Save Graph", command=self.save_graph, width=18).pack(side=tk.LEFT, padx=5)
        ttk.Button(control_frame, text="🗑 Clear Logs", command=self.clear_logs, width=18).pack(side=tk.LEFT, padx=5)

        settings_frame = ttk.Frame(self)
        settings_frame.pack(fill=tk.X, padx=20, pady=(5, 10))

        ttk.Label(settings_frame, text="BPF Filter:", background='#2e3440', foreground='#d8dee9').pack(side=tk.LEFT, padx=(0,6))
        self.filter_entry = ttk.Entry(settings_frame, width=30)
        self.filter_entry.pack(side=tk.LEFT, padx=(0,10))

        ttk.Label(settings_frame, text="Time Window(s):", background='#2e3440', foreground='#d8dee9').pack(side=tk.LEFT, padx=(6,6))
        self.time_window_spin = tk.Spinbox(settings_frame, from_=1, to=3600, width=6)
        self.time_window_spin.delete(0, 'end')
        self.time_window_spin.insert(0, '10')
        self.time_window_spin.pack(side=tk.LEFT, padx=(0,10))

        ttk.Label(settings_frame, text="Max Ports Scanned:", background='#2e3440', foreground='#d8dee9').pack(side=tk.LEFT, padx=(6,6))
        self.max_ports_spin = tk.Spinbox(settings_frame, from_=1, to=65535, width=6)
        self.max_ports_spin.delete(0, 'end')
        self.max_ports_spin.insert(0, '5')
        self.max_ports_spin.pack(side=tk.LEFT, padx=(0,10))

        ttk.Label(settings_frame, text="Max Packets Flood:", background='#2e3440', foreground='#d8dee9').pack(side=tk.LEFT, padx=(6,6))
        self.max_flood_spin = tk.Spinbox(settings_frame, from_=1, to=1000000, width=6)
        self.max_flood_spin.delete(0, 'end')
        self.max_flood_spin.insert(0, '30')
        self.max_flood_spin.pack(side=tk.LEFT, padx=(0,10))

        ttk.Button(settings_frame, text="Apply", command=self.apply_settings, width=10).pack(side=tk.LEFT, padx=6)

        tab_control = ttk.Notebook(self)
        tab_control.pack(expand=1, fill='both', padx=10, pady=10)

        packet_tab = ttk.Frame(tab_control)
        tab_control.add(packet_tab, text='Captured Packets')

        self.packet_tree = ttk.Treeview(packet_tab, columns=('Timestamp', 'Source IP', 'Port', 'Length', 'Protocol', 'Flags'), show='headings', height=15)
        self.packet_tree.heading('Timestamp', text='Timestamp')
        self.packet_tree.heading('Source IP', text='Source IP')
        self.packet_tree.heading('Port', text='Port')
        self.packet_tree.heading('Length', text='Length')
        self.packet_tree.heading('Protocol', text='Protocol')
        self.packet_tree.heading('Flags', text='Flags')
        self.packet_tree.column('Timestamp', width=150)
        self.packet_tree.column('Source IP', width=120)
        self.packet_tree.column('Port', width=80)
        self.packet_tree.column('Length', width=80)
        self.packet_tree.column('Protocol', width=80)
        self.packet_tree.column('Flags', width=100)

        scrollbar = ttk.Scrollbar(packet_tab, orient=tk.VERTICAL, command=self.packet_tree.yview)
        self.packet_tree.configure(yscroll=scrollbar.set)
        self.packet_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        alert_tab = ttk.Frame(tab_control)
        tab_control.add(alert_tab, text='Alerts')

        self.alert_tree = ttk.Treeview(alert_tab, columns=('Timestamp', 'Source IP', 'Alert Type', 'Description'), show='headings', height=10)
        self.alert_tree.heading('Timestamp', text='Timestamp')
        self.alert_tree.heading('Source IP', text='Source IP')
        self.alert_tree.heading('Alert Type', text='Alert Type')
        self.alert_tree.heading('Description', text='Description')
        self.alert_tree.column('Timestamp', width=150)
        self.alert_tree.column('Source IP', width=120)
        self.alert_tree.column('Alert Type', width=100)
        self.alert_tree.column('Description', width=400)

        alert_scrollbar = ttk.Scrollbar(alert_tab, orient=tk.VERTICAL, command=self.alert_tree.yview)
        self.alert_tree.configure(yscroll=alert_scrollbar.set)
        self.alert_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        alert_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.status_var = tk.StringVar()
        self.status_var.set(f"Ready | Session: {self.session_id}")
        status_bar = tk.Label(self, textvariable=self.status_var, bg='#2e3440', fg='#88c0d0',
                              font=('Segoe UI', 10), anchor='w', relief='sunken', bd=1)
        status_bar.pack(fill=tk.X, side=tk.BOTTOM, ipady=5, padx=10)

    def start_capture(self):
        filter_val = self.filter_entry.get().strip()
        filter_val = filter_val if filter_val else None

        try:
            if hasattr(self, 'sniffer') and self.sniffer.running:
                self.sniffer.stop()
        except Exception:
            pass

        self.sniffer = PacketSniffer(self.packet_queue, self.alert_queue, self.session_id, filter_exp=filter_val)

        try:
            self.sniffer.time_window = int(self.time_window_spin.get())
        except Exception:
            self.sniffer.time_window = 10
        try:
            self.sniffer.max_ports_scanned = int(self.max_ports_spin.get())
        except Exception:
            self.sniffer.max_ports_scanned = 5
        try:
            self.sniffer.max_packets_flood = int(self.max_flood_spin.get())
        except Exception:
            self.sniffer.max_packets_flood = 30

        self.sniffer.start()
        self.status_var.set(f"Status: Capturing packets... | Session: {self.session_id}")
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)

    def stop_capture(self):
        self.sniffer.stop()
        self.status_var.set(f"Status: Capture stopped | Session: {self.session_id}")
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)

    def apply_settings(self):
        filter_val = self.filter_entry.get().strip()
        filter_val = filter_val if filter_val else None
        if hasattr(self, 'sniffer'):
            try:
                self.sniffer.filter = filter_val
                self.sniffer.time_window = int(self.time_window_spin.get())
                self.sniffer.max_ports_scanned = int(self.max_ports_spin.get())
                self.sniffer.max_packets_flood = int(self.max_flood_spin.get())
                self.status_var.set("Settings applied")
            except Exception as e:
                self.status_var.set(f"Failed to apply settings: {e}")

    def clear_logs(self):
        self.packet_tree.delete(*self.packet_tree.get_children())
        self.alert_tree.delete(*self.alert_tree.get_children())
        self.status_var.set("Logs cleared")

    def update_ui(self):
        processed_packets = 0
        max_packets_per_update = 50
        max_alerts_per_update = 20
        
        while processed_packets < max_packets_per_update:
            try:
                pkt = self.packet_queue.get_nowait()
                timestamp, src_ip, dst_port, length, protocol, flags, session_id = pkt
                self.packet_tree.insert('', tk.END, values=(timestamp, src_ip, dst_port, length, protocol, flags))
                self.packet_tree.yview_moveto(1)
                log_packet_db(pkt)
                processed_packets += 1
            except Empty:
                break
        
        processed_alerts = 0
        while processed_alerts < max_alerts_per_update:
            try:
                alert = self.alert_queue.get_nowait()
                timestamp, src_ip, alert_type, description, session_id = alert
                self.alert_tree.insert('', tk.END, values=(timestamp, src_ip, alert_type, description))
                self.alert_tree.yview_moveto(1)
                log_alert_db(alert)
                processed_alerts += 1
            except Empty:
                break

        if processed_packets:
            self.status_var.set(f"Captured {processed_packets} packets at {time.strftime('%H:%M:%S')} | Session: {self.session_id}")

        self.after(500, self.update_ui)

    def get_graph_data(self):
        conn = sqlite3.connect('network_traffic.db')
        c = conn.cursor()
        c.execute('SELECT timestamp FROM packets WHERE session_id=? ORDER BY timestamp', (self.session_id,))
        pkt_rows = [row[0] for row in c.fetchall()]
        c.execute('SELECT timestamp FROM alerts WHERE session_id=? ORDER BY timestamp', (self.session_id,))
        alert_rows = [row[0] for row in c.fetchall()]
        conn.close()

        def to_epoch(ts_str):
            try:
                dt = datetime.datetime.strptime(ts_str, '%Y-%m-%d %H:%M:%S')
                return dt.timestamp()
            except Exception:
                try:
                    dt = datetime.datetime.fromisoformat(ts_str)
                    return dt.timestamp()
                except Exception:
                    return None

        pkt_times = [to_epoch(t) for t in pkt_rows]
        pkt_times = [t for t in pkt_times if t is not None]
        alert_times = [to_epoch(t) for t in alert_rows]
        alert_times = [t for t in alert_times if t is not None]

        if not pkt_times and not alert_times:
            self.last_graph_x = []
            self.last_graph_y_packet = []
            self.last_graph_y_alert = []
            return

        all_times = pkt_times + alert_times
        min_ts = min(all_times)
        max_ts = max(all_times)
        if max_ts == min_ts:
            buckets = 1
            edges = [min_ts, min_ts + 1]
        else:
            duration = max_ts - min_ts
            buckets = min(60, max(5, int(duration) + 1))
            edges = np.linspace(min_ts, max_ts + 1, buckets + 1)

        pkt_counts, _ = np.histogram(pkt_times, bins=edges) if pkt_times else (np.zeros(buckets, dtype=int), edges)
        alert_counts, _ = np.histogram(alert_times, bins=edges) if alert_times else (np.zeros(buckets, dtype=int), edges)

        x = list(range(buckets))
        y_packet = pkt_counts.tolist()
        y_alert = alert_counts.tolist()

        self.last_graph_x = x
        self.last_graph_y_packet = y_packet
        self.last_graph_y_alert = y_alert

    def filter_unique_ports(self, x, y):
        seen_ports = set()
        filtered_x = []
        filtered_y = []
        for xi, yi in zip(x, y):
            if yi not in seen_ports:
                filtered_x.append(xi)
                filtered_y.append(yi)
                seen_ports.add(yi)
        return filtered_x, filtered_y

    def export_pdf(self):
        try:
            folder = filedialog.askdirectory(title="Select Folder to Save PDF")
            if not folder:
                return
            filename = os.path.join(folder, f"network_report_session_{self.session_id}.pdf")
            doc = SimpleDocTemplate(filename, pagesize=A4)
            elements = []
            styles = getSampleStyleSheet()

            title_style = styles['Title']
            title_style.alignment = 1
            elements.append(Paragraph("Network Traffic Report", title_style))
            elements.append(Spacer(1, 0.2*inch))

            conn = sqlite3.connect('network_traffic.db')
            c = conn.cursor()

            elements.append(Paragraph("Captured Packets (This Session)", styles['Heading2']))
            c.execute("SELECT timestamp, src_ip, dst_port, length, protocol, flags FROM packets WHERE session_id=? ORDER BY timestamp DESC LIMIT 100", (self.session_id,))
            packets = c.fetchall()
            if packets:
                data = [['Timestamp', 'Source IP', 'Port', 'Len', 'Protocol', 'Flags']]
                for p in packets:
                    data.append([str(r) for r in p])
                t = Table(data, colWidths=[1.8*inch, 1.2*inch, 0.5*inch, 0.5*inch, 0.8*inch, 0.8*inch])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#88c0d0')),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('FONTSIZE', (0,0), (-1,0), 10),
                    ('BOTTOMPADDING', (0,0), (-1,0), 12),
                    ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                    ('GRID', (0,0), (-1,-1), 1, colors.grey),
                    ('FONTSIZE', (0,1), (-1,-1), 8),
                ]))
                elements.append(t)
            else:
                elements.append(Paragraph("No packets captured.", styles['Normal']))
            elements.append(Spacer(1, 0.2*inch))

            c.execute('SELECT alert_type, GROUP_CONCAT(DISTINCT src_ip) FROM alerts WHERE session_id=? GROUP BY alert_type', (self.session_id,))
            alert_groups = c.fetchall()
            if alert_groups:
                data = [['Alert Type', 'IPs']]
                for alert_type, ips in alert_groups:
                    data.append([alert_type, ips])
                t = Table(data, colWidths=[2*inch, 4*inch])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#bf616a')),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('FONTSIZE', (0,0), (-1,0), 10),
                    ('BOTTOMPADDING', (0,0), (-1,0), 12),
                    ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                    ('GRID', (0,0), (-1,-1), 1, colors.grey),
                    ('FONTSIZE', (0,1), (-1,-1), 8),
                ]))
                elements.append(Paragraph("Alert Summary (Unique IPs)", styles['Heading2']))
                elements.append(t)
            else:
                elements.append(Paragraph("No alerts in this session.", styles['Normal']))
            elements.append(PageBreak())

            c.execute('SELECT dst_port, COUNT(*) as cnt, protocol FROM packets WHERE session_id=? GROUP BY dst_port, protocol ORDER BY cnt DESC LIMIT 50', (self.session_id,))
            ports = c.fetchall()
            if ports:
                data = [['Port', 'Protocol', 'Count']]
                for p in ports:
                    data.append([str(p[0]), p[2], str(p[1])])
                t = Table(data, colWidths=[1.2*inch, 1.2*inch, 1.2*inch])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#5e81ac')),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('FONTSIZE', (0,0), (-1,0), 10),
                    ('BOTTOMPADDING', (0,0), (-1,0), 12),
                    ('BACKGROUND', (0,1), (-1,-1), colors.beige),
                    ('GRID', (0,0), (-1,-1), 1, colors.grey),
                    ('FONTSIZE', (0,1), (-1,-1), 8),
                ]))
                elements.append(Paragraph("Port Usage", styles['Heading2']))
                elements.append(t)
            else:
                elements.append(Paragraph("No port data.", styles['Normal']))

            conn.close()
            doc.build(elements)

            messagebox.showinfo("Export Success", f"PDF saved as {os.path.basename(filename)}")
            self.status_var.set(f"PDF exported: {filename}")
        except Exception as e:
            messagebox.showerror("Export Failed", str(e))

    def show_graph(self):
        self.get_graph_data()
        x = self.last_graph_x
        y_packet = self.last_graph_y_packet
        y_alert = self.last_graph_y_alert

        if not x:
            messagebox.showinfo("No Data", "No packet data to plot for this session.")
            return
        plt.figure(figsize=(10, 5), facecolor='#2e3440')
        jitter = 0.18
        x_arr = np.array(x)
        if x_arr.size == 0:
            messagebox.showinfo("No Data", "No packet data to plot for this session.")
            return
        x_jitter_pkt = x_arr + (np.random.rand(len(x_arr)) - 0.5) * jitter
        x_jitter_alert = x_arr + (np.random.rand(len(x_arr)) - 0.5) * jitter
        plt.scatter(x_jitter_pkt, y_packet, c='#88c0d0', s=50, alpha=0.75, edgecolors='w', linewidths=0.5, label='Packets', marker='o')
        plt.scatter(x_jitter_alert, y_alert, c='#bf616a', s=60, alpha=0.9, edgecolors='k', linewidths=0.4, label='Alerts', marker='s')
        plt.title("Packet & Alert Counts (Scatter - clusters)", color='#d8dee9')
        plt.xlabel("Intervals", color='#d8dee9')
        plt.ylabel("Count", color='#d8dee9')
        plt.grid(True, color='#4c566a')
        plt.tick_params(colors='#d8dee9')
        plt.legend()
        plt.tight_layout()
        plt.show()

    def save_graph(self):
        self.get_graph_data()
        x = self.last_graph_x
        y_packet = self.last_graph_y_packet
        y_alert = self.last_graph_y_alert

        if not x:
            messagebox.showinfo("No Data", "No packet data to save as graph.")
            return

        file_path = filedialog.asksaveasfilename(
            title="Save Graph",
            defaultextension=".png",
            filetypes=[("PNG Image", "*.png"), ("All Files", "*.*")]
        )
        if not file_path:
            return

        plt.figure(figsize=(10, 5), facecolor='#2e3440')
        jitter = 0.18
        x_arr = np.array(x)
        if x_arr.size == 0:
            messagebox.showinfo("No Data", "No packet data to save as graph.")
            return
        x_jitter_pkt = x_arr + (np.random.rand(len(x_arr)) - 0.5) * jitter
        x_jitter_alert = x_arr + (np.random.rand(len(x_arr)) - 0.5) * jitter
        plt.scatter(x_jitter_pkt, y_packet, c='#88c0d0', s=50, alpha=0.75, edgecolors='w', linewidths=0.5, label='Packets', marker='o')
        plt.scatter(x_jitter_alert, y_alert, c='#bf616a', s=60, alpha=0.9, edgecolors='k', linewidths=0.4, label='Alerts', marker='s')
        plt.title("Packet & Alert Counts (Scatter - clusters)", color='#d8dee9')
        plt.xlabel("Intervals", color='#d8dee9')
        plt.ylabel("Count", color='#d8dee9')
        plt.grid(True, color='#4c566a')
        plt.tick_params(colors='#d8dee9')
        plt.legend()
        plt.tight_layout()
        plt.savefig(file_path, facecolor='#2e3440')
        plt.close()

        messagebox.showinfo("Saved", f"Graph saved as {os.path.basename(file_path)}")


if __name__ == "__main__":
    app = NetworkSnifferApp()
    app.mainloop()
