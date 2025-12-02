import {Server} from 'socket.io';
import http from 'http';
import express from 'express';


const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
    }
});
//use to store online users
const userSocketMap={};



io.on("connection",(socket)=>{
    console.log('New client connected',socket.id);
    const {userId}= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    io.emit("get-online-users",Object.keys(userSocketMap))
    socket.on('disconnect',()=>{
        console.log('Client disconnected',socket.id);
        delete userSocketMap[userId];
        io.emit("get-online-users",Object.keys(userSocketMap))
    });
})

export {io,app,server};