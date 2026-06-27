import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "User created successfully. Verify email.");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to connect to the mainframe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="LoginSigninApp">
      <Header />
      <div className='Signup'>
        <div className='FormBox'>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <legend>Username</legend>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />

              <legend>Password</legend>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />

              <legend>Email</legend>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
            </div>

            {message && <div style={{ color: '#4ade80', fontSize: '14px', margin: '10px 0', textAlign: 'center' }}>{message}</div>}
            {error && <div style={{ color: '#f87171', fontSize: '14px', margin: '10px 0', textAlign: 'center' }}>{error}</div>}

            <button type="submit" className='btn' disabled={isLoading}>
              {isLoading ? "Transmitting..." : "Sign up"}
            </button>
            <a href="/Login">Already have an account?</a>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signup;