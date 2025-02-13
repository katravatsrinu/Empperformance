import React from "react";
import "./dashboard.css";

const TopEmployees = ({ csvData }) => {
  if (!csvData || csvData.length === 0) {
    return <p>No employee data available.</p>;
  }

  // Function to calculate employee performance
  const calculatePerformance = (data) => {
    return data
      .map((row) => {
        const totalAssigned = parseInt(row["Tasks Assigned"]) || 0;
        const totalCompleted = parseInt(row["Tasks Completed"]) || 0;
        const errorsMade = parseInt(row["Errors"]) || 0;
        const tasksOnTime = parseInt(row["Tasks Completed On Time"]) || 0;

        return {
          name: `${row["FirstName"]} ${row["LastName"]}`,
          department: row["Department"] || "N/A",
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
      })
      .filter((emp) => emp["Task Completion Rate (%)"] !== "N/A")
      .sort((a, b) => parseFloat(b["Task Completion Rate (%)"]) - parseFloat(a["Task Completion Rate (%)"]));
  };

  const sortedEmployees = calculatePerformance(csvData);
  const topPerformers = sortedEmployees.slice(0, 5);
  const worstPerformers = sortedEmployees.slice(-5).reverse(); // Get last 5 as worst performers

  // Function to apply colors based on performance
  const getColorClass = (value) => {
    if (value === "N/A") return "gray-text";
    const num = parseFloat(value);
    if (num >= 90) return "green-text";
    if (num >= 70) return "yellow-text";
    return "red-text";
  };

  return (
    <div className="dashboard-container">
      <h2>Top Employees Performance</h2>

      <div className="performance-section">
        {/* Top Performers */}
        <div className="top-performers">
          <h3>🏆 Top Performers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Task Completion Rate (%)</th>
                <th>Accuracy Rate (%)</th>
                <th>Punctuality Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((emp, index) => (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td><span className={getColorClass(emp["Task Completion Rate (%)"])}>{emp["Task Completion Rate (%)"]}</span></td>
                  <td><span className={getColorClass(emp["Accuracy Rate (%)"])}>{emp["Accuracy Rate (%)"]}</span></td>
                  <td><span className={getColorClass(emp["Punctuality Rate (%)"])}>{emp["Punctuality Rate (%)"]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Worst Performers */}
        <div className="worst-performers">
          <h3>⚠️ Worst Performers</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Task Completion Rate (%)</th>
                <th>Accuracy Rate (%)</th>
                <th>Punctuality Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {worstPerformers.map((emp, index) => (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td><span className={getColorClass(emp["Task Completion Rate (%)"])}>{emp["Task Completion Rate (%)"]}</span></td>
                  <td><span className={getColorClass(emp["Accuracy Rate (%)"])}>{emp["Accuracy Rate (%)"]}</span></td>
                  <td><span className={getColorClass(emp["Punctuality Rate (%)"])}>{emp["Punctuality Rate (%)"]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopEmployees;
