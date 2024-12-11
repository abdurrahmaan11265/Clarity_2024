import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ xData, yData }) => {
  const chartData = {
    labels: xData, // X-axis labels (e.g., ['Red', 'Green'])
    datasets: [
      {
        label: 'Values', // Label for the dataset
        data: yData, // Y-axis values for the two bars
        backgroundColor: ['rgba(255, 99, 132, 0.3)', 'rgba(75, 192, 192, 0.3)'], // Red and green colors
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'], // Red and green border colors
        borderWidth: 1,
        barPercentage: 0.3, // Controls the width of the bars (smaller value = slimmer bars)
        categoryPercentage: 1, // Controls spacing between bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend since it's obvious what the bars represent
      },
      tooltip: {
        enabled: true, // Tooltips enabled to show values on hover
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categories',
        },
        grid: {
          display: false, // Hide vertical grid lines for a cleaner look
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
        },
        min:0 ,
        max: 100,
        beginAtZero: true, // Start Y-axis from zero
      },
    },
  };

  return (
    <div style={{ height: '200px', width: '97%' }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;