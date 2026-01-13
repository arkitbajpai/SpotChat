import { useEffect, useState } from "react";
import {
  getFriendRequests,
  respondToFriendRequest,
} from "../lib/userApi.js";
import { toast } from "react-hot-toast";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRequests = async () => {
    try {
      const data = await getFriendRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, []);

  const handleRespond = async (userId, action) => {
    try {
      await respondToFriendRequest(userId, action);

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.from._id !== userId)
      );

      toast.success(`Friend request ${action}ed`);
    } catch (err) {
      toast.error("Failed to respond to friend request");
    }
  };

  if (loading) {
    return <div>Loading friend requests...</div>;
  }

  return (
    <div className="friend-requests">
      <h3>Friend Requests</h3>

      {requests?.length === 0 ? (
  <p className="opacity-60">No pending requests</p>
) : (
  <div className="space-y-3">
    {requests.map((req) => (
      <div
        key={req._id}
        className="flex items-center justify-between p-4 rounded-lg bg-base-200 hover:bg-base-300 transition"
      >
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <img
            src={req.from.profilePic || "/avatar.png"}
            alt="profile"
            className="w-11 h-11 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold leading-tight">
              {req.from.fullName}
            </p>
            <p className="text-xs opacity-70">
              wants to be your friend
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-success"
            onClick={() =>
              handleRespond(req.from._id, "accept")
            }
          >
            Accept
          </button>

          <button
            className="btn btn-sm btn-error btn-outline"
            onClick={() =>
              handleRespond(req.from._id, "reject")
            }
          >
            Reject
          </button>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default FriendRequests;
