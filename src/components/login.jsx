import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./login.css";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUser(user);
      navigate("/upload"); // Redirect to UploadCSV after login
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>

      {/* Register Link */}
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="register-link">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;
