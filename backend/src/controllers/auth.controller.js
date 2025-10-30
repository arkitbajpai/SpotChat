import { generateToken } from "../lib/utils.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup= async(req,res)=>{
    const {email,fullName,password}= req.body;
   try{
    if(!fullName||!email||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }
    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const salt= await bcrypt.genSalt(10);
    const hashPassword= await bcrypt.hash(password,salt);
    const newUser= new User({
        email:email,
        fullName:fullName,
        password:hashPassword,
    });

    if(newUser){
       generateToken(newUser._id,res);
       await newUser.save();
         return res.status(200).json({
        message:"User created successfully",
        user:{
            _id:newUser._id,
            email:newUser.email,
            fullName:newUser.fullName,
        }
    });

    }else{
        return res.status(400).json({message:"Invalid user data"});
    }

   }
    catch(err){
        console.error("Signup error:", err);
        res.status(500).json({message:"Internal server error at signup"});
   }
}
export const login= async(req,res)=>{
    const {email,password}= req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            console.log("User not found for email:", email);
            return res.status(400).json({message:"Invalid email or password"});
        }
      const isPasswordCorrect= await bcrypt.compare(password,user.password);
      if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid email or password"});
      }
        generateToken(user._id,res);
        res.status(200).json({
            message:"Login successful",
            user:{  
                _id:user._id,
                email:user.email,
                fullName:user.fullName,
            }
        });

    }
     catch(err){
         res.status(500).json({message:"Internal server error at login"});
    }

}
export const logout= (req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge:0,
             });
        res.status(200).json({message:"Logout successful"});
    }
    catch(err){
        res.status(500).json({message:"Internal server error at logout"});
    }
}
export const updateProfile= async(req,res)=>{
    try{
        const {profilePic}= req.body;
        const userId=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"});
        }
         const uploadedResposne =await cloudinary.uploader.upload(profilePic);
         const updatedUser= await User.findByIdAndUpdate(userId,{
            profilepic:uploadedResposne.secure_url,
         },{new:true}).select("-password");
         res.status(200).json({
            message:"Profile updated successfully",
            user:updatedUser,
         });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error at updateProfile"});
    }
}
export const checkAuth=async(req,res)=>{
   try{
   const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    

    res.status(200).json(user);
    
    } catch(err){
        res.status(500).json({message:"Internal server error at checkAuth"}); 
   }
}
