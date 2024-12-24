import React, { useState, useEffect } from "react";

const App: React.FC = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messageQueue, setMessageQueue] = useState<string[]>([]); // メッセージキュー

    // WebSocketを初期化
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = () => {
            console.log("WebSocket connection established");

            // キュー内のメッセージを送信
            messageQueue.forEach((message) => {
                ws.send(message);
                console.log("Sent queued message:", message);
            });
            setMessageQueue([]); // キューをクリア
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onmessage = (event) => {
            console.log("Message received from server:", event.data);
        };

        setSocket(ws);

        // コンポーネントがアンマウントされたときにWebSocketを閉じる
        return () => {
            ws.close();
        };
    }, [messageQueue]);

    // メッセージ送信関数
    const sendMessage = (message: string) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(message);
            console.log("Sent message:", message);
        } else if (socket?.readyState === WebSocket.CONNECTING) {
            console.warn("WebSocket is connecting. Queuing message:", message);
            setMessageQueue((prevQueue) => [...prevQueue, message]);
        } else {
            console.error("WebSocket is not open. Message cannot be sent:", message);
        }
    };

    // テスト用にボタンでメッセージを送信
    const handleSendClick = () => {
        sendMessage("Hello, server!");
    };

    return (
        <div>
            <h1>WebSocket Chat</h1>
            <button onClick={handleSendClick}>Send Message</button>
        </div>
    );
};

export default App;
