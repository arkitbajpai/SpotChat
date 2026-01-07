import axios from 'axios';

export const getFriendRequests=async()=>{
 const response=await axios.get('/api/users/requests');
 return response.data;

}
export const respondToFriendRequest=async(userId,action)=>{
   await axios.post(`/api/users/respond/${userId}`,{action});
}
