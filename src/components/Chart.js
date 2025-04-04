import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartComponent({ data }){
  // Transform data into Chart.js format
    const chartData = {
        labels: data.map(item => item.date), // Dates as labels
        datasets: [
        {
            label: "View Count",
            data: data.map(item => item.view_count), // View counts as data points
            borderColor: "rgba(75, 192, 192, 1)", // Line color
            backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color
            borderWidth: 2,
            tension: 0.3, // Smooth curve
        }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: "Date" } },
            y: { title: { display: true, text: "Views" }, beginAtZero: true }
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Line data={chartData} options={options} />
        </div>
    );
};
