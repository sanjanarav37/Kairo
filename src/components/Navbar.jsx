import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Search from './search.jsx'
const Navbar = () => {
const navigate = useNavigate();
  return (
    <nav className="navbar">
      <h3 className="navbar-logo">Kairo</h3>

      <div className="navbar-links">
        <p>Home</p>
        <p>Trending</p>
        <p>Search</p>
      </div>


      <div className="room-btn" onClick={() => navigate("/room")}> 
        <button>Make a Room</button>
      </div>
  
    </nav>
  )
}

export default Navbar;
   

