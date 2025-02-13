import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const EmployeePerformanceCharts = ({ csvData }) => {
  if (!csvData || csvData.length === 0) {
    return <p>No data available for charts.</p>;
  }

  // Aggregate data department-wise
  const departmentData = {};
  let totalGood = 0;
  let totalBad = 0;
  let totalTasksAssigned = 0;
  let totalTasksCompleted = 0;

  csvData.forEach((row) => {
    const department = row["Department"] || "Unknown";
    const totalAssigned = parseInt(row["Tasks Assigned"]) || 0;
    const totalCompleted = parseInt(row["Tasks Completed"]) || 0;
    const errorsMade = parseInt(row["Errors"]) || 0;
    const tasksOnTime = parseInt(row["Tasks Completed On Time"]) || 0;

    if (!departmentData[department]) {
      departmentData[department] = { 
        totalAssigned: 0, 
        totalCompleted: 0, 
        errors: 0, 
        onTime: 0, 
        count: 0,
        goodPerformers: 0,
        badPerformers: 0
      };
    }

    departmentData[department].totalAssigned += totalAssigned;
    departmentData[department].totalCompleted += totalCompleted;
    departmentData[department].errors += errorsMade;
    departmentData[department].onTime += tasksOnTime;
    departmentData[department].count += 1;

    // Calculate Good% and Bad% for overall performance
    totalTasksAssigned += totalAssigned;
    totalTasksCompleted += totalCompleted;

    const completionRate = totalAssigned ? totalCompleted / totalAssigned : 0;
    
    if (completionRate >= 0.8) {
      totalGood++;
      departmentData[department].goodPerformers += 1;
    } else {
      totalBad++;
      departmentData[department].badPerformers += 1;
    }
  });

  // Data for Good% vs. Bad% Performance
  const performanceData = [
    { category: "Good Performance", value: (totalGood / csvData.length) * 100 },
    { category: "Bad Performance", value: (totalBad / csvData.length) * 100 }
  ];

  // Data for Department-wise Performance (Radar Chart)
  const departmentPerformance = Object.keys(departmentData).map((dept) => ({
    department: dept,
    completionRate: departmentData[dept].totalAssigned
      ? ((departmentData[dept].totalCompleted / departmentData[dept].totalAssigned) * 100).toFixed(2)
      : 0,
    accuracyRate: departmentData[dept].totalCompleted
      ? ((1 - departmentData[dept].errors / departmentData[dept].totalCompleted) * 100).toFixed(2)
      : 0,
    punctualityRate: departmentData[dept].totalCompleted
      ? ((departmentData[dept].onTime / departmentData[dept].totalCompleted) * 100).toFixed(2)
      : 0,
  }));

  // Data for Pending vs. Completed Tasks (Pie Chart)
  const taskStatusData = [
    { status: "Pending Tasks", count: totalTasksAssigned - totalTasksCompleted },
    { status: "Completed Tasks", count: totalTasksCompleted }
  ];

  // Data for Department-wise Good vs. Bad Performers (Updated Bar Chart)
  const departmentGoodBadData = Object.keys(departmentData).map((dept) => ({
    department: dept,
    goodPerformers: departmentData[dept].goodPerformers,
    badPerformers: departmentData[dept].badPerformers,
  }));

  // Colors for Pie Chart
  const COLORS = ["#FF9800", "#4CAF50"];

  return (
    <div className="charts-container">
      <h2>📊 Employee Performance Analytics</h2>

      {/* Bar Chart for Department-wise Good vs. Bad Performers */}
      <div className="chart-wrapper">
        <h3>📊 Department-wise Good vs. Bad Performers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentGoodBadData}>
            <XAxis dataKey="department" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="goodPerformers" fill="#4CAF50" name="Good Performers" />
            <Bar dataKey="badPerformers" fill="#F44336" name="Bad Performers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart for Department Performance */}
      <div className="chart-wrapper">
        <h3>🏢 Department-wise Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={departmentPerformance}>
            <PolarGrid />
            <PolarAngleAxis dataKey="department" />
            <PolarRadiusAxis />
            <Radar name="Completion Rate" dataKey="completionRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart for Pending vs. Completed Tasks */}
      <div className="chart-wrapper">
        <h3>📌 Pending vs. Completed Tasks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={taskStatusData} 
              dataKey="count" 
              nameKey="status" 
              cx="50%" 
              cy="50%" 
              outerRadius={100} 
              fill="#82ca9d" 
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {taskStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeePerformanceCharts;
