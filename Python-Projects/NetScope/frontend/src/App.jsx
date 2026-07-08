import React, { useState, useCallback } from "react";
import { useAuth }      from "./context/AuthContext";
import Sidebar          from "./components/Sidebar";
import CaptureBar       from "./components/CaptureBar";
import Dashboard        from "./components/Dashboard";
import PacketTable      from "./components/PacketTable";
import AlertTable       from "./components/AlertTable";
import TrafficChart     from "./components/TrafficChart";
import Sessions         from "./components/Sessions";
import LoginPage        from "./pages/LoginPage";
import { useCapture }   from "./hooks/useCapture";
import { api }          from "./api";
import styles           from "./App.module.css";

export default function App() {
  const { user, checked, logout } = useAuth();
  const [activeTab,      setActiveTab]      = useState("dashboard");
  // graphSessionId: the session currently shown in the graph tab.
  // Starts as the live session; can be overridden by clicking a past session.
  const [graphSessionId, setGraphSessionId] = useState("");

  const {
    capturing, sessionId, iface, packetTotal, alertTotal,
    packets, alerts, error, settings, interfaces,
    startCapture, stopCapture, applySettings, clearLogs,
  } = useCapture();

  // Keep graph session in sync with live session unless user picked another one
  React.useEffect(() => {
    if (sessionId && graphSessionId === "") setGraphSessionId(sessionId);
    // When a new capture starts, switch back to the new live session
    if (capturing && sessionId) setGraphSessionId(sessionId);
  }, [sessionId, capturing]);

  const handleExportPdf = useCallback(async () => {
    if (!sessionId) return;
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
  }, [sessionId]);

  // Called from Sessions panel "View Traffic Graph →" button
  function handleViewGraph(sid) {
    setGraphSessionId(sid);
    setActiveTab("graph");
  }

  // ── Auth gate ──────────────────────────────────────────────────────── #
  if (!checked) {
    // Still verifying stored token — show nothing to avoid flash
    return <div className={styles.loading}>Connecting…</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  // ── Main app ───────────────────────────────────────────────────────── #
  return (
    <div className={styles.layout}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertTotal={alertTotal}
        username={user}
        onLogout={logout}
      />

      <div className={styles.main}>
        <CaptureBar
          capturing={capturing}
          sessionId={sessionId}
          iface={iface}
          packetTotal={packetTotal}
          alertTotal={alertTotal}
          settings={settings}
          interfaces={interfaces}
          onStart={startCapture}
          onStop={stopCapture}
          onApplySettings={applySettings}
          onClearLogs={clearLogs}
          onExportPdf={handleExportPdf}
        />

        {error && (
          <div className={styles.errorBanner} role="alert">{error}</div>
        )}

        <div className={styles.content}>
          {activeTab === "dashboard" && (
            <Dashboard
              capturing={capturing}
              sessionId={sessionId}
              packetTotal={packetTotal}
              alertTotal={alertTotal}
              packets={packets}
              alerts={alerts}
            />
          )}

          {activeTab === "packets" && (
            <div className={styles.padded}>
              <PacketTable packets={packets} sessionId={sessionId} />
            </div>
          )}

          {activeTab === "alerts" && (
            <div className={styles.padded}>
              <AlertTable alerts={alerts} />
            </div>
          )}

          {activeTab === "graph" && (
            <div className={styles.padded}>
              <TrafficChart
                sessionId={graphSessionId}
                capturing={capturing && graphSessionId === sessionId}
              />
            </div>
          )}

          {activeTab === "sessions" && (
            <div className={styles.padded}>
              <Sessions onViewGraph={handleViewGraph} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
