import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import Card from '../parts/Card';
import profile_pic from '../assets/tempuser.png';
import { useEffect } from "react";
/*
function ProtectedPage() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return <div>Secret content</div>;
}
*/

function User() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }

    fetch("http://localhost:3001/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Not authorized");
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

return (
  <div className="User">
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
      <button className='white_btn button'>change profile</button>
    </div>

    <div className='Sidebar'>
    </div>
  </div>
);
}

export default User;