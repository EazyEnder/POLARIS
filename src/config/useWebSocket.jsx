import React, { createContext, useContext, useEffect, useState } from "react";

let websocketInstance = null;

export function getWebSocketInstance(url) {
  if (!websocketInstance || websocketInstance.readyState === WebSocket.CLOSED) {
    websocketInstance = new WebSocket(url);
  }
  return websocketInstance;
}

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, url }) => {
  const [websocket, setWebsocket] = useState(() => getWebSocketInstance(url));

  useEffect(() => {
    const ws = getWebSocketInstance(url);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    setWebsocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  return <WebSocketContext.Provider value={websocket}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};