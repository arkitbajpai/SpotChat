import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUserId= req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("--password");
        res.status(200).json({users:filteredUsers});
    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}
export const getMeassages= async(req,res)=>{
    try{
        const{id:userToChatId}=req.params;
        const myId= req.user._id;

        const senderId=req.user._id;
        const messages= await Message.find({
            $or:[
                {senderId:senderId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:senderId},
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
        res.status(200).json({message:newMessage});



    }    catch(err){
        res.status(500).json({message:"Internal server error"});
    }

}