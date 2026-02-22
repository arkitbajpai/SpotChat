import { Room } from "../models/room.model.js";

/**
 * CREATE ROOM
 * POST /api/rooms
 */
export const createRoom = async (req, res) => {
  try {
    // auth middleware guarantees this, but we still guard
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, latitude, longitude, durationHours } = req.body;

    // Validation
    if (!name || !latitude || !longitude || !durationHours) {
      return res.status(400).json({
        message: "All fields are required (name, latitude, longitude, durationHours)",
      });
    }

    const expiresAt = new Date(
      Date.now() + Number(durationHours) * 60 * 60 * 1000
    );

    const room = await Room.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
      location: {
        type: "Point",
        coordinates: [
          Number(longitude), // lng first
          Number(latitude),  // lat second
        ],
      },
      expiresAt,
    });

    return res.status(201).json(room);
  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to create room",
      error: error.message,
    });
  }
};

/**
 * GET NEARBY ROOMS
 * GET /api/rooms/nearby?latitude=xx&longitude=yy
 */
export const gerNearbyRooms = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    const rooms = await Room.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number(longitude),
              Number(latitude),
            ],
          },
          $maxDistance: 5000, // 5 km
        },
      },
      expiresAt: { $gt: new Date() },
    });

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("GET NEARBY ROOMS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch nearby rooms",
      error: error.message,
    });
  }
};

/**
 * JOIN ROOM
 * POST /api/rooms/:roomId/join
 */
export const joinRoom = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.expiresAt < new Date()) {
      return res.status(400).json({ message: "Room expired" });
    }

    if (room.members.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ message: "Already joined" });
    }

    room.members.push(userId);
    await room.save();

    return res.status(200).json({
      message: "Joined room successfully",
      roomId: room._id,
    });
  } catch (error) {
    console.error("JOIN ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to join room in rooms controller",
      error: error.message,
    });
  }
};

/**
 * LEAVE ROOM
 * POST /api/rooms/:roomId/leave
 */
export const leaveRoom = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.members.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({
        message: "You are not a member of this room",
      });
    }

    room.members = room.members.filter(
      (id) => id.toString() !== userId.toString()
    );

    await room.save();

    return res.status(200).json({
      message: "Left room successfully",
      roomId: room._id,
    });
  } catch (error) {
    console.error("LEAVE ROOM ERROR:", error);
    return res.status(500).json({
      message: "Failed to leave room",
      error: error.message,
    });
  }
};
