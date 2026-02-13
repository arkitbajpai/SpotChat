import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchNearbyRooms,
  createRoom,
  joinRoom,
} from "../lib/roomsApi";
import { useChatStore } from "../store/useChatStore";
import { socket } from "../lib/socket"; // 🔥 IMPORTANT

const RoomsPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setSelectedRoom, setSelectedUser } = useChatStore();

  // =========================
  // LOAD NEARBY ROOMS
  // =========================
  const loadRooms = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchNearbyRooms(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setRooms(data);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load nearby rooms");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location permission required");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // =========================
  // JOIN ROOM (DB + SOCKET)
  // =========================
  const handleJoinRoom = async (room) => {
    try {
      // 1️⃣ Join via REST (DB)
      await joinRoom(room._id);

      // 2️⃣ Join Socket.IO room
      socket.emit("join-room", { roomId: room._id });

      // 3️⃣ Switch main chat panel
      setSelectedUser(null);
      setSelectedRoom(room);
    } catch (error) {
      console.error(error);
      toast.error("Failed to join room sorry");
    }
  };

  // =========================
  // CREATE ROOM
  // =========================
  const handleCreateRoom = () => {
    const name = prompt("Room name");
    const durationHours = Number(prompt("Duration (hours)", "1"));

    if (!name || !durationHours) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await createRoom({
            name,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            durationHours,
          });

          toast.success("Room created congo");
          loadRooms(); // refresh list
        } catch (error) {
          console.error(error);
          toast.error("Failed to create room");
        }
      },
      () => toast.error("Location permission required")
    );
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="p-4 text-center text-zinc-400">
        Loading nearby rooms…
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="flex flex-col h-full">
      {/* CREATE ROOM BUTTON */}
      <div className="p-3 border-b border-base-300">
        <button
          onClick={handleCreateRoom}
          className="btn btn-sm btn-primary w-full"
        >
          + Create Room
        </button>
      </div>

      {/* ROOMS LIST */}
      <div className="overflow-y-auto px-3 py-3">
        {rooms.length === 0 && (
          <div className="text-center text-zinc-500">
            No rooms nearby
          </div>
        )}

        {rooms.map((room) => {
          const minutesLeft = Math.max(
            0,
            Math.floor(
              (new Date(room.expiresAt) - Date.now()) / 60000
            )
          );

          return (
            <div
              key={room._id}
              className="p-3 mb-2 rounded-lg bg-base-200 hover:bg-base-300 transition"
            >
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {room.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {room.members.length} users • ⏳ {minutesLeft} min
                  </p>
                </div>

                <button
                  onClick={() => handleJoinRoom(room)}
                  className="btn btn-xs btn-primary"
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomsPanel;
