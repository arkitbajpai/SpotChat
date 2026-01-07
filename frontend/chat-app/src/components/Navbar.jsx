import React from 'react'
import {useState} from 'react';
import { Link } from "react-router-dom";
import {useAuthStore}  from '../store/useAuthStore.js';
import { LogOut, MessageSquare, Settings, User, Users } from "lucide-react";
import FriendsPanel from './FriendsPanel.jsx';

const Navbar = () => {
  const {logout, authUser} = useAuthStore();
  const [showFriends, setShowFriends] = useState(false);


  return (
    <header
      className="
        border-b border-base-300 
        fixed w-full top-0 z-40 
        backdrop-blur-lg 
        bg-base-100
      "
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
               <>
               <button
                  onClick={() => setShowFriends(true)}
                  className="btn btn-sm gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Friends</span>
                </button>

                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
