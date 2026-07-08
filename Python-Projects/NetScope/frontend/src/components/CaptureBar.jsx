import React, { useState } from "react";
import styles from "./CaptureBar.module.css";

const FILTERS = [
  { value: null,   label: "All traffic" },
  { value: "tcp",  label: "TCP only"    },
  { value: "udp",  label: "UDP only"    },
  { value: "icmp", label: "ICMP only"   },
  { value: "ip",   label: "IP only"     },
];

export default function CaptureBar({
  capturing, sessionId, packetTotal, alertTotal,
  settings, onStart, onStop, onApplySettings, onClearLogs, onExportPdf,
}) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [settingsOpen,  setSettingsOpen]  = useState(false);

  function handleStart() { onStart(localSettings); }

  function handleApply(e) {
    e.preventDefault();
    onApplySettings(localSettings);
    setSettingsOpen(false);
  }

  function set(key, value) {
    setLocalSettings((p) => ({ ...p, [key]: value }));
  }

  return (
    <header className={styles.bar}>
      <div className={styles.row}>
        {/* Left: action buttons */}
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.primary}`}
            onClick={handleStart}
            disabled={capturing}
            aria-label="Start capture"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><polygon points="2,1 11,6 2,11"/></svg>
            Start
          </button>
          <button
            className={`${styles.btn} ${styles.danger}`}
            onClick={onStop}
            disabled={!capturing}
            aria-label="Stop capture"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect width="10" height="10" rx="1"/></svg>
            Stop
          </button>

          <div className={styles.sep} />

          <button
            className={`${styles.btn} ${styles.ghost} ${settingsOpen ? styles.ghostActive : ""}`}
            onClick={() => setSettingsOpen((v) => !v)}
            aria-expanded={settingsOpen}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Detection
          </button>

          <button className={`${styles.btn} ${styles.ghost}`} onClick={onClearLogs}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Clear
          </button>

          {sessionId && (
            <button className={`${styles.btn} ${styles.ghost}`} onClick={onExportPdf}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export PDF
            </button>
          )}
        </div>

        {/* Right: live stats */}
        <div className={styles.stats}>
          <Stat icon="📦" label="Packets" value={packetTotal} color="blue" />
          <Stat icon="⚑"  label="Alerts"  value={alertTotal}  color="red"  />
          {sessionId && (
            <code className={styles.sessionId} title="Active session">{sessionId}</code>
          )}
          <span className={`${styles.statusDot} ${capturing ? styles.dotLive : styles.dotIdle}`} />
          <span className={styles.statusLabel}>{capturing ? "Live" : "Idle"}</span>
        </div>
      </div>

      {/* Detection settings panel */}
      {settingsOpen && (
        <form className={styles.panel} onSubmit={handleApply}>
          <div className={styles.panelGrid}>
            <FormField label="Capture Filter">
              <select
                value={localSettings.filter ?? ""}
                onChange={(e) => set("filter", e.target.value || null)}
              >
                {FILTERS.map((f) => (
                  <option key={f.label} value={f.value ?? ""}>{f.label}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Time Window (s)">
              <input type="number" min="1" max="3600" value={localSettings.time_window}
                onChange={(e) => set("time_window", Number(e.target.value))} />
            </FormField>
            <FormField label="Port Scan Threshold">
              <input type="number" min="1" max="65535" value={localSettings.max_ports_scanned}
                onChange={(e) => set("max_ports_scanned", Number(e.target.value))} />
            </FormField>
            <FormField label="Flood Threshold (pkts)">
              <input type="number" min="1" max="1000000" value={localSettings.max_packets_flood}
                onChange={(e) => set("max_packets_flood", Number(e.target.value))} />
            </FormField>
          </div>
          <div className={styles.panelActions}>
            <button type="submit" className={`${styles.btn} ${styles.primary}`}>Apply</button>
            <button type="button" className={`${styles.btn} ${styles.ghost}`}
              onClick={() => setSettingsOpen(false)}>Cancel</button>
          </div>
        </form>
      )}
    </header>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className={`${styles.stat} ${styles[`stat_${color}`]}`}>
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className={styles.formField}>
      <span>{label}</span>
      {children}
    </label>
  );
}
