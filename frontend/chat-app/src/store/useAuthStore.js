import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "/";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,

      // =========================
      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
          set({ authUser: res.data });
          get().connectSocket();
        } catch {
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          set({ authUser: res.data });
          toast.success("Signup successful");
          get().connectSocket();
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Login successful");
          get().connectSocket();
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        await axiosInstance.post("/auth/logout");
        get().disconnectSocket();
        set({ authUser: null });
        toast.success("Logout successful");
      },

      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(baseURL, {
          withCredentials: true,
          transports: ["websocket"],
          query: { userId: authUser._id },
        });

        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });

        set({ socket: newSocket });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) socket.disconnect();

        set({ socket: null, onlineUsers: [] });
      },
    }),
    {
      name: "auth-storage", // 🔥 key in localStorage
      partialize: (state) => ({
        authUser: state.authUser, // only persist user
      }),
    }
  )
);