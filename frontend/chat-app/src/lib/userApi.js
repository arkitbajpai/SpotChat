import axios from "axios";

export const getFriendRequests = async () => {
  const response = await axios.get(
    "/api/users/requests",
    { withCredentials: true } // ✅ IMPORTANT
  );

  return response.data.requests || [];
};

export const respondToFriendRequest = async (userId, action) => {
  await axios.post(
    `/api/users/respond/${userId}`,
    { action },
    { withCredentials: true } // ✅ IMPORTANT
  );
};
