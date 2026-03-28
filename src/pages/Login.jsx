import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

    const data = await response.json();
    console.log(data);
  };


  return (
    <div className="LoginSigninApp">
      <Header/>
      <div className='Login'>
        <div className='FormBox'>
          <h2>Log In</h2>
          <form onSubmit={handleLogin}>
            <div>
              <legend>Email</legend>
              <input type="email" value={email} name="email" id="email" onChange={(e) => setEmail(e.target.value)} required/>
            
              <legend>Password</legend>
              <input type="password" value={password} name="password" id="password" onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit" className='btn'>Log in</button>

            <a href="">Forgot password?</a>
          </form>
        </div>
      </div>


      
    </div>
  );
}

export default Login;