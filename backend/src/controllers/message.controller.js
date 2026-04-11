import {Message} from "../models/message.model.js";
import {User} from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import {io} from "../lib/socket.js";
import {getRecevierSocketId} from "../lib/socket.js";

export const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUserId= req.user._id;
        const me = await User.findById(loggedInUserId).populate("friends","-password");
        if(!me){
            return res.status(404).json({message:"User not found"});
        }
        //const filteredUsers=await me.find({_id:{$ne:loggedInUserId}}).select("-password");
         const filteredFriends = me.friends.filter(Boolean);

    res.status(200).json({ users: filteredFriends });
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

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate("senderId", "fullName profilepic")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch room messages"
    });
  }
};

// ===============================
// SEND ROOM MESSAGE
// ===============================
export const sendRoomMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageUrl;

    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "chat-app"
      });

      imageUrl = uploadedImage.secure_url;
    }

    const newMessage = new Message({
      senderId,
      roomId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    const populatedMessage = await newMessage.populate(
      "senderId",
      "fullName profilepic"
    );

    io.to(roomId).emit("room-message", populatedMessage);

    res.status(200).json({
      message: populatedMessage
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to send room message"
    });
  }
};