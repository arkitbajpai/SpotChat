import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar,getMessages,sendMessage} from "../controllers/message.controller.js";
import { getRoomMessages } from "../controllers/message.controller.js";
const router= express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages);
router.get("/room/:roomId", protectRoute, getRoomMessages);




export default router;