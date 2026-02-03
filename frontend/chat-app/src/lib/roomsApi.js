export const fetchNearbyRooms = async (lat, lng) => {
  const res = await fetch(
    `http://localhost:5000/api/rooms/nearby?lat=${lat}&lng=${lng}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return res.json();
};
