import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./dashboard.css";

const DepartmentPerformance = ({ csvData }) => {
  if (!csvData || csvData.length === 0) {
    return <p>No department data available.</p>;
  }

  // Function to calculate department-wise performance
  const departmentWiseData = csvData.reduce((acc, row) => {
    const department = row["Department"]?.trim(); // Ensure department is a valid string
    if (!department) return acc; // Skip if department is undefined or empty

    if (!acc[department]) {
      acc[department] = {
        count: 0,
        totalAssigned: 0,
        totalCompleted: 0,
        totalErrors: 0,
        totalOnTime: 0
      };
    }
    acc[department].count++;
    acc[department].totalAssigned += parseInt(row["Tasks Assigned"]) || 0;
    acc[department].totalCompleted += parseInt(row["Tasks Completed"]) || 0;
    acc[department].totalErrors += parseInt(row["Errors"]) || 0;
    acc[department].totalOnTime += parseInt(row["Tasks Completed On Time"]) || 0;

    return acc;
  }, {});

  // Convert department-wise data into an array, filtering out undefined rows
  const departmentMetrics = Object.keys(departmentWiseData)
    .filter((dept) => dept) // Remove empty or undefined department names
    .map((dept) => {
      const data = departmentWiseData[dept];
      return {
        Department: dept,
        "Task Completion Rate (%)": data.totalAssigned
          ? ((data.totalCompleted / data.totalAssigned) * 100).toFixed(2)
          : "N/A",
        "Accuracy Rate (%)": data.totalCompleted
          ? ((1 - data.totalErrors / data.totalCompleted) * 100).toFixed(2)
          : "N/A",
        "Punctuality Rate (%)": data.totalCompleted
          ? ((data.totalOnTime / data.totalCompleted) * 100).toFixed(2)
          : "N/A",
      };
    });

  if (departmentMetrics.length === 0) {
    return <p>No valid department data found.</p>;
  }

  // Function to apply color **ONLY** for calculated fields
  const getColorClass = (key, value) => {
    if (!["Task Completion Rate (%)", "Accuracy Rate (%)", "Punctuality Rate (%)"].includes(key)) {
      return "";
    }
    if (value === "N/A") return "gray-text";
    const num = parseFloat(value);
    if (num >= 90) return "green-text";
    if (num >= 70) return "yellow-text";
    return "red-text";
  };

  return (
    <div className="dashboard-container">
      <h2>Department-Wise Performance</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {Object.keys(departmentMetrics[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departmentMetrics.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.entries(row).map(([key, value], colIndex) => (
                  <td key={colIndex}>
                    <span className={getColorClass(key, value)}>{value}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPerformance;
