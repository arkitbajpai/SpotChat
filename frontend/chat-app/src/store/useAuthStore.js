import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const baseURL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ---------------- CHECK AUTH ----------------
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      // ✅ VERY IMPORTANT: connect socket after auth
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ---------------- SIGNUP ----------------
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signup successful congrats!");

      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ---------------- LOGIN ----------------
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login successful");

      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ---------------- LOGOUT ----------------
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (err) {
      toast.error("Logout failed");
    }
  },

  // ---------------- UPDATE PROFILE ----------------
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ---------------- CONNECT SOCKET ----------------
  connectSocket: () => {
    const { authUser, socket } = get();

    // prevent duplicate connections
    if (!authUser || socket?.connected) return;

    const newSocket = io(baseURL, {
      withCredentials: true,        // ✅ SEND COOKIES
      transports: ["websocket"],    // ✅ STABLE TRANSPORT
      query: {
        userId: authUser._id,       // ✅ BACKEND MAPS THIS
      },
    });

    // ✅ DEBUG LOGS (keep for now)
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      set({ onlineUsers: userIds });
    });

    set({ socket: newSocket });
  },

  // ---------------- DISCONNECT SOCKET ----------------
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
