import {User} from '../models/user.model.js';
export const sendFriendRequest=async(req,res)=>{

    try{
        const senderId=req.user._id;
        const receiverId=req.params.userId;
        if(senderId.toString()===receiverId){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }
        const receiver=await User.findById(receiverId);
        if(!receiver){
            return res.status(404).json({message:"User not found"});
        }
        if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: "Already friends" });
        }
         const alreadyRequested = receiver.friendRequests.some(
      (req) => req.from.toString() === senderId.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already sent" });
    }

    receiver.friendRequests.push({ from: senderId });
    await receiver.save();

    res.status(200).json({ message: "Friend request sent" });
    
    } catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}


export const respondToFriendRequest=async(req,res)=>{
    try{
        const receiverId=req.user._id;
        const senderId=req.params.userId;
        const {action}=req.body; // 'accept' or 'reject'
        const receiver=await User.findById(receiverId);
        const sender=await User.findById(senderId);
       if(!receiver||!sender){
        return res.status(404).json({message:"User not found"});
       }
       const requestIndex = receiver.friendRequests.findIndex(
      (req) => req.from.toString() === senderId
    );
    if (requestIndex === -1) {
      return res.status(400).json({ message: "Friend request not found" });
    }
   if (action === "accept") {
  receiver.friends.push(senderId);
  sender.friends.push(receiverId);
  receiver.friendRequests.splice(requestIndex, 1);
} else {
  receiver.friendRequests.splice(requestIndex, 1);
}
      await receiver.save();
      await sender.save();
       res.status(200).json({
      message: `Friend request ${action}ed successfully`,
    });


    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}

export const getFriendRequests=async(req,res)=>{
    try{
        const myId=req.user._id;
       const me = await User.findById(myId).populate(
      "friendRequests.from",
      "fullName email profilePic");
     
        const pendingRequests = me.friendRequests.filter(
            (req)=> req.status==="pending"
        );
        res.status(200).json({
            friendRequests:pendingRequests,
        }
        )
    }
    catch(error){
       console.error("getFriendRequests error:", error);
        res.status(500).json({message:"Internal server error"});
    }
}
export const searchUsers = async (req, res) => {
  const myId = req.user._id;
  const { query } = req.query;

  const users = await User.find({
    _id: { $ne: myId },
    fullName: { $regex: query, $options: "i" },
  }).select("fullName profilePic");

  res.json({ users });
};
export const removeFriend=async(req,res)=>{
  try{
    const myId = req.user._id;
    const friendsId= req.params.userId;
    await User.findByIdAndUpdate(myId,{
      $pull:{friends:friendsId}
    });
    await User.findByIdAndUpdate(friendsId,{
      $pull:{friends:myId}
    });
    await Message.deleteMany({
      $or:[
        {sender:myId,receiver:friendsId},
        {sender:friendsId,receiver:myId}
      ]
    });
    res.status(200).json({message:"Friend removed successfully kodos"});

  }catch(error){
    res.status(500).json({message:"Internal server error at remove friend"});
  }
}