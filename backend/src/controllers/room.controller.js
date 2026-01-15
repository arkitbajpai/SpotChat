import {Rooms} from '../models/rooms.model.js';
export const createRoom=async(req,res)=>{
    try{ const {name, latitude, longitude, durationHours} = req.body;
       const userId = req.user._id;
    if(!name || !latitude || !longitude || !durationHours){
        return res.status(400).json({message:'All fields are required'});
    }
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
    const newRoom = await Rooms.create({
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
        return res.status(500).json({message:'Server error'});

    }
}