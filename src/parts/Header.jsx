import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Ico from '../assets/PlanetIcon.png';

function Header() {
  return (
    <div className="header">
      <div className='left_header'>
        <a href="/"><img src={Ico} alt="Icon" className='icon' /></a>
        <a href="/"><h1>Planet.X</h1></a>


      </div>
      <div className='right_header'>
        {/*<button className='btn_round btn'></button>*/}
        <Link to="/Login" className='btn_white btn'>Log In</Link>
        <Link to="/Signup" className='btn_blue btn'>Sign Up</Link>
        {/*<button className='btn_round btn'></button>*/}
      </div>
    </div>
  );
}

export default Header;