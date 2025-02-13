import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse"; // For CSV Parsing
import "./uploadCSV.css";

const UploadCSV = ({ setCsvData }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/login"); // Redirect to login if no user is logged in
    }
    // 🔥 Removed the viewer redirect so both roles stay on UploadCSV
  }, [navigate]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setStatus("");
  };

  const handleUpload = () => {
    if (!file) {
      setStatus("⚠️ Please select a CSV file.");
      return;
    }

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setCsvData(result.data); // Store CSV data in state
        setStatus("✅ File uploaded successfully!");
        setTimeout(() => navigate("/dashboard"), 1000); // Redirect to Dashboard after upload
      },
      error: () => setStatus("⚠️ Error reading file."),
    });
  };

  return (
    <div className="upload-container">
      <h1 className="upload-header">Performance Evaluation</h1>
      <p className="upload-subtitle">Upload CSV file to analyze employee performance.</p>
      <input type="file" accept=".csv" className="file-input" onChange={handleFileChange} />
      <button className="upload-btn" onClick={handleUpload}>Upload CSV</button>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
};

export default UploadCSV;
