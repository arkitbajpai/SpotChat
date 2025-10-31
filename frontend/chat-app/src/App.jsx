import Navbar from './components/Navbar.jsx'

import {Routes,Route,Navigate} from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SettingPage from './pages/SettingPage.jsx';


import {useAuthStore} from './store/useAuthStore.js';
import { useEffect } from 'react';

import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import { useThemeStore } from './store/useThemeStore.js';
const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  const {theme}= useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth && !authUser)
    return (
  //console.log(authUser),
      <div className='flex items-center justify-center h-screen'>
        <Loader className= "size-10 animate-spin"/>
        </div>
        );

  return (
    
    <div data-theme={theme} >
      
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
  );
};

export default App
