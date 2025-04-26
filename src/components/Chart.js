import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartComponent({ data }){
    // Transform data into Chart.js format
    console.log('data from chart component:', data);

    // Calculate min and max values for better Y-axis scaling for views
    const viewsData = data.map((item) => item.views || 0);
    const minViewValue = Math.min(...viewsData);
    const maxViewValue = Math.max(...viewsData, 100);
    console.log('minViewValue:', minViewValue, 'maxViewValue:', maxViewValue);

    // Calculate min and max values for followers
    const followersData = data.map((item) => item.followers || 0);
    const minFollowersValue = Math.min(...followersData);
    const maxFollowersValue = Math.max(...followersData, 100);
    console.log('minFollowersValue:', minFollowersValue, 'maxFollowersValue:', maxFollowersValue);

    // Set yMin for views
    let yMinViews = minViewValue === 0 ? 0 : Math.floor(minViewValue * 0.95);
    yMinViews -= yMinViews % 100; // Round down to nearest hundred

    // Add 10% padding to the top for views
    let yMaxViews = Math.ceil(maxViewValue * 1.05);
    yMaxViews += 100 - (yMaxViews % 100);

    // Set yMin for followers
    let yMinFollowers = minFollowersValue === 0 ? 0 : Math.floor(minFollowersValue * 0.95);
    yMinFollowers -= yMinFollowers % 100; // Round down to nearest hundred

    // Add 10% padding to the top for followers
    let yMaxFollowers = Math.ceil(maxFollowersValue * 1.05);
    yMaxFollowers += 100 - (yMaxFollowers % 100);

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
                yAxisID: 'y',
            },
            {
                label: 'Follower Count',
                data: followersData, // Follower counts as data points
                borderColor: 'rgba(255, 99, 132, 1)', // Pink line color
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Pink fill color
                borderWidth: 2,
                tension: 0.3, // Smooth curve
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: { title: { display: true, text: 'Date' } },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Views' },
                beginAtZero: false,
                min: yMinViews,
                max: yMaxViews,
                ticks: {
                    precision: 0, // Use whole numbers
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Followers' },
                beginAtZero: false,
                min: yMinFollowers,
                max: yMaxFollowers,
                ticks: {
                    precision: 0, // Use whole numbers
                },
                // Prevent duplicate grid lines
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};
