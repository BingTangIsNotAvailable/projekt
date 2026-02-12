import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hashPassword = (password) => {
    // Implement a simple hash function (for demonstration purposes only)
    let hash = 0; 
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password_hash: hashPassword(password) // Hash the password before sending
        })
        
      });

      const data = await response.json();
      console.log("Server response:", data);

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="LoginSigninApp">
      <Header/>
      <div className='Signup'>
        <div className='FormBox'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <legend>Username</legend>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

              <legend>Password</legend>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

              <legend>Email</legend>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            
            </div>
            <button type="submit" className='btn'>Sign up</button>
            <a href="/Login">Already have an account?</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;