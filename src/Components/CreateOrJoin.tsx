import { useState } from "react";
// import { useSocket } from "../hooks/useSocket";

interface JoinOrCreateRoomProps {
  onSubmit: (data: { username: string; roomId: string; mode: "join" | "create" }) => void;
}

const JoinOrCreateRoom = ({ onSubmit }: JoinOrCreateRoomProps) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState("join"); // 'join' or 'create'
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || (mode === "join" && !roomId)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true); // Show loading state
    const finalRoomId = mode === "create" ? crypto.randomUUID().slice(0, 6) : roomId;

    try {
      await onSubmit({ username, roomId: finalRoomId , mode });
      setError(""); // Clear error
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-400">Join or Create a Chat Room</h2>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter username"
          aria-label="Enter your username"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Toggle Join/Create */}
        <div className="flex gap-4">
          <label className="flex items-center text-sm">
            <input
              type="radio"
              checked={mode === "join"}
              onChange={() => setMode("join")}
              className="mr-2"
            />
            Join Room
          </label>
          <label className="flex items-center text-sm">
            <input
              type="radio"
              checked={mode === "create"}
              onChange={() => setMode("create")}
              className="mr-2"
            />
            Create Room
          </label>
        </div>

        {/* Room ID input (only if joining) */}
        {mode === "join" && (
          <input
            type="text"
            placeholder="Enter room ID (e.g., ABC123)"
            aria-label="Enter room ID"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full px-4 py-2 rounded text-white ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : mode === "join" ? "Join Room" : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default JoinOrCreateRoom;