import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRoom,getNearbyRooms } from "../controllers/room.controller.js";


const router = express.Router();

router.post("/", protectRoute, createRoom);
router.get("/nearby", protectRoute, getNearbyRooms);
export default router;
