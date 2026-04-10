import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, selectedRoom, setSelectedUser, setSelectedRoom} =
    useChatStore();
    const{onlineUsers} = useAuthStore();
    const isOnline = onlineUsers?.includes(selectedUser?._id);

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  selectedUser?.profilepic ||
                  "/avatar.png"
                }
                alt="profile"
              />
            </div>
          </div>

          {/* User / Room Name */}
          <div>
            <h3 className="font-medium">
              {selectedRoom?.name || selectedUser?.fullName}
            </h3>

            {selectedUser && (
              <p className="text-sm text-base-content/70">
               {isOnline ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        <button onClick={handleClose}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;