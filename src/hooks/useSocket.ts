import { createRef, useEffect, useState } from "react";

interface userMessage {
	messageType: 'join' | 'createRoom' | 'chat';
	payload?: {
		username?: string;
		roomId?: string;
		message?: string;
	};
}

export const useSocket = () => {

    const [socket,setSocket] = useState<WebSocket | null>(null)
    const [roomId,setRoomId] = useState<string>('')
    const [username,setUsername] = useState<string>('')
    const [messages,setMessages] = useState<string[]>([]);

	useEffect(() => {
		const ws = new WebSocket('ws://localhost:8080');

		ws.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(ws);
        };


        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.messageType === 'connection') {
                    setRoomId(data.payload.roomId || '');
                    console.log(`Room created: ${data.payload.roomId}`);
                } else if (data.messageType === 'chat') {
                    setMessages((prev) => [...prev, data.payload.message || '']);
                } else if (data.messageType === 'joined') {
                    console.log(`Joined room: ${data.payload.roomId}`);
                } else if (data.messageType === 'error') {
                    console.error(`Error: ${data.payload.message}`);
                }
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setSocket(null);
        };
		
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => ws.close();
	}, []);

    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    messageType: 'chat',
                    payload: { username, roomId, message },
                })
            );
        }
    };

    const createRoom = (username: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            setUsername(username);
            socket.send(
                JSON.stringify({
                    messageType: 'createRoom',
                    payload: { username },
                })
            );
        }
    };

    const joinRoom = (username: string, roomId: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            setUsername(username);
            setRoomId(roomId);
            socket.send(
                JSON.stringify({
                    messageType: 'join',
                    payload: { username, roomId },
                })
            );
        }
    };

    return { socket, messages, roomId, username, sendMessage, createRoom, joinRoom };
};
