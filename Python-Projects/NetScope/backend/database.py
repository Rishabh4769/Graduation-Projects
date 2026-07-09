"""
database.py — SQLite layer for NetScope.
All queries use parameterised statements to prevent SQL injection.
"""

import sqlite3
import datetime
import numpy as np
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "network_traffic.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS packets (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp  TEXT    NOT NULL,
                src_ip     TEXT    NOT NULL,
                dst_ip     TEXT    NOT NULL DEFAULT '',
                src_port   INTEGER NOT NULL DEFAULT 0,
                dst_port   INTEGER NOT NULL DEFAULT 0,
                length     INTEGER NOT NULL DEFAULT 0,
                protocol   TEXT    NOT NULL DEFAULT 'IP',
                flags      TEXT    NOT NULL DEFAULT '',
                ttl        INTEGER NOT NULL DEFAULT 0,
                checksum   INTEGER NOT NULL DEFAULT 0,
                payload    TEXT    NOT NULL DEFAULT '',
                session_id TEXT    NOT NULL
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp   TEXT    NOT NULL,
                src_ip      TEXT    NOT NULL,
                alert_type  TEXT    NOT NULL,
                description TEXT    NOT NULL,
                session_id  TEXT    NOT NULL
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                username     TEXT    NOT NULL UNIQUE,
                password_hash TEXT   NOT NULL,
                created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
                last_login   TEXT
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS app_logs (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp  TEXT    NOT NULL DEFAULT (datetime('now')),
                source     TEXT    NOT NULL,
                level      TEXT    NOT NULL DEFAULT 'INFO',
                category   TEXT    NOT NULL DEFAULT 'general',
                message    TEXT    NOT NULL,
                detail     TEXT    NOT NULL DEFAULT '',
                session_id TEXT    NOT NULL DEFAULT '',
                username   TEXT    NOT NULL DEFAULT ''
            )
        """)
        # Indexes for common query patterns
        c.execute("CREATE INDEX IF NOT EXISTS idx_packets_session ON packets(session_id)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_logs_source    ON app_logs(source)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_logs_level     ON app_logs(level)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_logs_ts        ON app_logs(timestamp)")
        c.execute("CREATE INDEX IF NOT EXISTS idx_alerts_session  ON alerts(session_id)")
        conn.commit()


def log_packet(data: tuple) -> None:
    """data = (timestamp, src_ip, dst_ip, src_port, dst_port, length, protocol, flags, ttl, checksum, payload, session_id)"""
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO packets (timestamp, src_ip, dst_ip, src_port, dst_port, length, protocol, flags, ttl, checksum, payload, session_id) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            data,
        )
        conn.commit()


def log_alert(data: tuple) -> None:
    """data = (timestamp, src_ip, alert_type, description, session_id)"""
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO alerts (timestamp, src_ip, alert_type, description, session_id) "
            "VALUES (?, ?, ?, ?, ?)",
            data,
        )
        conn.commit()


def get_sessions() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT session_id,
                   MIN(timestamp) AS started_at,
                   COUNT(*)       AS packet_count
            FROM packets
            GROUP BY session_id
            ORDER BY started_at DESC
        """).fetchall()
    return [dict(r) for r in rows]


def get_packets(session_id: str, limit: int = 500, offset: int = 0) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, timestamp, src_ip, dst_ip, src_port, dst_port, length, protocol, flags, ttl, checksum, payload "
            "FROM packets WHERE session_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
            (session_id, limit, offset),
        ).fetchall()
    return [dict(r) for r in rows]


def search_packets(
    session_id: str,
    protocol: str | None = None,
    src_ip: str | None = None,
    dst_ip: str | None = None,
    src_port: int | None = None,
    dst_port: int | None = None,
    flags: str | None = None,
    limit: int = 500,
) -> list[dict]:
    """
    Multi-field search — all params are AND-ed together.
    Empty/None params are ignored (Wireshark-style behavior).
    """
    clauses = ["session_id = ?"]
    params  = [session_id]

    if protocol:
        clauses.append("LOWER(protocol) = LOWER(?)")
        params.append(protocol)
    if src_ip:
        clauses.append("src_ip LIKE ?")
        params.append(f"%{src_ip}%")
    if dst_ip:
        clauses.append("dst_ip LIKE ?")
        params.append(f"%{dst_ip}%")
    if src_port is not None:
        clauses.append("src_port = ?")
        params.append(src_port)
    if dst_port is not None:
        clauses.append("dst_port = ?")
        params.append(dst_port)
    if flags:
        clauses.append("flags LIKE ?")
        params.append(f"%{flags}%")

    sql = (
        "SELECT id, timestamp, src_ip, dst_ip, src_port, dst_port, length, protocol, flags, ttl, checksum, payload "
        "FROM packets WHERE " + " AND ".join(clauses) + " ORDER BY id DESC LIMIT ?"
    )
    params.append(limit)

    with get_connection() as conn:
        rows = conn.execute(sql, params).fetchall()
    return [dict(r) for r in rows]


def get_alerts(session_id: str, limit: int = 200, offset: int = 0) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT timestamp, src_ip, alert_type, description "
            "FROM alerts WHERE session_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
            (session_id, limit, offset),
        ).fetchall()
    return [dict(r) for r in rows]


def get_port_usage(session_id: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT dst_port, protocol, COUNT(*) AS count "
            "FROM packets WHERE session_id = ? "
            "GROUP BY dst_port, protocol ORDER BY count DESC LIMIT 50",
            (session_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def get_top_talkers(session_id: str, limit: int = 10) -> list[dict]:
    """Return top source IPs by packet count and total bytes."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT src_ip, COUNT(*) AS packet_count, SUM(length) AS total_bytes "
            "FROM packets WHERE session_id = ? "
            "GROUP BY src_ip ORDER BY packet_count DESC LIMIT ?",
            (session_id, limit),
        ).fetchall()
    return [dict(r) for r in rows]


def get_graph_data(session_id: str) -> dict:
    with get_connection() as conn:
        pkt_rows = conn.execute(
            "SELECT timestamp FROM packets WHERE session_id = ? ORDER BY timestamp",
            (session_id,),
        ).fetchall()
        alert_rows = conn.execute(
            "SELECT timestamp FROM alerts WHERE session_id = ? ORDER BY timestamp",
            (session_id,),
        ).fetchall()

    def to_epoch(ts: str) -> float | None:
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S"):
            try:
                return datetime.datetime.strptime(ts, fmt).timestamp()
            except ValueError:
                continue
        return None

    pkt_times   = [t for t in (to_epoch(r["timestamp"]) for r in pkt_rows)   if t is not None]
    alert_times = [t for t in (to_epoch(r["timestamp"]) for r in alert_rows) if t is not None]

    if not pkt_times and not alert_times:
        return {"labels": [], "packets": [], "alerts": []}

    all_times = pkt_times + alert_times
    min_ts, max_ts = min(all_times), max(all_times)
    duration = max_ts - min_ts
    buckets = 1 if duration == 0 else min(60, max(5, int(duration) + 1))
    edges = np.linspace(min_ts, max_ts + 1, buckets + 1)

    pkt_counts   = np.histogram(pkt_times,   bins=edges)[0] if pkt_times   else np.zeros(buckets, dtype=int)
    alert_counts = np.histogram(alert_times, bins=edges)[0] if alert_times else np.zeros(buckets, dtype=int)

    labels = [
        datetime.datetime.fromtimestamp(edges[i]).strftime("%H:%M:%S")
        for i in range(buckets)
    ]

    return {
        "labels":  labels,
        "packets": pkt_counts.tolist(),
        "alerts":  alert_counts.tolist(),
    }


def get_session_summary(session_id: str) -> dict:
    with get_connection() as conn:
        pkt_count = conn.execute(
            "SELECT COUNT(*) FROM packets WHERE session_id = ?", (session_id,)
        ).fetchone()[0]
        alert_count = conn.execute(
            "SELECT COUNT(*) FROM alerts WHERE session_id = ?", (session_id,)
        ).fetchone()[0]
        started = conn.execute(
            "SELECT MIN(timestamp) FROM packets WHERE session_id = ?", (session_id,)
        ).fetchone()[0]
    return {
        "session_id":   session_id,
        "packet_count": pkt_count,
        "alert_count":  alert_count,
        "started_at":   started,
    }


# ── User management ───────────────────────────────────────────────────── #

def create_user(username: str, password_hash: str) -> bool:
    """
    Insert a new user. Returns True on success, False if username already exists.
    password_hash must be a bcrypt hash — never store plaintext.
    """
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                (username, password_hash),
            )
            conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False


def get_user(username: str) -> dict | None:
    """Return the user row or None if not found."""
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, username, password_hash, created_at, last_login "
            "FROM users WHERE username = ?",
            (username,),
        ).fetchone()
    return dict(row) if row else None


def update_last_login(username: str) -> None:
    with get_connection() as conn:
        conn.execute(
            "UPDATE users SET last_login = datetime('now') WHERE username = ?",
            (username,),
        )
        conn.commit()


def list_users() -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, username, created_at, last_login FROM users ORDER BY id"
        ).fetchall()
    return [dict(r) for r in rows]


def user_count() -> int:
    with get_connection() as conn:
        return conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]


# ── App log functions ─────────────────────────────────────────────────── #

def write_log(
    source: str,
    level: str,
    category: str,
    message: str,
    detail: str = "",
    session_id: str = "",
    username: str = "",
) -> None:
    """
    Persist a log entry to app_logs.
    source   : 'backend' | 'frontend'
    level    : 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'
    category : 'auth' | 'capture' | 'sniffer' | 'api' | 'ui' | 'general'
    """
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO app_logs (source, level, category, message, detail, session_id, username) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (source, level.upper(), category, message, detail, session_id, username),
        )
        conn.commit()


def get_logs(
    source: str | None = None,
    level: str | None = None,
    category: str | None = None,
    session_id: str | None = None,
    limit: int = 200,
    offset: int = 0,
) -> list[dict]:
    clauses = []
    params: list = []

    if source:
        clauses.append("source = ?")
        params.append(source.lower())
    if level:
        clauses.append("UPPER(level) = UPPER(?)")
        params.append(level)
    if category:
        clauses.append("category = ?")
        params.append(category.lower())
    if session_id:
        clauses.append("session_id = ?")
        params.append(session_id)

    where = ("WHERE " + " AND ".join(clauses)) if clauses else ""
    sql = (
        f"SELECT id, timestamp, source, level, category, message, detail, session_id, username "
        f"FROM app_logs {where} ORDER BY id DESC LIMIT ? OFFSET ?"
    )
    params += [limit, offset]

    with get_connection() as conn:
        rows = conn.execute(sql, params).fetchall()
    return [dict(r) for r in rows]


def get_log_stats() -> dict:
    """Return counts grouped by source and level for the summary cards."""
    with get_connection() as conn:
        by_source = conn.execute(
            "SELECT source, COUNT(*) AS cnt FROM app_logs GROUP BY source"
        ).fetchall()
        by_level = conn.execute(
            "SELECT level, COUNT(*) AS cnt FROM app_logs GROUP BY level"
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) FROM app_logs").fetchone()[0]
    return {
        "total": total,
        "by_source": {r["source"]: r["cnt"] for r in by_source},
        "by_level":  {r["level"]:  r["cnt"] for r in by_level},
    }
