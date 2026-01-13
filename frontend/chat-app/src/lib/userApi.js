import { axiosInstance } from "./axios";

export const getFriendRequests = async () => {
  const response = await axiosInstance.get(
    "/users/requests",
    { withCredentials: true } // ✅ IMPORTANT
  );
 //console.log("RAW API RESPONSE:", response.data);
  return response.data.friendRequests;
};

export const respondToFriendRequest = async (userId, action) => {
  await axiosInstance.post(
    `/users/respond/${userId}`,
    { action },
    { withCredentials: true } // ✅ IMPORTANT
  );
};
export const removeFriend = async (userId) => {
  await axiosInstance.delete(
    `/users/friends/${userId}`,
    { withCredentials: true } // ✅ IMPORTANT
  );
}