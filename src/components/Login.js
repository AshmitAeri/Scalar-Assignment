import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name || !password) {
      alert("Enter name and password");
      return;
    }

    // 🔥 Simple check (demo purpose)
    if (password !== "1234") {
      alert("Wrong password (use 1234)");
      return;
    }

    setUser(name);
    navigate("/");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Login</h2>

      {/* NAME */}
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      <p style={{ marginTop: "10px", fontSize: "12px", color: "gray" }}>
        Demo password: <b>1234</b>
      </p>
    </div>
  );
}

export default Login;