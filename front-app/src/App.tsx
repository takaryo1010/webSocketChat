import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<string>("default"); // ルーム名の状態

  useEffect(() => {
    // WebSocketサーバーに接続
    const ws = new WebSocket(`ws://localhost:8080/ws?room=${room}`);

    // 接続が開いたときのイベント
    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    // メッセージを受信したとき
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // 接続が閉じたとき
    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    setSocket(ws);

    // クリーンアップ
    return () => {
      ws.close();
    };
  }, [room]); // ルームが変更されたときに再接続

  const sendMessage = () => {
    if (socket && isConnected && input.trim() !== "") {
      const msg = { text: input }; // メッセージをオブジェクト形式で送信
      socket.send(JSON.stringify(msg)); // JSONとして送信
      setInput("");
    } else {
      console.log("WebSocket is not connected or input is empty");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Chat Room</h1>

      {/* ルーム選択 */}
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter room name"
        style={{ marginBottom: "10px", width: "100%" }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "calc(100% - 50px)", marginRight: "10px" }}
      />
      <button onClick={sendMessage} disabled={!isConnected}>
        Send
      </button>
    </div>
  );
};

export default App;
