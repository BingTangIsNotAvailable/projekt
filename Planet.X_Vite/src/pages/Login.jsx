import React from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useState } from "react";
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        console.log("Logged in");
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="LoginSigninApp">
      <Header />
      <div className='Login'>
        <div className='FormBox'>
          <h2>Log In</h2>
          <form onSubmit={handleLogin}>
            <div>
              <legend>Email</legend>
              <input type="email" value={email} name="email" id="email" onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />

              <legend>Password</legend>
              <input type="password" value={password} name="password" id="password" onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>

            {error && <div style={{ color: '#f87171', fontSize: '14px', margin: '10px 0', textAlign: 'center' }}>{error}</div>}

            <button type="submit" className='btn' disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log in"}
            </button>

            <Link to="/forgot-password" style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}>Forgot password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;