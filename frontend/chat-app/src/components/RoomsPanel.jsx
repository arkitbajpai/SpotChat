import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchNearbyRooms,
  createRoom,
  joinRoom,
} from "../lib/roomsApi";
import { useChatStore } from "../store/useChatStore";

const RoomsPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setSelectedRoom, setSelectedUser } = useChatStore();

  const loadRooms = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchNearbyRooms(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setRooms(data);
        } catch {
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

  useEffect(loadRooms, []);

  // ✅ JOIN ROOM
  const handleJoinRoom = async (room) => {
    try {
      await joinRoom(room._id);
      setSelectedUser(null);
      setSelectedRoom(room);
    } catch {
      toast.error("Unable to join room");
    }
  };

  // ✅ CREATE ROOM
  const handleCreateRoom = () => {
    const name = prompt("Room name");
    const durationHours = Number(
      prompt("Duration (hours)", "1")
    );

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

          toast.success("Room created");
          loadRooms();
        } catch {
          toast.error("Failed to create room");
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-zinc-400">
        Loading nearby rooms…
      </div>
    );
  }

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
              className="p-3 mb-2 rounded-lg bg-base-200 hover:bg-base-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{room.name}</p>
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
