import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ title, xAxisData, yAxisData, label, xAxisLabel, yAxisLabel }) => {
    const data = {
        labels: xAxisData,
        datasets: [
            {
                label,
                data: yAxisData,
                borderColor: '#4A90E2', // Updated border color
                backgroundColor: 'rgba(74, 144, 226, 0.2)', // Updated background color
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#4A90E2', // Updated point color
                pointBorderColor: '#fff', // Point border color for contrast
                pointHoverBackgroundColor: '#fff', // Hover point background color
                pointHoverBorderColor: '#4A90E2', // Hover point border color
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisLabel,
                },
            },
            y: {
                title: {
                    display: true,
                    text: yAxisLabel,
                },
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="card">
            <h3>{title}</h3>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;