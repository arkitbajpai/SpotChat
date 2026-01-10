import { useState } from "react";
import FriendRequests from "../components/FriendRequests";
import AddFriend from "../components/AddFriend";

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="container mx-auto pt-24 px-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`btn btn-sm ${
            activeTab === "requests" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Friend Requests
        </button>

        <button
          className={`btn btn-sm ${
            activeTab === "add" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Friend
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "requests" && <FriendRequests />}
        {activeTab === "add" && <AddFriend />}
      </div>
    </div>
  );
};

export default FriendsPage;
