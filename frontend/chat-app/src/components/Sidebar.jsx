import React, { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useChatStore } from "../store/useChatStore";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { removeFriend } from "../lib/userApi";
import toast from "react-hot-toast";
import RoomsPanel from "./RoomsPanel";

const Sidebar = () => {
  const {
    getUsers,
    users,
    setSelectedUser,
    selectedUser,
    isUserLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts"); // 👈 NEW

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleRemoveFriend = (e, friendId) => {
    e.stopPropagation();

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <span className="font-medium">Remove this friend?</span>

          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-xs"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>

            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await removeFriend(friendId);
                  await getUsers();
                  toast.success("Friend removed");
                } catch (err) {
                  toast.error("Failed to remove friend");
                }
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ),
      { duration: 6000 }
    );
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineUsers.includes(u._id))
    : users;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">
      {/* ================= HEADER ================= */}
      <div className="border-b border-base-300 w-full p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveTab("contacts")}
            className={`flex-1 btn btn-sm ${
              activeTab === "contacts" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Contacts
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex-1 btn btn-sm ${
              activeTab === "rooms" ? "btn-primary" : "btn-ghost"
            }`}
          >
            Rooms
          </button>
        </div>

        {/* Contacts Options */}
        {activeTab === "contacts" && (
          <>
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <span className="font-medium hidden lg:block">Contacts</span>
            </div>

            <div className="mt-3 hidden lg:flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => setShowOnlineOnly(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-sm">Show online only</span>
              </label>
              <span className="text-xs text-zinc-500">
                ({onlineUsers.length} online)
              </span>
            </div>
          </>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "contacts" && (
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3 cursor-pointer
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 rounded-full object-cover"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* Info + Remove */}
              <div className="hidden lg:flex justify-between items-center w-full min-w-0">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemoveFriend(e, user._id)}
                  className="btn btn-xs btn-error btn-outline ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              No users found
            </div>
          )}
        </div>
      )}

      {activeTab === "rooms" && <RoomsPanel />}
    </aside>
  );
};

export default Sidebar;
