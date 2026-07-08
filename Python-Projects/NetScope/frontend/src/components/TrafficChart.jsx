/**
 * TrafficChart — per-session traffic graph.
 *
 * - Fetches graph data for the explicit `sessionId` prop every time it changes.
 * - While `capturing` is true (live session), refreshes every 5 seconds.
 * - Chart colours adapt to the active theme via CSS vars read at render time.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";
import styles from "./TrafficChart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const POLL_INTERVAL_MS = 5000;

export default function TrafficChart({ sessionId, capturing }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const { theme } = useTheme();

  // Keep a ref to the interval so we can clear it properly
  const intervalRef = useRef(null);

  async function fetchGraph(sid, silent = false) {
    if (!sid) return;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/sessions/${encodeURIComponent(sid)}/graph`);
      if (!res.ok) throw new Error("Failed to fetch graph data");
      const json = await res.json();
      setData(json);
    } catch (e) {
      if (!silent) setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // Re-fetch whenever the displayed session changes
  useEffect(() => {
    if (!sessionId) { setData(null); return; }
    fetchGraph(sessionId);
  }, [sessionId]);

  // Poll while the live session is active
  useEffect(() => {
    if (capturing && sessionId) {
      intervalRef.current = setInterval(() => fetchGraph(sessionId, true), POLL_INTERVAL_MS);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [capturing, sessionId]);

  // Derive chart colours from the current theme
  const isDark      = theme === "dark";
  const gridColor   = isDark ? "#1C2333" : "#E8ECF0";
  const tickColor   = isDark ? "#484F58" : "#9EA7B3";
  const tooltipBg   = isDark ? "#1C2333" : "#FFFFFF";
  const tooltipText = isDark ? "#E6EDF3" : "#1F2328";
  const tooltipBdr  = isDark ? "#2A3347" : "#D0D7DE";
  const legendColor = isDark ? "#8B949E" : "#57606A";

  // ── Empty / loading states ──────────────────────────────────────────── #
  if (!sessionId) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Traffic Graph</span>
        </div>
        <div className={styles.empty}>
          Select a session to view its traffic graph, or start a capture.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <ChartHeader sessionId={sessionId} capturing={capturing} />
        <div className={styles.empty}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ChartHeader sessionId={sessionId} capturing={capturing} />
        <div className={styles.errorMsg}>{error}</div>
      </div>
    );
  }

  if (!data || data.labels.length === 0) {
    return (
      <div className={styles.container}>
        <ChartHeader sessionId={sessionId} capturing={capturing} />
        <div className={styles.empty}>
          No packet data yet for this session.
          {capturing && " Waiting for packets…"}
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label:           "Packets / interval",
        data:            data.packets,
        borderColor:     "#2F81F7",
        backgroundColor: "rgba(47,129,247,0.1)",
        fill:            true,
        tension:         0.4,
        pointRadius:     3,
        pointHoverRadius:5,
        borderWidth:     2,
      },
      {
        label:           "Alerts / interval",
        data:            data.alerts,
        borderColor:     "#DA3633",
        backgroundColor: "rgba(218,54,51,0.1)",
        fill:            true,
        tension:         0.4,
        pointRadius:     4,
        pointHoverRadius:6,
        borderWidth:     2,
        pointStyle:      "rect",
      },
    ],
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    animation:           { duration: 300 },
    interaction:         { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: { color: legendColor, font: { size: 12 }, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor:      tooltipText,
        bodyColor:       tickColor,
        borderColor:     tooltipBdr,
        borderWidth:     1,
      },
    },
    scales: {
      x: {
        ticks:  { color: tickColor, font: { size: 11 }, maxTicksLimit: 12 },
        grid:   { color: gridColor },
        border: { color: tooltipBdr },
      },
      y: {
        beginAtZero: true,
        ticks:  { color: tickColor, font: { size: 11 } },
        grid:   { color: gridColor },
        border: { color: tooltipBdr },
      },
    },
  };

  return (
    <div className={styles.container}>
      <ChartHeader sessionId={sessionId} capturing={capturing} />
      <div className={styles.chart}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

function ChartHeader({ sessionId, capturing }) {
  return (
    <div className={styles.header}>
      <span className={styles.title}>Traffic Graph</span>
      <div className={styles.headerRight}>
        <code className={styles.sessionCode}>{sessionId}</code>
        {capturing && (
          <span className={styles.livePill}>
            <span className={styles.liveDot} />
            Live · refreshing
          </span>
        )}
      </div>
    </div>
  );
}
