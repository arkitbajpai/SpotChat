import React from 'react'

const Sidebar = () => {
   const {getUsers,users,setSelectedUser, isUserLoading}= useChatStore();

   const onlineUsers=[];

   useEffect(()=>{
    getUsers();
   },[getUsers]);
   if(isUserLoading){
    
   }


  return (
    <div>
      sidebar
    </div>
  )
}

export default Sidebar
