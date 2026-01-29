import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Map to track online users
const userSocketMap = {};

// Helper for private messaging
export function getRecevierSocketId(userId) {
  return userSocketMap[userId];
}

// =========================
// SOCKET CONNECTION
// =========================
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  // -------------------------
  // ONLINE USERS TRACKING
  // -------------------------
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to everyone
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // -------------------------
  // ROOM SOCKET EVENTS 🔥
  // -------------------------

  // Join a room (Socket.IO room)
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${userId} joined socket room ${roomId}`);

    // Optional: notify others in room
    socket.to(roomId).emit("room-user-joined", {
      userId,
      roomId,
    });
  });

  // Leave a room
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${userId} left socket ${roomId}`);

    socket.to(roomId).emit("room-user-left", {
      userId,
      roomId,
    });
  });

  // -------------------------
  // DISCONNECT
  // -------------------------
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`Socket disconnected for user ${userId}`);
  });
});

export { io, app, server };
