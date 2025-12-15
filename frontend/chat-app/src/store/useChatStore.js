import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

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
    const {selectedUser}=get()
    if(!selectedUser){
        return; 
    }
    const socket= useAuthStore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
        if(newMessage.senderId=== selectedUser._id || newMessage.receiverId=== selectedUser._id){
            set((state)=>({
                messages:[...state.messages,newMessage],
            }));
        }   
    })
    },
     setSelectedUser: (user) => {
        set({ selectedUser: user });
    },




}));