import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route,Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingPage';
import { axiosInstance } from './lib/axios';
import {useAuthStore} from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth&& ! authUser)
    return (
  console.log(authUser),
      <div className='flex justify-center items-center h-screen'>
        <Loader className= "size-10 animate-spin"/>
        </div>
        )
  return (
    
    <div  >
      
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>:<Navigate to ="/login"/>} />
        <Route path="/signup" element={!authUser?<SignUpPage/>: <Navigate to ="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/>: <Navigate to ="/"/>} />
        <Route path="/Profile" element={ authUser? <ProfilePage/>:<Navigate to ="/login"/>} />
        <Route path="/settings" element={<SettingPage/>} />
        
      </Routes>
      <Toaster />
    </div>
  )
};

export default App
