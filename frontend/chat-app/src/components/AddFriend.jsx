import { useState } from "react";
//import api from "../lib/api"; // ✅ USE YOUR SINGLE API INSTANCE
//import axios from "axios";
import {axiosInstance} from "../lib/axios";

const AddFriend = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    try {
      const res = await axiosInstance.get(`/users/search?query=${query}`);
      console.log("UI received:", res.data);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Search failed", err);
      setUsers([]);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await api.post(`/users/request/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to send request", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={searchUsers}>Search</button>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="user-row">
            <span>{user.fullName}</span>
            <button onClick={() => sendRequest(user._id)}>
              Add
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AddFriend;
