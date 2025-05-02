from fastapi import WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from main import app

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, dict] = {}

    def isConnected(self, user_id: str) -> bool:
        return user_id in self.active_connections

    async def connect(self, user_id: str, websocket: WebSocket):
        if self.isConnected(user_id):
            raise ValueError(f"User {user_id} already has an open connection")
        await websocket.accept()
        self.active_connections[user_id] = {}
        self.active_connections[user_id]["websocket"] = websocket
        self.active_connections[user_id]["channel"] = ""

    def disconnect(self, user_id: str):
        if self.isConnected(user_id):
            del self.active_connections[user_id]

    async def sendMessageToUser(self, user_id: str, data: dict):
        """Send a JSON message to a specific user."""
        if self.isConnected(user_id):
            websocket = self.active_connections[user_id]["websocket"]
            await websocket.send_json(data)
        
CONNECTION_MANAGER = ConnectionManager()

@app.websocket("/websocket")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await CONNECTION_MANAGER.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
    except WebSocketDisconnect:
        CONNECTION_MANAGER.disconnect(user_id)