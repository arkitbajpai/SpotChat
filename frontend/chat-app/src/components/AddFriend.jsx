import { useState } from "react";
import axios from "axios";

const AddFriend = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async () => {
    try {
      const res = await axios.get(
        `/api/users/search?query=${query}`
      );
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (userId) => {
    await axios.post(`/api/users/request/${userId}`);
    setUsers((prev) =>
      prev.filter((u) => u._id !== userId)
    );
  };

  return (
    <div>
      <input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>

      {users.map((user) => (
        <div key={user._id} className="user-row">
          <span>{user.fullName}</span>
          <button onClick={() => sendRequest(user._id)}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddFriend;
