import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await fetch(
        "https://flipkart-backend-em8x.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.token) {
        // 🔐 store token
        localStorage.setItem("token", data.token);

        // optional: store user email
        setUser(email);

        alert("Login successful ✅");
        navigate("/");
      } else {
        alert(data.error || "Login failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Login</h2>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "10px"
        }}
      />

      <br />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginBottom: "10px"
        }}
      />

      <br />

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "#2874f0",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;