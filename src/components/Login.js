import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        // 🔐 Store JWT token
        localStorage.setItem("token", data.token);

        // Store user email
        setUser(email);

        navigate("/");
      } else {
        setError(data.error || "Login failed ❌");
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
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
          <div className="auth-illustration">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="70" r="30" fill="rgba(255,255,255,0.2)" />
              <path d="M55 145c0-25 20-45 45-45s45 20 45 45" fill="rgba(255,255,255,0.2)" />
              <path d="M80 95l10 10 20-20" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <form onSubmit={handleLogin} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <input
                id="login-email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <label htmlFor="login-email">Email Address</label>
            </div>

            <div className="input-group">
              <input
                id="login-password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <label htmlFor="login-password">Password</label>
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
                "Login"
              )}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <Link to="/register" className="auth-switch-btn">
              New to Flipkart? Create an account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;