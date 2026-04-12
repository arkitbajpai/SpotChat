import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // =========================
  // STATE
  // =========================
  messages: [],
  users: [],
  selectedUser: null,
  selectedRoom: null,
  isUserLoading: false,
  isMessageLoading: false,

  // =========================
  // GET USERS
  // =========================
  getUsers: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.users });
    } catch (err) {
      toast.error("Failed to fetch users");
      console.log("getUsers error:", err);
    } finally {
      set({ isUserLoading: false });
    }
  },

  // =========================
  // GET PRIVATE MESSAGES
  // =========================
  getMessages: async (userId) => {
    set({ isMessageLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (err) {
      toast.error("Failed to fetch messages");
      console.log("getMessages error:", err);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  // =========================
  // SEND PRIVATE MESSAGE
  // =========================
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      const newMessage = res.data.message;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    } catch (err) {
      toast.error("Failed to send message");
      console.log("sendMessage error:", err);
    }
  },

  // =========================
  // PRIVATE CHAT SOCKET
  // =========================
  subscribeToNewMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const isRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (!isRelevant) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  // =========================
  // ROOM SOCKET
  // =========================
  subscribeToRoomMessages: () => {
    const { selectedRoom } = get();
    if (!selectedRoom) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("room-message");

    socket.on("room-message", (message) => {
      if (message.roomId !== selectedRoom._id) return;

      set((state) => ({
        messages: [...state.messages, message],
      }));
    });
  },

  unsubscribeFromRoomMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("room-message");
  },

  // =========================
  // SET SELECTED USER
  // =========================
  setSelectedUser: async (selectedUser) => {
  const socket = useAuthStore.getState().socket;
  const { selectedRoom, getMessages } = get();

  if (selectedRoom) {
    socket?.emit("leave-room", { roomId: selectedRoom._id });
  }

  set({
    selectedUser,
    selectedRoom: null,
    messages: [],
  });

  // ✅ Fetch old messages
  if (selectedUser?._id) {
    getMessages(selectedUser._id);
  }
},

getRoomMessages: async (roomId) => {
  try {
    set({ isMessageLoading: true });

    const res = await axiosInstance.get(`/messages/room/${roomId}`);

    set({
      messages: res.data.messages,
    });

  } catch (error) {
    toast.error("Failed to fetch room messages");
  } finally {
    set({ isMessageLoading: false });
  }
},

  // =========================
  // SET SELECTED ROOM
  // =========================
  setSelectedRoom: (selectedRoom) => {
    const socket = useAuthStore.getState().socket;
    const { selectedRoom: prevRoom } = get();

    if (prevRoom) {
      socket?.emit("leave-room", { roomId: prevRoom._id });
    }

    socket?.emit("join-room", { roomId: selectedRoom._id });

    set({
      selectedRoom,
      selectedUser: null,
      messages: [],
    });
  },
}));