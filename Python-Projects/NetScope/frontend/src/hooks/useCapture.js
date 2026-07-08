import { useState, useCallback, useEffect } from "react";
import { api } from "../api";
import { useWebSocket } from "./useWebSocket";

const MAX_ROWS = 500;

const DEFAULT_SETTINGS = {
  filter:            null,
  iface:             null,
  time_window:       10,
  max_ports_scanned: 5,
  max_packets_flood: 30,
};

export function useCapture() {
  const [capturing,   setCapturing]   = useState(false);
  const [sessionId,   setSessionId]   = useState("");
  const [iface,       setIface]       = useState("");
  const [packetTotal, setPacketTotal] = useState(0);
  const [alertTotal,  setAlertTotal]  = useState(0);
  const [packets,     setPackets]     = useState([]);
  const [alerts,      setAlerts]      = useState([]);
  const [error,       setError]       = useState(null);
  const [settings,    setSettings]    = useState(DEFAULT_SETTINGS);
  const [interfaces,  setInterfaces]  = useState([]);

  // Load available interfaces once on mount
  useEffect(() => {
    api.get("/interfaces")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setInterfaces(data);
        const first = data.find((i) => i.iface_type !== "Loopback");
        if (first) setSettings((p) => ({ ...p, iface: first.name }));
      })
      .catch(() => {});
  }, []);

  const onMessage = useCallback((msg) => {
    if (msg.type === "status") {
      setCapturing(msg.capturing);
      setSessionId(msg.session_id ?? "");
      setIface(msg.iface ?? "");
      setPacketTotal(msg.packet_total ?? 0);
      setAlertTotal(msg.alert_total ?? 0);
    } else if (msg.type === "update") {
      setPacketTotal(msg.packet_total);
      setAlertTotal(msg.alert_total);
      if (msg.packets?.length) {
        setPackets((prev) => [...msg.packets.slice().reverse(), ...prev].slice(0, MAX_ROWS));
      }
      if (msg.alerts?.length) {
        setAlerts((prev) => [...msg.alerts.slice().reverse(), ...prev].slice(0, MAX_ROWS));
      }
    }
  }, []);

  useWebSocket(onMessage);

  const startCapture = useCallback(async (overrides = {}) => {
    setError(null);
    setPackets([]);
    setAlerts([]);
    try {
      const res = await api.post("/capture/start", { ...settings, ...overrides });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail ?? "Failed to start capture");
      }
    } catch (e) {
      setError(e.message);
    }
  }, [settings]);

  const stopCapture = useCallback(async () => {
    setError(null);
    try {
      const res = await api.post("/capture/stop");
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.detail ?? "Failed to stop capture");
      }
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const applySettings = useCallback(async (newSettings) => {
    setError(null);
    setSettings((p) => ({ ...p, ...newSettings }));
    if (capturing) {
      try {
        const res = await api.post("/capture/settings", newSettings);
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.detail ?? "Failed to apply settings");
        }
      } catch (e) {
        setError(e.message);
      }
    }
  }, [capturing]);

  const clearLogs = useCallback(() => {
    setPackets([]);
    setAlerts([]);
  }, []);

  return {
    capturing, sessionId, iface, packetTotal, alertTotal,
    packets, alerts, error, settings, interfaces,
    startCapture, stopCapture, applySettings, clearLogs,
  };
}
