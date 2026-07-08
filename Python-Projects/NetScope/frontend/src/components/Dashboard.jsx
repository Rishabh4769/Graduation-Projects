import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

const API = "/api";

export default function Dashboard({
  capturing, sessionId, packetTotal, alertTotal, packets, alerts,
}) {
  const [talkers, setTalkers] = useState([]);

  // Fetch top-talkers when session changes
  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API}/sessions/${encodeURIComponent(sessionId)}/top-talkers?limit=8`)
      .then((r) => r.ok ? r.json() : [])
      .then(setTalkers)
      .catch(() => {});
  }, [sessionId, packetTotal]);  // re-fetch as packets grow

  // Protocol breakdown from in-memory live packets
  const protocolMap = {};
  for (const p of packets) {
    protocolMap[p.protocol] = (protocolMap[p.protocol] ?? 0) + 1;
  }
  const protocols  = Object.entries(protocolMap).sort((a, b) => b[1] - a[1]);
  const totalBytes = packets.reduce((s, p) => s + (p.length ?? 0), 0);

  return (
    <div className={styles.grid}>
      {/* ── Stat cards ──────────────────────────────────────────── */}
      <StatCard label="Packets" value={packetTotal.toLocaleString()}       color="blue"  icon={<IcPacket />} />
      <StatCard label="Alerts"  value={alertTotal.toLocaleString()}        color="red"   icon={<IcAlert />}  />
      <StatCard label="Bytes"   value={fmtBytes(totalBytes)}               color="teal"  icon={<IcBytes />}  />
      <StatCard
        label="Status"
        value={capturing ? "Live" : "Idle"}
        color={capturing ? "green" : "muted"}
        icon={<IcStatus live={capturing} />}
      />

      {/* ── Protocol distribution ───────────────────────────────── */}
      <div className={`${styles.card} ${styles.span2}`}>
        <div className={styles.cardHead}>Protocol Distribution</div>
        {protocols.length === 0
          ? <p className={styles.empty}>No data yet — start a capture</p>
          : (
            <div className={styles.protoList}>
              {protocols.map(([proto, count]) => {
                const pct = packetTotal ? Math.round((count / packetTotal) * 100) : 0;
                return (
                  <div key={proto} className={styles.protoRow}>
                    <span className={`${styles.protoBadge} ${styles[`proto_${proto.toLowerCase()}`]}`}>
                      {proto}
                    </span>
                    <div className={styles.barTrack}>
                      <div
                        className={`${styles.barFill} ${styles[`bar_${proto.toLowerCase()}`]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={styles.protoCount}>{count.toLocaleString()}</span>
                    <span className={styles.protoPct}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          )
        }
      </div>

      {/* ── Top Talkers ─────────────────────────────────────────── */}
      <div className={`${styles.card} ${styles.span2}`}>
        <div className={styles.cardHead}>Top Talkers</div>
        {talkers.length === 0
          ? <p className={styles.empty}>No data yet</p>
          : (
            <table className={styles.miniTable}>
              <thead><tr><th>#</th><th>Source IP</th><th>Packets</th><th>Bytes</th></tr></thead>
              <tbody>
                {talkers.map((t, i) => (
                  <tr key={t.src_ip}>
                    <td className={styles.rank}>{i + 1}</td>
                    <td className={styles.mono}>{t.src_ip}</td>
                    <td className={styles.mono}>{t.packet_count?.toLocaleString()}</td>
                    <td className={styles.mono}>{fmtBytes(t.total_bytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {/* ── Recent Packets ──────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHead}>Recent Packets</div>
        {packets.length === 0
          ? <p className={styles.empty}>Waiting for packets…</p>
          : (
            <table className={styles.miniTable}>
              <thead><tr><th>Time</th><th>Src IP</th><th>Dst Port</th><th>Proto</th></tr></thead>
              <tbody>
                {packets.slice(0, 7).map((p, i) => (
                  <tr key={i}>
                    <td className={styles.mono}>{p.timestamp?.slice(11)}</td>
                    <td className={styles.mono}>{p.src_ip}</td>
                    <td className={styles.mono}>{p.dst_port}</td>
                    <td>
                      <span className={`${styles.protoBadge} ${styles[`proto_${p.protocol?.toLowerCase()}`]}`}>
                        {p.protocol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {/* ── Recent Alerts ───────────────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHead}>Recent Alerts</div>
        {alerts.length === 0
          ? <p className={styles.empty}>No alerts generated</p>
          : (
            <table className={styles.miniTable}>
              <thead><tr><th>Time</th><th>Src IP</th><th>Type</th></tr></thead>
              <tbody>
                {alerts.slice(0, 7).map((a, i) => (
                  <tr key={i}>
                    <td className={styles.mono}>{a.timestamp?.slice(11)}</td>
                    <td className={styles.mono}>{a.src_ip}</td>
                    <td>
                      <span className={a.alert_type === "Port Scanning" ? styles.badgeDanger : styles.badgeWarn}>
                        {a.alert_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function fmtBytes(n) {
  if (!n) return "0 B";
  if (n < 1024)       return `${n} B`;
  if (n < 1024 ** 2)  return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 ** 3)  return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className={`${styles.statCard} ${styles[`accent_${color}`]}`}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function IcPacket() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IcAlert() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function IcBytes() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
}
function IcStatus({ live }) {
  return live
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>;
}
