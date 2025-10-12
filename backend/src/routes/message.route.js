import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar ,getMeassages,sendMessage} from "../controllers/message.controller.js";
const router= express.Router();

router.get("/users",protectRoute,getUsersForSidebar);
router .get("/:id",protectRoute,getMeassages);
router .get("/send/:id",protectRoute,sendMessage);




export default router;