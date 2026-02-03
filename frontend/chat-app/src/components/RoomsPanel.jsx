import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchNearbyRooms } from "../lib/roomsApi";

const RoomsPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchNearbyRooms(latitude, longitude);
          setRooms(data.rooms || []);
        } catch (err) {
          toast.error("Failed to load nearby rooms");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location permission required for rooms");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center text-zinc-400">
        Finding nearby rooms…
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500">
        No active rooms nearby
      </div>
    );
  }

  return (
    <div className="overflow-y-auto w-full py-3 px-3">
      {rooms.map((room) => {
        const expiresAt = room.expiresAt
          ? new Date(room.expiresAt)
          : null;

        const minutesLeft = expiresAt
          ? Math.max(
              0,
              Math.floor((expiresAt - Date.now()) / 60000)
            )
          : null;

        return (
          <div
            key={room._id}
            className="p-3 mb-2 rounded-lg bg-base-200 hover:bg-base-300 transition"
          >
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                <p className="font-medium truncate">{room.name}</p>
                <p className="text-xs text-zinc-400">
                  {room.activeUsers} users
                  {minutesLeft !== null && ` • ⏳ ${minutesLeft} min`}
                </p>
              </div>

              <button className="btn btn-xs btn-primary">
                Join
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomsPanel;
