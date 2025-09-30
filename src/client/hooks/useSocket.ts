import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

export function useSocket(url = "/ws") {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const connectionAttempts = useRef(0);
  const reconnecting = useRef<NodeJS.Timeout>(null);

  const connect = useCallback(() => {
    connectionAttempts.current += 1;
    const ws = new WebSocket(url);

    ws.onopen = open;
    ws.onerror = error;
    setSocket(ws);
  }, [url]);

  const open = useCallback(() => {
    connectionAttempts.current = 0;
  }, []);

  const error = useCallback(() => {
    const delay = Math.min(30000, connectionAttempts.current * 5000);
    toast(`Reconnecting in ${Math.floor(delay / 1000)}s...`);
    reconnecting.current = setTimeout(() => {
      connect();
    }, Math.min(30000, connectionAttempts.current * 5000));
  }, []);

  useEffect(() => {
    if (reconnecting.current) {
      reconnecting.current.close();
    }
    connect();

    return () => {
      if (socket) {
        socket.onopen = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
      }
      socket?.close();
      setSocket(null);
    };
  }, [url]);

  return socket;
}
