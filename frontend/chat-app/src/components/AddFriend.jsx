import { useEffect, useState } from "react";
import {axiosInstance}from "../lib/axios";
import { toast } from "react-hot-toast";

const AddFriend = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔁 Debounced search
  useEffect(() => {
    // reset state when input is small
    if (query.trim().length < 2) {
      setUsers([]);
      setMessage("Type at least 2 characters");
      return;
    }

    setMessage("");
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(
          `/users/search?query=${query}`
        );

        setUsers(res.data.users || []);

        if (res.data.users.length === 0) {
          setMessage("No users found");
        }
      } catch (err) {
        setMessage("Search failed");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 500); // ⏱ debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  const sendRequest = async (userId) => {
    try {
      await axiosInstance.post(`/users/request/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      const message =
      err.response?.data?.message || "Failed to send request";
    toast.error(message);
    }
  };

  return (
    <div className="space-y-3">
      <input
        className="input input-bordered w-full"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Feedback messages */}
      {message && (
        <p className="text-sm text-gray-400">{message}</p>
      )}

      {loading && (
        <p className="text-sm text-gray-400">Searching...</p>
      )}

      {/* Results */}
      {users.map((user) => (
        <div
          key={user._id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <span>{user.fullName}</span>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => sendRequest(user._id)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddFriend;
