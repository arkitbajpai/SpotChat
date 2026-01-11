import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendRequests, searchUsers
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendFriendRequest);
router.post("/respond/:userId", protectRoute, respondToFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.get("/search", protectRoute, searchUsers);

export default router; // ✅ EXPORT AT THE END
