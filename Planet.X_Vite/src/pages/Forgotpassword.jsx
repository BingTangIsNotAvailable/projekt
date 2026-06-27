import React, { useState } from 'react';
import '../App.css';
import Header from '../parts/Header';
import { Link } from 'react-router-dom';

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "If account exists, email sent.");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
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
      <div className="Login">
        <div className="FormBox" style={{ minHeight: '300px' }}>
          <h2>Reset Password</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <legend>Email</legend>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Initialize transmission..."
                disabled={isLoading}
              />
            </div>

            {message && <div className='success_message'>{message}</div>}
            {error && <div className="error_message">{error}</div>}

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>

            <Link to="/Login" style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}>
              Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
