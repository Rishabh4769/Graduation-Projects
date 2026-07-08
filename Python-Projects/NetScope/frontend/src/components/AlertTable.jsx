import React, { useMemo, useState } from "react";
import styles from "./DataTable.module.css";

export default function AlertTable({ alerts }) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!q.trim()) return alerts;
    const lq = q.trim().toLowerCase();
    return alerts.filter(
      (a) =>
        a.src_ip?.toLowerCase().includes(lq) ||
        a.alert_type?.toLowerCase().includes(lq) ||
        a.description?.toLowerCase().includes(lq)
    );
  }, [alerts, q]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.title}>Alerts</span>
        <input
          className={styles.search}
          type="search"
          placeholder="Filter by IP, type, description…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter alerts"
        />
        <span className={styles.count}>{rows.length.toLocaleString()} rows</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Source IP</th>
              <th>Alert Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} className={styles.empty}>No alerts generated</td></tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className={styles.row}>
                  <td className={styles.mono}>{row.timestamp}</td>
                  <td className={styles.mono}>{row.src_ip}</td>
                  <td>
                    <span className={`${styles.tag} ${row.alert_type === "Port Scanning" ? styles.tagDanger : styles.tagWarning}`}>
                      {row.alert_type}
                    </span>
                  </td>
                  <td className={styles.desc}>{row.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
