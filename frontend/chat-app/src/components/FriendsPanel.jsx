import { useState } from "react";
import FriendRequests from "./FriendRequests";
import AddFriend from "./AddFriend";

const FriendsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="friends-panel">
      <div className="header">
        <h3>Friends</h3>
        <button onClick={onClose}>X</button>
      </div>

      <div className="tabs">
        <button
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>

        <button
          onClick={() => setActiveTab("add")}
        >
          Add Friend
        </button>
      </div>

      <div className="content">
        {activeTab === "requests" && <FriendRequests />}
        {activeTab === "add" && <AddFriend />}
      </div>
    </div>
  );
};

export default FriendsPanel;
