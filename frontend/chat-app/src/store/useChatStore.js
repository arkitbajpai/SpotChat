import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';


export const useChatStore =create((set)=>({
    message:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,


    getUsers:async()=>{
        set({isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        }catch(err){
            toast.error("Failed to fetch users");
            console.log("getUsers error:", err);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessageLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({message:res.data});
        }catch(err){
            toast.error("Failed to fetch messages");
            console.log("getMessages error:", err);
        }finally{
            set({isMessageLoading:false});
        }
    },
    setSelectedUser:(user)=>{
        set({selectedUser:user});
    },


}))