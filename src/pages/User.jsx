import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';
import profile_pic from '../assets/tempuser.png';

function User() {
  return (
    <div className="User">
      {/*WIP*/}
      <Header />
      <div className='Sidebar'>
        <h1>Games</h1>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <div className='Profile'>
        <p>Rights: admin</p>
        <img src={profile_pic} alt="profile_pic" />
        <h3>USER NAME</h3>
        <div className='Line'></div>
        <h4>Bio</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
        <button className='white_btn'>change profile</button>
      </div>

      <div className='Sidebar'>
      </div>
    </div>
  );
}

export default User;