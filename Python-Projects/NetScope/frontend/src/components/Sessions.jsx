import React, { useEffect, useState } from "react";
import { api } from "../api";
import styles from "./Sessions.module.css";

export default function Sessions({ onViewGraph }) {
  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [selected,  setSelected]  = useState(null);
  const [summary,   setSummary]   = useState(null);
  const [sumLoading,setSumLoading]= useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get("/sessions")
      .then((r) => r.ok ? r.json() : Promise.reject("Failed to load"))
      .then((d) => { if (!cancelled) setSessions(d); })
      .catch((e) => { if (!cancelled) setError(String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSelect(sessionId) {
    setSelected(sessionId);
    setSummary(null);
    setSumLoading(true);
    try {
      const res = await api.get(`/sessions/${encodeURIComponent(sessionId)}/summary`);
      if (res.ok) setSummary(await res.json());
    } catch { /* ignore */ }
    finally { setSumLoading(false); }
  }

  async function handleDownloadPdf(sessionId, e) {
    e.stopPropagation();
    try {
      const res = await api.get(`/sessions/${encodeURIComponent(sessionId)}/report`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `netscope_${sessionId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <div className={styles.empty}>Loading sessions…</div>;
  if (error)   return <div className={styles.errorMsg}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      {/* ── Session list ─────────────────────────────────────────── */}
      <div className={styles.list}>
        <div className={styles.listHeader}>
          <span className={styles.listTitle}>Sessions</span>
          <span className={styles.listCount}>{sessions.length} stored</span>
        </div>

        {sessions.length === 0 ? (
          <div className={styles.empty}>No sessions yet. Start a capture to create one.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Started At</th>
                <th>Packets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.session_id}
                  className={`${styles.row} ${selected === s.session_id ? styles.rowActive : ""}`}
                  onClick={() => handleSelect(s.session_id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(s.session_id)}
                  aria-selected={selected === s.session_id}
                >
                  <td className={styles.mono}>{s.session_id}</td>
                  <td className={styles.mono}>{s.started_at ?? "—"}</td>
                  <td className={styles.mono}>{s.packet_count?.toLocaleString()}</td>
                  <td>
                    <button
                      className={styles.btnPdf}
                      onClick={(e) => handleDownloadPdf(s.session_id, e)}
                      aria-label={`Download PDF for ${s.session_id}`}
                    >
                      ↓ PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Session detail panel ─────────────────────────────────── */}
      {selected && (
        <div className={styles.detail}>
          <div className={styles.detailHeader}>
            <span className={styles.detailTitle}>Session Detail</span>
            <code className={styles.detailId}>{selected}</code>
          </div>

          {sumLoading ? (
            <div className={styles.detailEmpty}>Loading…</div>
          ) : summary ? (
            <>
              <div className={styles.statRow}>
                <StatBox label="Packets" value={summary.packet_count?.toLocaleString()} color="blue" />
                <StatBox label="Alerts"  value={summary.alert_count?.toLocaleString()}  color="red"  />
                <StatBox label="Started" value={summary.started_at?.slice(0,16) ?? "—"} color="muted" mono />
              </div>

              <div className={styles.detailActions}>
                <button
                  className={styles.viewGraphBtn}
                  onClick={() => onViewGraph(selected)}
                >
                  View Traffic Graph →
                </button>
                <button
                  className={styles.pdfBtn}
                  onClick={(e) => handleDownloadPdf(selected, e)}
                >
                  ↓ Download PDF Report
                </button>
              </div>
            </>
          ) : (
            <div className={styles.detailEmpty}>Could not load session details.</div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color, mono }) {
  return (
    <div className={`${styles.statBox} ${styles[`statBox_${color}`]}`}>
      <div className={styles.statVal} style={mono ? { fontFamily: "var(--font-mono)", fontSize: "12px" } : {}}>
        {value}
      </div>
      <div className={styles.statLbl}>{label}</div>
    </div>
  );
}
