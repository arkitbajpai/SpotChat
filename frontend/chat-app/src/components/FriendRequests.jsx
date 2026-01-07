import { useEffect, useState } from "react";
import {
    getFriendRequests,
    respondToFriendRequest,
} from "../lib/userApi.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const FriendRequests = () => {
    const [ requests, setRequests ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    
    useEffect(() => {
        const fetchRequests = async () => {
            try{
                const data = await getFriendRequests();
                setRequests(data);
            } catch(err){
                toast.error("Failed to load friend requests");
            } finally {
                setLoading(false);
            }

        } ;
        fetchRequests();
    }, []);

    const handleRespond = async (userId, action) => {
        try{
            await respondToFriendRequest(userId, action);
            setRequests((prevRequests) =>
                prevRequests.filter((req) => req.from._id !== userId)
            );
            toast.success(`Friend request ${action}ed`);    
        } catch(err){
            toast.error("Failed to respond to friend request");
        }
    };
    if (loading) {
        return <div>Loading friend requests...</div>;
    }
    return (
    <div className="friend-requests">
      <h3>Friend Requests</h3>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div key={req.from._id} className="request-card">
            <img
              src={req.from.profilePic || "/avatar.png"}
              alt=""
              className="avatar"
            />
            <span>{req.from.fullName}</span>

            <div className="actions">
              <button
                onClick={() =>
                  handleAction(req.from._id, "accept")
                }
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleAction(req.from._id, "reject")
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

}
export default FriendRequests;