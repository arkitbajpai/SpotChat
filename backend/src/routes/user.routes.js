import express from 'express';
import protectedRoute from '../middleware/auth.middleware.js';
import {sendFriendRequest, respondToFriendRequest} from '../controllers/user.controller.js';

const  router=express.Router();


router.post('/request/:userId',protectedRoute,sendFriendRequest);
export default router;

router.post(
  "/respond/:userId",
  protectRoute,
  respondToFriendRequest
);


