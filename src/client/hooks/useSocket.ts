import { useCallback, useEffect, useRef, useState } from "react";

export function useSocket(url = "/ws") {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const connectionAttempts = useRef(0);
  const reconnecting = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReconnect = () => {
    if (reconnecting.current) {
      clearTimeout(reconnecting.current);
      reconnecting.current = null;
    }
  };

  const open = useCallback(() => {
    connectionAttempts.current = 0;
  }, []);

  const error = useCallback(() => {
    clearReconnect();
    const delay = Math.min(30000, connectionAttempts.current * 5000);
    reconnecting.current = setTimeout(() => {
      connect();
    }, delay);
  }, []);

  const connect = useCallback(() => {
    connectionAttempts.current += 1;
    const ws = new WebSocket(url);

    ws.onopen = open;
    ws.onerror = error;

    // Close previous socket if exists
    setSocket((prev) => {
      if (prev) {
        prev.onopen = null;
        prev.onclose = null;
        prev.onerror = null;
        prev.onmessage = null;
        prev.close();
      }
      return ws;
    });
  }, [url, open, error]);

  useEffect(() => {
    connect();

    return () => {
      clearReconnect();
      setSocket((prev) => {
        if (prev) {
          prev.onopen = null;
          prev.onclose = null;
          prev.onerror = null;
          prev.onmessage = null;
          prev.close();
        }
        return null;
      });
    };
  }, [url, connect]);

  return socket;
}
