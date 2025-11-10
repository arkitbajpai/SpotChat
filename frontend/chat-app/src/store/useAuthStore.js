import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
//import { updateProfile } from '../../../../backend/src/controllers/auth.controller';
//import { login, logout } from '../../../../backend/src/controllers/auth.controller';

export const useAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],

    checkAuth:async()=>{
        try{

            const res= await axiosInstance.get('/auth/check');
         set({authUser:res.data});
        }
        catch(err){ 
           set({authUser:null});
        } finally{
            set({isCheckingAuth:false});
        }
    },
    
    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res= await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Signup successful");

        }
        catch(err){
             console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally{
            set({isSigningUp:false});
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res= await axiosInstance.post('/auth/login',data);
            set({authUser:res.data});
            toast.success("Login successful");
        }   catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logout successful");
        }
        catch(err){
             console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }

    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
           const res= await axiosInstance.put('/auth/update-profile',data)
            set({
                authUser:res.data 
            });
            toast.success("Profile updated successfully");

        } catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Something went wrong at updating profile");
        } finally{
            set({isUpdatingProfile:false});
        }
    },

    

}));