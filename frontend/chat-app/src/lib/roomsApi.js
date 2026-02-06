export const fetchNearbyRooms = async (latitude, longitude) => {
  const res = await fetch(
    `http://localhost:5001/api/rooms/nearby?latitude=${latitude}&longitude=${longitude}`,
    { credentials: "include" }
  );

  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json(); // 👈 array
};

export const createRoom = async ({
  name,
  latitude,
  longitude,
  durationHours,
}) => {
  const res = await fetch("http://localhost:5001/api/rooms", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      latitude,
      longitude,
      durationHours,
    }),
  });

  if (!res.ok) throw new Error("Failed to create room sorry");
  return res.json();
};

export const joinRoom = async (roomId) => {
  const res = await fetch(
    `http://localhost:5000/api/rooms/${roomId}/join`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to join room");
};
