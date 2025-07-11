import { useEffect, useState } from "react";
import { useSession } from "./useSession";

interface userMessage {
	messageType: 'join' | 'createRoom' | 'chat';
	payload?: {
		username?: string;
		roomId?: string;
		message?: string;
	};
}

interface Messages{
    content: string,
    timestamp: string,
}

export const useSocket = () => {

    const [socket,setSocket] = useState<WebSocket | null>(null)
    
    const [roomId,setRoomId] = useState<string>('')
    
    const [username,setUsername] = useState<string>('')
    
    const [messages,setMessages] = useState<Messages[]>([]);
    
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

    const [roomCreated,setRoomCreated] = useState<boolean>(false)

    const {sessionData, saveSession, clearSession, loadSession } = useSession()

    // Save session data to localStorage
    // const saveSession = (username: string, roomId: string) => {
    //     localStorage.setItem('chatSession', JSON.stringify({ username, roomId }));
    // };

    // Load session data from localStorage
    // const loadSession = () => {
    //     const session = localStorage.getItem('chatSession');
    //     return session ? JSON.parse(session) : null;
    // };

    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
	useEffect(() => {
		const ws = new WebSocket(WS_URL);

		ws.onopen = () => {
            console.log('WebSocket connection established');
            setSocket(ws);

            // Check if there is a saved session
            

            // Check if there is a saved session directly from localStorage
            const saved = localStorage.getItem('chat_session');
            if (saved) {
                try {
                    const session = JSON.parse(saved);
                    if (session.expiresAt > Date.now()) {
                        const { username, roomId } = session;
                        setUsername(username);
                        setRoomId(roomId);

                        // Rejoin the room automatically
                        ws.send(
                            JSON.stringify({
                                messageType: 'rejoin',
                                payload: { username, roomId },
                            })
                        );
                    }
                } catch (error) {
                    console.error('Error parsing session:', error);
                }
            }
        };


        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.messageType === 'connection') {
                    const serverRoomId = data.payload.roomId || '';
                    setRoomId(serverRoomId);
                    const username = data.payload.username || ''
                    setUsername(username);
                    saveSession(username,serverRoomId)
                    
                    console.log(`Room created: ${data.payload.roomId}`);
                } else if (data.messageType === 'chat') {
                    const messageWithTimestamp = {
						content: data.payload.message || '',
						timestamp: data.payload.timestamp || new Date().toISOString(),
					};
                    setMessages((prev) => [...prev, messageWithTimestamp || '']);
                } else if (data.messageType === 'joined') {
                    console.log(`Joined room: ${data.payload.roomId}`);
                } else if (data.messageType === 'error') {
                    setErrorMessage(data.payload.message || 'An error occurred'); // Set error message
                    setRoomCreated(false)
                    clearSession()
                    console.error(`Error: ${data.payload.message}`);
                }
            } catch (error) {
                setErrorMessage('Failed to parse WebSocket message'); // Set error message
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
            saveSession(username, roomId);

            socket.send(
                JSON.stringify({
                    messageType: 'join',
                    payload: { username, roomId },
                })
            );
        }
    };

    return { socket, messages, roomId, username, errorMessage,roomCreated, setRoomCreated, sendMessage, createRoom, joinRoom, clearSession };
};
