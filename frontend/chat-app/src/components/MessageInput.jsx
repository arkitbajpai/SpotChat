import React, { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, selectedUser, selectedRoom } = useChatStore();

  const socket = useAuthStore((state) => state.socket);

  // if available in your auth store
  const authUser = useAuthStore((state) => state.authUser);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImagePreview = () => {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -------------------------
  // TYPING
  // -------------------------
  const handleTyping = (e) => {
    setText(e.target.value);

    // room chat typing
    if (selectedRoom) {
      socket?.emit("typing", {
        roomId: selectedRoom._id,
        username: authUser?.fullName,
      });
    }

    // private chat typing
    if (selectedUser) {
      socket?.emit("private-typing", {
        receiverId: selectedUser._id,
        username: authUser?.fullName,
      });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (selectedRoom) {
        socket?.emit("stopTyping", {
          roomId: selectedRoom._id,
        });
      }

      if (selectedUser) {
        socket?.emit("private-stop-typing", {
          receiverId: selectedUser._id,
        });
      }
    }, 1000);
  };

  // -------------------------
  // SEND MESSAGE
  // -------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      // ROOM MESSAGE
      if (selectedRoom) {
        socket?.emit("room-message", {
          roomId: selectedRoom._id,
          text: text.trim(),
          image: imagePreview,
        });

        setText("");
        removeImagePreview();

        return;
      }

      // PRIVATE MESSAGE
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      removeImagePreview();

    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />

            <button
              onClick={removeImagePreview}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2"
      >
        <div className="flex-1 flex gap-2">

          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview
                ? "text-emerald-500"
                : "text-zinc-400"
            }`}
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <Image size={20} />
          </button>

        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;