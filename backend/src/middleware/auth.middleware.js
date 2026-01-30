import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const protectRoute= async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
             console.log("No JWT token found in cookies");
            return res.status(401).json({message:"Unauthorized sorry!"});
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
       // console.log("Decoded JWT:", decoded);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            console.log("User not found for token:", decoded.userId);
            return res.status(404).json({message:"Unauthorized user!" });
        }
        req.user=user;
        next();

         
    } catch(err){
         console.error("protectRoute error:", err);
        res.status(500).json({message:"Internal server error in auth middleware"});
    }
}