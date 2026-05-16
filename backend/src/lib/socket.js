import { Server } from "socket.io";
import http from "http";
import express from "express";
import { User } from "../models/user.model.js";

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

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // -------------------------
  // JOIN ROOM
  // -------------------------
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    

    socket.to(roomId).emit("room-user-joined", {
      userId,
      roomId,
    });
  });
  //---------
  // Typing Indicator
  //----------

  socket.on("typing", ({ roomId, username }) => {
  socket.to(roomId).emit("userTyping", username);
    });

socket.on("stopTyping", ({ roomId }) => {
  socket.to(roomId).emit("userStoppedTyping");
});

// PERSONAL CHAT TYPING
socket.on("private-typing", ({ receiverId, username }) => {

 const receiverSocketId = getRecevierSocketId(receiverId);

 if(receiverSocketId){
   io.to(receiverSocketId).emit(
      "userTyping",
      username
   );
 }

});

socket.on("private-stop-typing", ({ receiverId }) => {

 const receiverSocketId = getRecevierSocketId(receiverId);

 if(receiverSocketId){
   io.to(receiverSocketId).emit(
      "userStoppedTyping"
   );
 }

});

  // -------------------------
  // LEAVE ROOM
  // -------------------------
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    

    socket.to(roomId).emit("room-user-left", {
      userId,
      roomId,
    });
  });

  // -------------------------
  //  ROOM MESSAGE 
  // -------------------------
  socket.on("room-message", async ({ roomId, text, image }) => {
 

  const user = await User.findById(userId)
    .select("fullName profilePic");

  const message = {
    roomId,
    text,
    image,
    senderId: userId,
    sender: user, 
    createdAt: new Date(),
  };

  io.to(roomId).emit("room-message", message);

  
});

  // -------------------------
  // DISCONNECT
  // -------------------------
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    
  });
});

export { io, app, server };