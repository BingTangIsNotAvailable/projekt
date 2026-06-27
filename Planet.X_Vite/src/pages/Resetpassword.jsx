import React, { useState } from 'react';
import '../App.css';
import Header from '../parts/Header';
import { useParams, useNavigate, Link } from 'react-router-dom';

function Resetpassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${window.API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      } else {
        setError(data.error || "Reset token is invalid or expired.");
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
        <div className="FormBox" style={{ minHeight: '350px' }}>
          <h2>Set New Password</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            Choose a strong password for your Planet.X account.
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <legend>New Password</legend>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                disabled={isLoading}
              />

              <legend>Confirm Password</legend>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>

            {message && <div className='success_message'>{message}</div>}
            {error && <div className="error_message">{error}</div>}

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update"}
            </button>

            <Link to="/Login" style={{ marginTop: '15px', display: 'block', textAlign: 'center' }}>
              Cancel and Return
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Resetpassword;
