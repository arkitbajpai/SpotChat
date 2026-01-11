import { useState } from "react";
import axios from "axios";

const AddFriend = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    if (!query.trim()) return;
    console.log("Search clicked, query:", query);

    try {
      const res = await axios.get(
        `/api/users/search?query=${query}`,
        { withCredentials: true } // ✅ REQUIRED
      );
       console.log("Search API response:", res.data);

      // ✅ ALWAYS extract array safely
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Search failed", err);
      setUsers([]); // ✅ prevent crash
    }
  };

  const sendRequest = async (userId) => {
    try {
      await axios.post(
        `/api/users/request/${userId}`,
        {},
        { withCredentials: true } // ✅ REQUIRED
      );

      // remove user from list after request
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
