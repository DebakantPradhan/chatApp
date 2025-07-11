import { useState, useEffect } from "react";

interface JoinOrCreateRoomProps {
  onSubmit: (data: { username: string; roomId: string; mode: "join" | "create" }) => void;
  isConnecting?: boolean;
  roomId?: string;
  showRoomCreatedAlert?: boolean;
}

const JoinOrCreateRoom = ({ 
  onSubmit, 
  isConnecting = false, 
  roomId = "", 
  showRoomCreatedAlert = false 
}: JoinOrCreateRoomProps) => {
  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [mode, setMode] = useState<"join" | "create">("join");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || (mode === "join" && !roomIdInput)) {
      setError("Please fill in all required fields.");
      return;
    }

    // For create mode, let server generate roomId
    const finalRoomId = mode === "create" ? "" : roomIdInput.toUpperCase();

    try {
      await onSubmit({ username, roomId: finalRoomId, mode });
      setError("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      
      {/* Room Created Success Alert */}
      {showRoomCreatedAlert && roomId && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          🎉 Room Created! ID: <strong>{roomId}</strong>
        </div>
      )}

      {/* Loading Overlay */}
      {isConnecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border border-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-white font-medium">
              {mode === "create" ? "Creating your room..." : "Joining room..."}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-600 p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Chat Room</h2>
          <p className="text-slate-400">Join or create a temporary chat room</p>
        </div>

        {/* Username Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnecting}
          />
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Choose an option</label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={mode === "join"}
                onChange={() => setMode("join")}
                className="mr-3 w-4 h-4 bg-black text-blue-500"
                disabled={isConnecting}
              />
              <span className="text-slate-300">Join Room</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={mode === "create"}
                onChange={() => setMode("create")}
                className="mr-3 w-4 h-4 text-blue-500"
                disabled={isConnecting}
              />
              <span className="text-slate-300">Create Room</span>
            </label>
          </div>
        </div>

        {/* Room ID Input (only for join) */}
        {mode === "join" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Room ID</label>
            <input
              type="text"
              placeholder="Enter room ID (e.g., ABC123)"
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
              disabled={isConnecting}
            />
          </div>
        )}

        {/* Create Mode Info */}
        {mode === "create" && (
          <div className="bg-[#1c2938] border border-slate-700 p-4 rounded-lg">
            <p className="text-sm  text-white">
              A unique room ID will be generated for you automatically.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            isConnecting 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-white text-black hover:bg-gray-200 transform hover:scale-105 active:scale-95"
          }`}
          disabled={isConnecting}
        >
          {isConnecting 
            ? (mode === "create" ? "Creating..." : "Joining...") 
            : (mode === "join" ? "Join Room" : "Create Room")
          }
        </button>

        <div className="text-center text-sm text-gray-200 space-y-1">
          <p>🔒 Temporary & Private</p>
          <p>🕐 Sessions expire automatically</p>
        </div>
      </form>
    </div>
  );
};

export default JoinOrCreateRoom;