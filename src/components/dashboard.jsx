import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./dashboard.css";
import DepartmentPerformance from "./departmentwise";
import TopEmployees from "./TopEmployees";
import EmployeePerformanceCharts from "./Charts";

const Dashboard = ({ csvData }) => {
  const pdfRef = useRef(); // Reference for capturing PDF

  if (!csvData || csvData.length === 0) {
    return <p>No data available. Please upload a CSV file.</p>;
  }

  // Function to calculate performance metrics
  const calculateMetrics = (data) => {
    return data.map((row) => {
      const totalAssigned = parseInt(row["Tasks Assigned"]) || 0;
      const totalCompleted = parseInt(row["Tasks Completed"]) || 0;
      const errorsMade = parseInt(row["Errors"]) || 0;
      const tasksOnTime = parseInt(row["Tasks Completed On Time"]) || 0;

      return {
        ...row,
        "Task Completion Rate (%)": totalAssigned
          ? ((totalCompleted / totalAssigned) * 100).toFixed(2)
          : "N/A",
        "Accuracy Rate (%)": totalCompleted
          ? ((1 - errorsMade / totalCompleted) * 100).toFixed(2)
          : "N/A",
        "Punctuality Rate (%)": totalCompleted
          ? ((tasksOnTime / totalCompleted) * 100).toFixed(2)
          : "N/A",
      };
    });
  };

  const processedData = calculateMetrics(csvData);

  // Function to apply color **ONLY** for calculated fields
  const getColorClass = (key, value) => {
    if (!["Task Completion Rate (%)", "Accuracy Rate (%)", "Punctuality Rate (%)"].includes(key)) {
      return ""; // No color for normal fields
    }

    if (value === "N/A") return "gray-text";
    const num = parseFloat(value);
    if (num >= 90) return "green-text";
    if (num >= 70) return "yellow-text";
    return "red-text";
  };

  // Export Employee Performance Table to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Performance");
    XLSX.writeFile(workbook, "Performance_Report.xlsx");
  };

  // Export **Complete Dashboard** (Table + Charts) as PDF
  const exportToPDF = () => {
    const input = pdfRef.current; // Capture the entire dashboard
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Dashboard_Report.pdf");
    });
  };

  return (
    <div className="dashboard-container" ref={pdfRef}>
      <h1 className="dashboard-header">Performance Dashboard</h1>
      <button onClick={exportToExcel} className="export-btn">Export as Excel</button>
      <button onClick={exportToPDF} className="export-btn">Export as PDF</button>

      {/* Employee Performance Table */}
      <h2>Employee Performance</h2>
      <div className="table-container">
        <table id="performanceTable">
          <thead>
            <tr>
              {Object.keys(processedData[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, rowIndex) => (
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

      {/* Other Performance Sections */}
      <DepartmentPerformance csvData={processedData} />
      <TopEmployees csvData={csvData} />
      <EmployeePerformanceCharts csvData={csvData} />
    </div>
  );
};

export default Dashboard;
