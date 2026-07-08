import React, { useMemo, useState, useCallback } from "react";
import FilterBar    from "./FilterBar";
import PacketDetail from "./PacketDetail";
import styles from "./PacketTable.module.css";

const API = "/api";

// Known port → service name map (common ones)
const PORT_NAMES = {
  20: "FTP-data", 21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
  53: "DNS", 67: "DHCP", 68: "DHCP", 80: "HTTP", 110: "POP3",
  123: "NTP", 143: "IMAP", 161: "SNMP", 194: "IRC", 443: "HTTPS",
  445: "SMB", 465: "SMTPS", 587: "SMTP", 993: "IMAPS", 995: "POP3S",
  1080: "SOCKS", 1433: "MSSQL", 1521: "Oracle", 3306: "MySQL",
  3389: "RDP", 5432: "PostgreSQL", 5900: "VNC", 6379: "Redis",
  8080: "HTTP-alt", 8443: "HTTPS-alt", 27017: "MongoDB",
};

function portLabel(port) {
  return PORT_NAMES[port] ? `${port} (${PORT_NAMES[port]})` : String(port);
}

export default function PacketTable({ packets, sessionId }) {
  const [filter,        setFilter]        = useState({ protocol: null, src_ip: null, dst_ip: null, src_port: null, dst_port: null, flags: null });
  const [selected,      setSelected]      = useState(null);
  const [searchResults, setSearchResults] = useState(null);  // null = live mode
  const [searching,     setSearching]     = useState(false);

  // Client-side filter applied to live packets
  const filteredPackets = useMemo(() => {
    const src = searchResults ?? packets;
    return src.filter((p) => {
      if (filter.protocol && p.protocol?.toUpperCase() !== filter.protocol.toUpperCase()) return false;
      if (filter.src_ip   && !p.src_ip?.includes(filter.src_ip))   return false;
      if (filter.dst_ip   && !p.dst_ip?.includes(filter.dst_ip))   return false;
      if (filter.src_port != null && p.src_port !== filter.src_port) return false;
      if (filter.dst_port != null && p.dst_port !== filter.dst_port) return false;
      if (filter.flags    && !p.flags?.includes(filter.flags))     return false;
      return true;
    });
  }, [packets, searchResults, filter]);

  const handleSearch = useCallback(async (f) => {
    if (!sessionId) return;
    setSearching(true);
    try {
      const params = new URLSearchParams();
      if (f.protocol) params.set("protocol", f.protocol);
      if (f.src_ip)   params.set("src_ip",   f.src_ip);
      if (f.dst_ip)   params.set("dst_ip",   f.dst_ip);
      if (f.src_port != null) params.set("src_port", f.src_port);
      if (f.dst_port != null) params.set("dst_port", f.dst_port);
      if (f.flags)    params.set("flags",    f.flags);
      params.set("limit", "1000");
      const res = await fetch(`${API}/sessions/${encodeURIComponent(sessionId)}/packets/search?${params}`);
      if (!res.ok) throw new Error("Search failed");
      setSearchResults(await res.json());
    } catch {
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  }, [sessionId]);

  function handleFilterChange(f) {
    setFilter(f);
    // Reset DB search results when filter changes in live mode
    if (searchResults) setSearchResults(null);
  }

  const isSearchMode = !!sessionId;
  const rows = filteredPackets;

  return (
    <div className={styles.wrapper}>
      <FilterBar
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        sessionId={sessionId}
        isSearchMode={isSearchMode}
      />

      <div className={styles.tablePane}>
        {/* Table */}
        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <span className={styles.tableTitle}>
              {searchResults ? `Search Results` : "Captured Packets"}
            </span>
            <span className={styles.tableCount}>
              {searching ? "Searching…" : `${rows.length.toLocaleString()} rows`}
            </span>
            {searchResults && (
              <button className={styles.liveBtn} onClick={() => setSearchResults(null)}>
                Back to Live
              </button>
            )}
          </div>

          <div className={styles.scrollArea}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "140px" }}>Time</th>
                  <th style={{ width: "130px" }}>Src IP</th>
                  <th style={{ width: "55px"  }}>SPort</th>
                  <th style={{ width: "130px" }}>Dst IP</th>
                  <th style={{ width: "120px" }}>DPort</th>
                  <th style={{ width: "62px"  }}>Proto</th>
                  <th style={{ width: "70px"  }}>Length</th>
                  <th style={{ width: "70px"  }}>TTL</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.empty}>
                      {searching ? "Searching…" : "No packets match the current filter"}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <PacketRow
                      key={row.id ?? i}
                      row={row}
                      selected={selected?.id === row.id || (selected === row)}
                      onClick={() => setSelected(selected === row ? null : row)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail pane */}
        {selected && (
          <PacketDetail packet={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

const PROTO_ROW_CLASS = {
  TCP:  styles.protoTcp,
  UDP:  styles.protoUdp,
  ICMP: styles.protoIcmp,
  IP:   styles.protoIp,
};

function PacketRow({ row, selected, onClick }) {
  return (
    <tr
      className={`${styles.row} ${PROTO_ROW_CLASS[row.protocol] ?? ""} ${selected ? styles.rowSelected : ""}`}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-selected={selected}
    >
      <td className={styles.mono}>{row.timestamp}</td>
      <td className={styles.mono}>{row.src_ip}</td>
      <td className={styles.mono}>{row.src_port || "—"}</td>
      <td className={styles.mono}>{row.dst_ip || "—"}</td>
      <td className={styles.mono}>{portLabel(row.dst_port)}</td>
      <td>
        <span className={`${styles.protoTag} ${PROTO_ROW_CLASS[row.protocol] ?? styles.protoIp}`}>
          {row.protocol}
        </span>
      </td>
      <td className={styles.mono}>{row.length} B</td>
      <td className={styles.mono}>{row.ttl ?? "—"}</td>
      <td className={styles.mono}>{row.flags || "—"}</td>
    </tr>
  );
}
