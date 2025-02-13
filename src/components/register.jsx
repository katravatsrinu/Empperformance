import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./register.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const navigate = useNavigate(); // Initialize navigation

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = { email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("User registered successfully! Please login.");

    // Redirect to Login Page after Registration
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
      <button onClick={handleRegister}>Register</button>

      {/* Login Link */}
      <p>
        Already have an account?{" "}
        <span className="login-link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterPage;
