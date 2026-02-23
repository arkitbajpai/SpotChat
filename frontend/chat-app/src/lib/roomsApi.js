const BASE_URL = "http://localhost:5001";

// =======================
// FETCH NEARBY ROOMS
// =======================
export const fetchNearbyRooms = async (latitude, longitude) => {
  const res = await fetch(
    `${BASE_URL}/api/rooms/nearby?latitude=${latitude}&longitude=${longitude}`,
    { credentials: "include" }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch rooms");
  }

  return data;
};

// =======================
// CREATE ROOM
// =======================
export const createRoom = async ({
  name,
  latitude,
  longitude,
  durationHours,
}) => {
  const res = await fetch(`${BASE_URL}/api/rooms`, {
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create room");
  }

  return data;
};

// =======================
// JOIN ROOM
// =======================
export const joinRoom = async (roomId) => {
  const res = await fetch(
    `${BASE_URL}/api/rooms/${roomId}/join`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to join room");
  }

  return data;
};