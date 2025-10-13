import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

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
            toast.error(err.response?.data?.message || "Something went wrong");
        }
        finally{
            set({isSigningUp:false});
        }
    }


}));