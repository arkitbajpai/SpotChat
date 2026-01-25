import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRoom,getNearbyRooms,joinRoom,
  leaveRoom } from "../controllers/room.controller.js";


const router = express.Router();

router.post("/", protectRoute, createRoom);
router.get("/nearby", protectRoute, getNearbyRooms);
router.post("/:roomId/join", protectRoute, joinRoom);
router.post("/:roomId/leave", protectRoute, leaveRoom);

export default router;
