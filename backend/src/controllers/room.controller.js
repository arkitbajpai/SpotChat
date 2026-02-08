import {Room} from '../models/room.model.js';
export const createRoom=async(req,res)=>{
    try{ const {name, latitude, longitude, durationHours} = req.body;
       const userId = req.user._id;
    if(!name || !latitude || !longitude || !durationHours){
        return res.status(400).json({message:'All fields are required'});
    }
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    const newRoom = await Room.create({
        createdBy: userId,
        location: {
            type: 'Point',
            coordinates: [longitude, latitude],
        },
        expiresAt,
    });
    return res.status(201).json(newRoom);}
    catch(error){
        console.error('Error creating room:', error);
        return res.status(500).json({message:'Server error at creating room1'});

    }
}



export const gerNearbyRooms = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and Longitude are required" });
    }

    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 5000,
        },
      },
      expiresAt: { $gt: new Date() },
    });

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Get nearby rooms error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch nearby rooms" });
  }
}

export const joinRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.expiresAt < new Date()) {
      return res.status(400).json({ message: "Room expired" });
    }

    if (room.members.includes(userId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    room.members.push(userId);
    await room.save();

    res.status(200).json({ message: "Joined room successfully" });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const leaveRoom = async(req,res)=>{
    try{
        const userId = req.user._id;
        const {roomId} = req.params;
        const room = await Room.findById(roomId);
        if(!room){
            return res.status(404).json({message:'Room not found'});
        }
        if(!room.members.includes(userId)){
            return res.status(400).json({message:'Not a member of the room'});
        }
        room.members = room.members.filter(memberId => memberId.toString() !== userId.toString());
        await room.save();
        return res.status(200).json({message:'Left room successfully'});
    }
    catch(error){
        console.error('Leave room error:', error);
        return res.status(500).json({message:'Internal server error'});

    }
}
