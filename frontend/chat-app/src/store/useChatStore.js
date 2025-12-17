import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { io } from 'socket.io-client';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
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

            // FIX HERE ✔
            set({ messages: res.data.messages});

        } catch (err) {
            toast.error("Failed to fetch messages");
            console.log("getMessages error in the chatStore:", err);
        } finally {
            set({ isMessageLoading: false });
        }
    },

   
    sendMessage: async (messageData) => {
        const { selectedUser } = get();

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            // Backend returns {message: {...}}
            const newMessage = res.data.message;

            // FIX HERE ✔
            set((state) => ({
                messages: [...state.messages, newMessage],
            }));

        } catch (err) {
            toast.error("Failed to send message");
            console.log("sendMessage error :", err);
        }
   
    },
    subscribeToNewMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  // ✅ THIS LINE IS CRITICAL
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
    
     setSelectedUser: (selectedUser) => set({ selectedUser }),




}));