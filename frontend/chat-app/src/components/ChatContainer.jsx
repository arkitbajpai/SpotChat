import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    selectedRoom, // ✅ FIXED
    subscribeToRoomMessages,
    unsubscribeFromRoomMessages
  } = useChatStore();

  const { authUser } = useAuthStore(); // ✅ only auth here

  const messageEndRef = useRef(null);

  // =============================
  // PRIVATE CHAT LOGIC
  // =============================
  useEffect(() => {
  if (!selectedRoom) return;

  const socket = useAuthStore.getState().socket;

  // 🔥 join socket room
  socket?.emit("join-room", { roomId: selectedRoom._id });

  subscribeToRoomMessages();

  return () => {
    socket?.emit("leave-room", { roomId: selectedRoom._id });
    unsubscribeFromRoomMessages();
  };
}, [selectedRoom]);

  // =============================
  // SCROLL TO BOTTOM
  // =============================
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // =============================
  // NO CHAT SELECTED
  // =============================
  if (!selectedUser && !selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a chat to start messaging
      </div>
    );
  }

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {safeMessages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId?.toString() === authUser._id?.toString()
                ? "chat-end"
                : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilepic || "/avatar.png"
                      : selectedUser?.profilepic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;