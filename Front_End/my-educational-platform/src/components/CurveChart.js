import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const CurveChart = ({ xData, yData }) => {
  const chartData = {
    labels: xData, // X-axis labels
    datasets: [
      {
        label: 'Curved Line Dataset',
        data: yData, // Y-axis data
        borderColor: 'rgba(0, 101, 255, 0.8)', // Line color
        backgroundColor: 'rgba(0, 223, 255, 0.1)', // Fill under the line
        tension: 0.4, // Curved line
        borderWidth: 2, // Line thickness
        pointRadius: 5, // Point size
        pointBackgroundColor: 'white', // Point color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          text: 'X-Axis',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y-Axis',
        },
        beginAtZero: true, // Start Y-axis from zero
      },
    },
  };

  return (
    <div style={{ height: '200px', width: '97%' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default CurveChart;