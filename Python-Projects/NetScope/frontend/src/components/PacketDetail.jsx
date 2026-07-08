/**
 * PacketDetail — Wireshark-style bottom pane.
 * Shows a structured breakdown of all packet fields + hex payload.
 */
import React, { useState } from "react";
import styles from "./PacketDetail.module.css";

export default function PacketDetail({ packet, onClose }) {
  const [section, setSection] = useState("all");

  if (!packet) return null;

  const ipSection = [
    { key: "Source IP",      value: packet.src_ip },
    { key: "Destination IP", value: packet.dst_ip || "—" },
    { key: "Protocol",       value: packet.protocol },
    { key: "TTL",            value: packet.ttl ?? "—" },
    { key: "Total Length",   value: `${packet.length} bytes` },
  ];

  const transportSection = [];
  if (packet.protocol === "TCP" || packet.protocol === "UDP") {
    transportSection.push({ key: "Source Port",      value: packet.src_port || "—" });
    transportSection.push({ key: "Destination Port", value: packet.dst_port || "—" });
    transportSection.push({ key: "Checksum",         value: packet.checksum ? `0x${packet.checksum.toString(16).toUpperCase()}` : "—" });
  }
  if (packet.protocol === "TCP") {
    transportSection.push({ key: "Flags", value: packet.flags || "—" });
    // Decode individual TCP flags
    const flags = packet.flags ?? "";
    const decoded = [
      flags.includes("S") && "SYN",
      flags.includes("A") && "ACK",
      flags.includes("F") && "FIN",
      flags.includes("R") && "RST",
      flags.includes("P") && "PSH",
      flags.includes("U") && "URG",
    ].filter(Boolean);
    if (decoded.length) {
      transportSection.push({ key: "Flag Details", value: decoded.join("  ") });
    }
  }

  // Format hex payload into Wireshark-style rows: offset  hex  ascii
  function formatHex(hexStr) {
    if (!hexStr) return [];
    const bytes = hexStr.match(/.{1,2}/g) ?? [];
    const rows = [];
    for (let i = 0; i < bytes.length; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const hex   = chunk.map((b) => b.toUpperCase().padStart(2, "0")).join(" ");
      const ascii = chunk.map((b) => {
        const c = parseInt(b, 16);
        return c >= 32 && c < 127 ? String.fromCharCode(c) : ".";
      }).join("");
      rows.push({ offset: i.toString(16).padStart(4, "0"), hex, ascii });
    }
    return rows;
  }

  const hexRows = formatHex(packet.payload);

  return (
    <div className={styles.pane} role="region" aria-label="Packet detail">
      <div className={styles.header}>
        <span className={styles.headerTitle}>Packet Detail</span>
        <div className={styles.tabs}>
          {["all", "ip", "transport", "payload"].map((t) => (
            <button
              key={t}
              className={`${styles.tab} ${section === t ? styles.tabActive : ""}`}
              onClick={() => setSection(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close packet detail">✕</button>
      </div>

      <div className={styles.body}>
        {(section === "all" || section === "ip") && (
          <FieldSection title="Internet Protocol (IP)" fields={ipSection} />
        )}
        {(section === "all" || section === "transport") && transportSection.length > 0 && (
          <FieldSection title={`${packet.protocol} Header`} fields={transportSection} />
        )}
        {(section === "all" || section === "payload") && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Payload Preview ({hexRows.length * 16} bytes shown)</div>
            {hexRows.length === 0 ? (
              <span className={styles.emptyPayload}>No payload data captured</span>
            ) : (
              <div className={styles.hexDump}>
                <div className={styles.hexHeader}>
                  <span>Offset</span>
                  <span>Hex</span>
                  <span>ASCII</span>
                </div>
                {hexRows.map((r) => (
                  <div key={r.offset} className={styles.hexRow}>
                    <span className={styles.hexOffset}>{r.offset}</span>
                    <span className={styles.hexBytes}>{r.hex}</span>
                    <span className={styles.hexAscii}>{r.ascii}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FieldSection({ title, fields }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <div className={styles.fieldGrid}>
        {fields.map((f) => (
          <div key={f.key} className={styles.fieldRow}>
            <span className={styles.fieldKey}>{f.key}</span>
            <span className={styles.fieldVal}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
