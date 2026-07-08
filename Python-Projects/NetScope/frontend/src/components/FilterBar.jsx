/**
 * FilterBar — Wireshark-style filter bar with:
 *  - Quick protocol chips (All / TCP / UDP / ICMP / IP)
 *  - Field-specific inputs: src_ip, dst_ip, src_port, dst_port, flags
 *  - Applies filters either client-side (live mode) or via API search (history mode)
 */
import React, { useState } from "react";
import styles from "./FilterBar.module.css";

const PROTO_CHIPS = ["All", "TCP", "UDP", "ICMP", "IP"];
const TCP_FLAG_CHIPS = [
  { label: "SYN",     value: "S"  },
  { label: "ACK",     value: "A"  },
  { label: "FIN",     value: "F"  },
  { label: "RST",     value: "R"  },
  { label: "PSH",     value: "P"  },
  { label: "URG",     value: "U"  },
];

export default function FilterBar({ onFilterChange, onSearch, sessionId, isSearchMode }) {
  const [proto,    setProto]    = useState("All");
  const [srcIp,    setSrcIp]    = useState("");
  const [dstIp,    setDstIp]    = useState("");
  const [srcPort,  setSrcPort]  = useState("");
  const [dstPort,  setDstPort]  = useState("");
  const [flagChip, setFlagChip] = useState("");
  const [advanced, setAdvanced] = useState(false);

  function buildFilter() {
    return {
      protocol: proto === "All" ? null : proto,
      src_ip:   srcIp.trim()   || null,
      dst_ip:   dstIp.trim()   || null,
      src_port: srcPort ? parseInt(srcPort, 10) : null,
      dst_port: dstPort ? parseInt(dstPort, 10) : null,
      flags:    flagChip || null,
    };
  }

  function handleProto(p) {
    const next = p === proto ? "All" : p;
    setProto(next);
    const f = buildFilter();
    f.protocol = next === "All" ? null : next;
    onFilterChange(f);
  }

  function handleFlagChip(v) {
    const next = v === flagChip ? "" : v;
    setFlagChip(next);
    const f = buildFilter();
    f.flags = next || null;
    onFilterChange(f);
  }

  function handleInput(setter, field, val) {
    setter(val);
    const f = buildFilter();
    f[field] = val.trim() || null;
    if (field === "src_port" || field === "dst_port") {
      f[field] = val ? parseInt(val, 10) : null;
    }
    onFilterChange(f);
  }

  function handleSearch() {
    if (onSearch && sessionId) {
      onSearch(buildFilter());
    }
  }

  function handleClear() {
    setProto("All"); setSrcIp(""); setDstIp("");
    setSrcPort(""); setDstPort(""); setFlagChip("");
    onFilterChange({ protocol: null, src_ip: null, dst_ip: null, src_port: null, dst_port: null, flags: null });
  }

  const hasFilter = proto !== "All" || srcIp || dstIp || srcPort || dstPort || flagChip;

  return (
    <div className={styles.bar}>
      {/* Protocol chips */}
      <div className={styles.protoChips}>
        {PROTO_CHIPS.map((p) => (
          <button
            key={p}
            className={`${styles.protoChip} ${proto === p ? styles.protoChipActive : ""} ${styles[`proto_${p.toLowerCase()}`]}`}
            onClick={() => handleProto(p)}
            aria-pressed={proto === p}
          >
            {p}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Quick fields */}
      <div className={styles.fields}>
        <FilterField
          label="Src IP"
          placeholder="e.g. 192.168."
          value={srcIp}
          onChange={(v) => handleInput(setSrcIp, "src_ip", v)}
        />
        <FilterField
          label="Dst IP"
          placeholder="e.g. 8.8.8.8"
          value={dstIp}
          onChange={(v) => handleInput(setDstIp, "dst_ip", v)}
        />
        <FilterField
          label="Src Port"
          placeholder="e.g. 443"
          value={srcPort}
          type="number"
          onChange={(v) => handleInput(setSrcPort, "src_port", v)}
          width="90px"
        />
        <FilterField
          label="Dst Port"
          placeholder="e.g. 80"
          value={dstPort}
          type="number"
          onChange={(v) => handleInput(setDstPort, "dst_port", v)}
          width="90px"
        />
      </div>

      {/* TCP flag chips */}
      <div className={styles.divider} />
      <div className={styles.flagChips}>
        <span className={styles.flagLabel}>Flags</span>
        {TCP_FLAG_CHIPS.map((f) => (
          <button
            key={f.value}
            className={`${styles.flagChip} ${flagChip === f.value ? styles.flagChipActive : ""}`}
            onClick={() => handleFlagChip(f.value)}
            aria-pressed={flagChip === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        {hasFilter && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear all filters">
            ✕ Clear
          </button>
        )}
        {isSearchMode && sessionId && (
          <button className={styles.searchBtn} onClick={handleSearch}>
            Search DB
          </button>
        )}
      </div>
    </div>
  );
}

function FilterField({ label, placeholder, value, onChange, type = "text", width = "130px" }) {
  return (
    <label className={styles.fieldWrap} style={{ width }}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        className={styles.fieldInput}
        type={type}
        placeholder={placeholder}
        value={value}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 65535 : undefined}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </label>
  );
}
