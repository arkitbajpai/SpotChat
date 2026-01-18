import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/", protectRoute, createRoom);

export default router;
