import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL, getAccessToken } from '@/services/api';
import type { WSMIAlert } from '@/types';

// Converts http(s):// base URL → ws(s):// WebSocket URL
function toWsUrl(base: string): string {
  return base.replace(/^http/, 'ws').replace('/api/v1', '');
}

export const useBLEAlerts = () => {
  const [alerts, setAlerts] = useState<WSMIAlert[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token) return;

    const url = `${toWsUrl(API_BASE_URL)}/ws/ecg-alerts/?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      try {
        const data: WSMIAlert = JSON.parse(event.data);
        if (data.type === 'mi_alert' && data.mi_detected) {
          setAlerts((prev) => [data, ...prev].slice(0, 20));
        }
      } catch { /* ignore malformed messages */ }
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 5s
      reconnectTimerRef.current = setTimeout(connect, 5000);
    };

    ws.onerror = () => ws.close();
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const dismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const dismissAll = useCallback(() => setAlerts([]), []);

  return { alerts, connected, dismissAlert, dismissAll };
};