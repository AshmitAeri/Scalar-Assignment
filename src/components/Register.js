import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; /* shares the same auth styles */

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.message) {
        alert("Registration successful ✅");
        navigate("/login");
      } else {
        setError(data.error || "Registration failed ❌");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Left Panel */}
        <div className="auth-left">
          <h2>Create Account</h2>
          <p>Sign up with your email to get started and enjoy shopping!</p>
          <div className="auth-illustration">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
              <rect x="60" y="55" width="80" height="95" rx="8" fill="rgba(255,255,255,0.15)" />
              <circle cx="100" cy="85" r="15" fill="rgba(255,255,255,0.25)" />
              <rect x="75" y="110" width="50" height="5" rx="2" fill="rgba(255,255,255,0.2)" />
              <rect x="80" y="120" width="40" height="5" rx="2" fill="rgba(255,255,255,0.15)" />
              <path d="M90 135 l10 10 l20 -20" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <form onSubmit={handleRegister} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <input
                id="register-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <label htmlFor="register-email">Email Address</label>
            </div>

            <div className="input-group">
              <input
                id="register-password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <label htmlFor="register-password">Password</label>
            </div>

            <div className="input-group">
              <input
                id="register-confirm-password"
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <label htmlFor="register-confirm-password">Confirm Password</label>
            </div>

            <p className="auth-terms">
              By continuing, you agree to Flipkart's Terms of Use and Privacy
              Policy.
            </p>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner"></span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <Link to="/login" className="auth-switch-btn">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;