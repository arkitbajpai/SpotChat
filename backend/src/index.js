import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app,server} from './lib/socket.js';
import roomroutes from './routes/room.routes.js';

import path from "path"

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname=path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));


app.use("/api/auth",authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/messages",messageRoutes)
app.use("/api/rooms",roomroutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log('Server is running on port 5001');
    connectDB();
})