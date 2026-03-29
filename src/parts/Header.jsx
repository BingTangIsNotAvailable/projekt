import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Ico from '../assets/PlanetIcon.png';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");

  if (token) {
    console.log("User is logged in");
  }
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div className='header_filler'></div>
      <div className="header">
        <div className='left_header'>
          <a href="/" className="logo_box">
            <img src={Ico} alt="Icon" className='icon' />
            <h1>Planet.X</h1>
          </a>
        </div>
        <div className='right_header'>
          <button className='btn_white btn'>light/dark</button>
          {/*<Link to="/Login" className='btn_white btn'>Log In</Link>
          <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
          <Link to="/User" className='btn_white btn_round btn'>User</Link>*/}
          {token ? (
            <>
              <Link to="/User" className='btn_white btn_round btn'>User</Link>
              <button className='btn_blue btn_round btn' onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" className='btn_white btn'>Log In</Link>
              <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
            </>
          )}
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown_btn">V</button>
            {isDropdownOpen && (
              <div className="dropdown_content">
                <Link to="/Pagemaker">Create Page</Link>
                <Link to="/Gamelist">Game List</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
/*
    <div className="header">
      <div className='left_header'>
        <a href="/" className="logo_box">
          <img src={Ico} alt="Icon" className='icon' />
          <h1>Planet.X</h1>
        </a>


      </div>
      <div className='right_header'>
        <Link to="/Login" className='btn_white btn'>Log In</Link>
        <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
      </div>
    </div>
*/