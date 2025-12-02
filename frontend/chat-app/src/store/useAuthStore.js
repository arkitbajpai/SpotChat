import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { Socket } from 'socket.io-client';
//import { updateProfile } from '../../../../backend/src/controllers/auth.controller';
//import { login, logout } from '../../../../backend/src/controllers/auth.controller';
import { io } from 'socket.io-client';
const baseURL='http://localhost:5001';
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

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

            get().connectSocket();
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
            get().disconnectSocket();
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


    connectSocket: () => {
        const {authUser}= get();
        if(!authUser||get.socket?.connected){
        return;
        }
        const socket = io(baseURL,{
            query:{userId:authUser._id}
        }); // Adjust the URL as needed
        socket.connect();
        set({socket:socket});

        socket.on("get-online-users",(usersIds)=>{
            set({onlineUsers:usersIds});
        });

    },  

    disconnectSocket: () => {
        if(get().socket){
            get().socket.disconnect();
        }

    }


    

}));