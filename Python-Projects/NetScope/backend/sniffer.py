"""
sniffer.py — Packet capture engine, fully decoupled from the UI.
Captures extended fields: src_port, dst_ip, ttl, checksum, payload preview.
"""

import time
from threading import Thread
from queue import Queue
from collections import defaultdict

from scapy.all import sniff, IP, TCP, UDP, ICMP  # type: ignore

# Whitelist of safe BPF filter expressions accepted from the API
VALID_BPF_FILTERS = {"tcp", "udp", "icmp", "ip"}


class PacketSniffer:
    def __init__(
        self,
        packet_queue: Queue,
        alert_queue: Queue,
        session_id: str,
        filter_exp: str | None = None,
        iface: str | None = None,
        time_window: int = 10,
        max_ports_scanned: int = 5,
        max_packets_flood: int = 30,
    ) -> None:
        self.packet_queue      = packet_queue
        self.alert_queue       = alert_queue
        self.session_id        = session_id
        self.time_window       = time_window
        self.max_ports_scanned = max_ports_scanned
        self.max_packets_flood = max_packets_flood

        # iface is pre-validated by the API layer (is_valid_interface check)
        # so we trust it here but still default to None (all interfaces)
        self.iface: str | None = iface or None

        # Sanitise BPF filter — whitelist only
        if filter_exp and filter_exp.strip().lower() in VALID_BPF_FILTERS:
            self.filter: str | None = filter_exp.strip().lower()
        else:
            self.filter = None

        self._connections:    defaultdict[str, set] = defaultdict(set)
        self._packet_counts:  defaultdict[str, int]  = defaultdict(int)
        self._alerted_ips:    set[str]               = set()
        self._last_cleanup:   float                  = time.time()
        self.running:         bool                   = False
        self._thread:         Thread | None          = None

    # ── Public control ─────────────────────────────────────────────── #

    def start(self) -> None:
        self.running = True
        self._thread = Thread(target=self._sniff_loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self.running = False

    def update_settings(
        self,
        filter_exp:        str | None = None,
        time_window:       int | None = None,
        max_ports_scanned: int | None = None,
        max_packets_flood: int | None = None,
    ) -> None:
        if filter_exp is not None:
            cleaned = filter_exp.strip().lower()
            self.filter = cleaned if cleaned in VALID_BPF_FILTERS else None
        if time_window is not None and time_window > 0:
            self.time_window = time_window
        if max_ports_scanned is not None and max_ports_scanned > 0:
            self.max_ports_scanned = max_ports_scanned
        if max_packets_flood is not None and max_packets_flood > 0:
            self.max_packets_flood = max_packets_flood

    # ── Internal loop ──────────────────────────────────────────────── #

    def _sniff_loop(self) -> None:
        try:
            kwargs: dict = {
                "prn":         self._packet_callback,
                "store":       0,
                "stop_filter": lambda _pkt: not self.running,
            }
            if self.filter:
                kwargs["filter"] = self.filter
            if self.iface:
                kwargs["iface"] = self.iface
            sniff(**kwargs)
        except Exception as exc:
            print(f"[NetScope/sniffer] Error: {exc}")

    def _packet_callback(self, pkt) -> None:
        if not self.running:
            return
        if IP not in pkt:
            return

        ts       = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        src_ip   = pkt[IP].src
        dst_ip   = pkt[IP].dst
        ttl      = pkt[IP].ttl
        length   = len(pkt)
        protocol = "IP"
        src_port = 0
        dst_port = 0
        flags    = ""
        checksum = 0

        if TCP in pkt:
            protocol = "TCP"
            src_port = int(pkt[TCP].sport)
            dst_port = int(pkt[TCP].dport)
            flags    = str(pkt[TCP].flags)
            checksum = int(pkt[TCP].chksum) if pkt[TCP].chksum else 0
        elif UDP in pkt:
            protocol = "UDP"
            src_port = int(pkt[UDP].sport)
            try:
                dst_port = int(pkt[UDP].dport)
            except Exception:
                dst_port = 0
            checksum = int(pkt[UDP].chksum) if pkt[UDP].chksum else 0
        elif ICMP in pkt:
            protocol = "ICMP"
            checksum = int(pkt[ICMP].chksum) if pkt[ICMP].chksum else 0

        # Grab up to 32 bytes of payload as a hex string for the detail pane
        try:
            raw_payload = bytes(pkt[IP].payload)[:32]
            payload_hex = raw_payload.hex()
        except Exception:
            payload_hex = ""

        self.packet_queue.put((
            ts, src_ip, dst_ip, src_port, dst_port,
            length, protocol, flags, ttl, checksum,
            payload_hex, self.session_id,
        ))

        # ── Anomaly detection ──────────────────────────────────────── #
        self._connections[src_ip].add(dst_port)
        self._packet_counts[src_ip] += 1

        now = time.time()
        if now - self._last_cleanup > self.time_window:
            self._connections.clear()
            self._packet_counts.clear()
            self._alerted_ips.clear()
            self._last_cleanup = now

        port_key  = src_ip
        flood_key = f"{src_ip}__flood"

        if (
            len(self._connections[src_ip]) > self.max_ports_scanned
            and port_key not in self._alerted_ips
        ):
            msg = (
                f"Port scanning detected from {src_ip} "
                f"({len(self._connections[src_ip])} ports in {self.time_window}s)"
            )
            self.alert_queue.put((ts, src_ip, "Port Scanning", msg, self.session_id))
            self._alerted_ips.add(port_key)

        if (
            self._packet_counts[src_ip] > self.max_packets_flood
            and flood_key not in self._alerted_ips
        ):
            msg = (
                f"Traffic flooding from {src_ip} "
                f"({self._packet_counts[src_ip]} packets in {self.time_window}s)"
            )
            self.alert_queue.put((ts, src_ip, "Flooding", msg, self.session_id))
            self._alerted_ips.add(flood_key)
