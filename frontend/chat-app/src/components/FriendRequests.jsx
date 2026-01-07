import { useEffect, useState } from "react";
import {
    getFriendRequests,
    respondToFriendRequest,
} from "../lib/userApi.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { toast } from "react-hot-toast";

const FriendRequests = () => {
    const [ requests, setRequests ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    
    useEffect(() => {
        const fetchRequests = async () => {
            try{
                const data = await getFriendRequests();
                setRequests(data);
            } catch(err){
                toast.error("Failed to load friend requests");
            } finally {
                setLoading(false);
            }

        } ;
        fetchRequests();
    }, []);
}