import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useSocket } from './hooks/useSocket';
import JoinOrCreateRoom from './Components/CreateOrJoin';

function App() {
	const { messages, roomId, username, sendMessage, createRoom, joinRoom } = useSocket();

	const [roomCreated, setRoomCreated] = useState(false);
	// const [socket, setSocket] = useState<WebSocket | null>(null);
	// const [messages, setMessages] = useState<string[]>([]);
	// const [localUsername, setLocalUsername] = useState('');
	// const [localRoomId, setLocalRoomId] = useState('');

	const inputRef = useRef<HTMLInputElement | null>(null);

	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

	const handleRoomSubmit = ({
		username,
		roomId,
		mode,
	}: {
		username: string;
		roomId: string;
		mode: 'create' | 'join';
	}) => {
		if (mode === 'create') {
			// Create Room Logic
			createRoom(username);
			setRoomCreated(true); // Mark room as created
		} else if (mode === 'join') {
			// Join Room Logic
			joinRoom(username, roomId);
			setRoomCreated(true); // Mark room as joined
		}
	};

	function send() {
		if (!inputRef.current?.value.trim()) {
			return;
		}
		sendMessage(inputRef.current.value.trim());
		inputRef.current.value = '';
	}

	return (
		<>
			{roomCreated ? (
				<div className="flex flex-col  bg-black text-white min-h-screen">
					<div className="sticky top-0 left-0 w-full z-10 bg-zinc-950 opacity-90 px-4 py-2 backdrop-blur">
						<div className="text-sm text-right p-4 ">
							<h2 className="font-bold">User: {username}</h2>
							<h2 className="font-bold">Room ID: {roomId}</h2>
						</div>
					</div>

					{/* message div */}
					{/* message div with auto-scroll */}
					{/* message div with thread-style design */}
					<div
						className="flex-1 flex flex-col px-4 sm:px-20 py-4 space-y-3 overflow-y-auto"
						style={{ paddingBottom: '100px' }}
					>
						{messages.length === 0 ? (
							<div className="text-center text-gray-400 mt-10">
								No messages yet... Start the conversation!
							</div>
						) : (
							messages.map((message, idx) => {
								const parseMessage = (msg: string) => {
									const colonIndex = msg.indexOf(':');
									if (colonIndex === -1) return { sender: '', content: msg };

									return {
										sender: msg.substring(0, colonIndex).trim(),
										content: msg.substring(colonIndex + 1).trim(),
									};
								};

								const { sender, content } = parseMessage(message);
								const isOwnMessage = sender === username;

								return (
									<div
										key={idx}
										className={`flex ${
											isOwnMessage ? 'flex-row-reverse' : 'flex-row'
										} gap-3 max-w-[80%] ${
											isOwnMessage ? 'self-end' : 'self-start'
										}`}
									>
										{/* Avatar/Initial */}
										<div
											className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
												isOwnMessage
													? 'bg-white text-black'
													: 'bg-gray-600 text-white'
											}`}
										>
											{sender.charAt(0).toUpperCase()}
										</div>

										{/* Message content */}
										<div className="flex-1 min-w-0">
											{/* Username with highlight */}
											<div
												className={`text-sm font-semibold mb-1 ${
													isOwnMessage
														? 'text-white text-right'
														: 'text-gray-300 text-left'
												}`}
											>
												{sender}
												<span className="text-xs font-normal text-gray-500 ml-2">
													{new Date().toLocaleTimeString([], {
														hour: '2-digit',
														minute: '2-digit',
													})}
												</span>
											</div>

											{/* Message bubble with connecting line */}
											<div
												className={`relative ${
													isOwnMessage ? 'text-right' : 'text-left'
												}`}
											>
												{/* Connecting line */}
												<div
													className={`absolute top-0 w-px h-6 bg-gray-600 ${
														isOwnMessage
															? 'right-0 -mr-3'
															: 'left-0 -ml-3'
													}`}
												></div>

												{/* Message text */}
												<div
													className={`inline-block px-4 py-2 rounded-2xl max-w-full text-justify break-words ${
														isOwnMessage
															? 'bg-neutral-300 text-black rounded-br-sm'
															: 'bg-neutral-800 text-white rounded-bl-sm'
													}`}
												>
													{content}
												</div>
											</div>
										</div>
									</div>
								);
							})
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input message div */}
					

					<div className="fixed bottom-0 left-0 w-full z-10 bg-black opacity-90 px-4 py-4">
						<div className="flex gap-2 max-w-4xl mx-auto">
							<input
								ref={inputRef} // FIX: Add ref
								type="text"
								placeholder="Message..."
								className="flex-1 bg-zinc-950 text-white border border-zinc-600 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-400" // FIX: Better responsive sizing
								onKeyDown={(e: React.KeyboardEvent) =>{
									if (e.key === 'Enter' && !e.shiftKey && inputRef.current?.value !=null) {
										e.preventDefault();
										send();
    								}
								}} // ADD: Enter key support
							/>
							<button
								className="bg-gray-200 hover:bg-gray-950 hover:text-white border border-zinc-600 px-4 py-2 rounded-md text-black transition-colors" // FIX: Better styling and white text
								onClick={send} // ADD: Click handler
							>
								Send
							</button>
						</div>
					</div>
				</div>
			) : (
				<div>
					<JoinOrCreateRoom
						onSubmit={({ username, roomId, mode }) =>
							handleRoomSubmit({ username, roomId, mode })
						}
					/>
				</div>
			)}
		</>
	);
}

export default App;
