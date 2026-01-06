import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import {io} from "../lib/socket.js";
import {getRecevierSocketId} from "../lib/socket.js";

export const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUserId= req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json({users:filteredUsers});
    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}
export const getMessages= async(req,res)=>{
    try{
        const{id:userToChatId}=req.params;
        const myId= req.user._id;

       // const senderId=req.user._id;
       const me = await User.findById(myId).select("-password");
       if(!me.friends.includes(userToChatId)){
        return res.status(403).json({message:"You are not friends with this user"});
       }
        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ]
        }).sort({createdAt:1});
        res.status(200).json({messages});
    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage= async(req,res)=>{
    try{    
        const {id:receiverId}= req.params;
        const senderId=req.user._id;
        const {text,image}= req.body;
        let imageUrl;

         const sender = await User.findById(senderId);
    if (!sender.friends.includes(receiverId)) {
      return res.status(403).json({ message: "Not friends" });
    }
    
        if(image){
            const uploadedImage= await cloudinary.uploader.upload(image,{
                folder:"chat-app",
            });
            imageUrl= uploadedImage.secure_url;
        }
        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });
        await newMessage.save();
        const recevierSocketId= getRecevierSocketId(receiverId);
        if(recevierSocketId){
            io.to(recevierSocketId).emit("newMessage",newMessage);
        }
        res.status(200).json({message:newMessage});



    }    catch(err){
        res.status(500).json({message:"Internal server error"});
    }

}