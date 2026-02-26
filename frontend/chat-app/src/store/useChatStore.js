import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  
  messages: [],
  users: [],
  selectedUser: null,
  selectedRoom: null, 
  isUserLoading: false,
  isMessageLoading: false,

 
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

  
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set({ messages: res.data.messages });
    } catch (err) {
      toast.error("Failed to fetch messages");
      console.log("getMessages error in the chatStore 1:", err);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  
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

  // =========================
  // SOCKET: PRIVATE CHAT UNSUBSCRIBE
  // =========================
  unsubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  // =========================
  // SET SELECTED USER
  // =========================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      selectedRoom: null, // 🔥 leave room when opening DM
      messages: [],
    }),

  // =========================
  // ✅ NEW: SET SELECTED ROOM
  // =========================
  setSelectedRoom: (selectedRoom) =>
    set({
      selectedRoom,
      selectedUser: null, // 🔥 leave DM when opening room
      messages: [], // 🔥 clear old messages
    }),
}));