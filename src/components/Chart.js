import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartComponent({ data }){
    // Transform data into Chart.js format
    console.log('data from chart component:', data);

    // Calculate min and max values for better Y-axis scaling
    const viewsData = data.map((item) => item.views);
    const minValue = Math.min(...viewsData);
    const maxValue = Math.max(...viewsData, 100);
    console.log('minValue:', minValue, 'maxValue:', maxValue);

    // Set yMin to 0 or 90% of minValue if minValue is not 0
    let yMin = minValue === 0 ? 0 : Math.floor(minValue * 0.95);
    yMin -= yMin % 100; // Round down to nearest hundred

    // Add 10% padding to the top
    let yMax = Math.ceil(maxValue * 1.05);
    yMax += 100 - (yMax % 100);

    const chartData = {
        labels: data.map((item) => item.date), // Dates as labels
        datasets: [
            {
                label: 'View Count',
                data: viewsData, // View counts as data points
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
                borderWidth: 2,
                tension: 0.3, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: 'Date' } },
            y: {
                title: { display: true, text: 'Views' },
                beginAtZero: false,
                min: yMin,
                max: yMax,
                ticks: {
                    precision: 0, // Use whole numbers
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};
