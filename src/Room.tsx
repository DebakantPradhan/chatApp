import { useRef, useState } from "react";

interface userMessage {
	messageType: 'join' | 'createRoom' | 'chat';
	payload?: {
		username?: string;
		roomId?: string;
		message?: string;
	};
}

function Room() {

    const [roomId,setRoomId] = useState('')

    const usernameRef = useRef<HTMLInputElement | null>(null)

	async function createRoom() {
		const ws =await new WebSocket('ws://localhost:8080');
		ws.onopen = () => {
            console.log('WebSocket connected');
        
            
            // Now it's safe to send the message
            ws.send(JSON.stringify({
                messageType: 'createRoom',
                payload: {
                    username: usernameRef.current?.value || 'Anonymous'
                }
            }));
        };

        ws.onmessage = (e) =>{
            setRoomId(JSON.parse(e.data).payload.roomId)
        }
	}
	function joinRoom(roomId: string) {
        
    }

	return (
		<>
			<input ref={usernameRef} type="text" placeholder="enter username" />
            <div>{roomId}</div>
			<button className="p-2" onClick={createRoom}>
				CreateRoom
			</button>
			<button onClick={joinRoom}>JoinRoom</button>
		</>
	);
}

export default Room;
