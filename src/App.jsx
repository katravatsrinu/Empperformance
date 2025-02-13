import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UploadCSV from "./components/uploadCSV";
import LoginPage from "./components/login";
import RegisterPage from "./components/register";
import Dashboard from "./components/dashboard";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [csvData, setCsvData] = useState([]); // Store uploaded CSV data

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/upload" 
          element={user ? <UploadCSV setCsvData={setCsvData} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute user={user}><Dashboard csvData={csvData} /></ProtectedRoute>} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
