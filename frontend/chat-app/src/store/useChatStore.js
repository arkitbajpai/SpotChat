import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore =create((set,get)=>({
    messages: [],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,


    getUsers:async()=>{
        set({isUserLoading:true});
        try{
            const res = await axiosInstance.get("/messages/users");

            console.log("Users from Zustand:", res.data);

            set({users: res.data.users});
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
            set({messages:res.data});
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
    sendMessage:async(messageData)=>{
        const {selectedUser, messages}= get();
        try{
            const res= await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        }
        catch(err){
            toast.error("Failed to send message");
            console.log("sendMessage error:", err);
        }

    }


}))