/**
 * useWebSocket.js
 * Manages a WebSocket connection to the NetScope backend.
 * Auto-reconnects with exponential back-off on unexpected disconnection.
 */

import { useEffect, useRef, useCallback } from "react";

const WS_URL = "ws://127.0.0.1:8000/ws/stream";
const MAX_BACKOFF_MS = 30_000;

export function useWebSocket(onMessage) {
  const wsRef        = useRef(null);
  const backoffRef   = useRef(1_000);
  const unmountedRef = useRef(false);

  const connect = useCallback(() => {
    if (unmountedRef.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      backoffRef.current = 1_000; // reset back-off on successful connect
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        // Ignore malformed frames
      }
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS);
      setTimeout(connect, delay);
    };

    ws.onerror = () => ws.close();
  }, [onMessage]);

  useEffect(() => {
    unmountedRef.current = false;
    connect();
    return () => {
      unmountedRef.current = true;
      wsRef.current?.close();
    };
  }, [connect]);
}
