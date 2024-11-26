import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import '../styles/ClarityAnalytics.css';
import LineChart from '../components/LineChart copy';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import HeaderStudent from '../components/HeaderStudent';
// Register the necessary components for the radar chart
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ClarityAnalytics = () => {
  const { userData } = useAuth();
  const clarityTests = useMemo(() => userData?.clarityTests || [], [userData]);
  const [currentTest, setCurrentTest] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (clarityTests.length > 0) {
      const initialTest = clarityTests[0];
      setCurrentTest(initialTest.name);
      if (initialTest.dateAndMarks.length > 0) {
        setCurrentDate(initialTest.dateAndMarks[0].date);
        calculateAverageMarks(initialTest.dateAndMarks);
        updateTableData(initialTest.dateAndMarks[0].marks);
      }
    }
  }, [clarityTests]);

  const calculateAverageMarks = (dateAndMarks) => {
    const averages = dateAndMarks.map(entry => {
      const marks = Object.values(entry.marks);
      const average = marks.reduce((acc, mark) => acc + mark, 0) / marks.length;
      return { date: entry.date, average };
    });
    setMarksData(averages);
  };

  const updateTableData = (marks) => {
    const data = Object.entries(marks).map(([skill, score]) => ({ skill, score }));
    setTableData(data);
  };

  const handleTestChange = (e) => {
    const selectedTestName = e.target.value;
    setCurrentTest(selectedTestName);
    const selectedTest = clarityTests.find(test => test.name === selectedTestName);
    if (selectedTest && selectedTest.dateAndMarks.length > 0) {
      setCurrentDate(selectedTest.dateAndMarks[0].date);
      calculateAverageMarks(selectedTest.dateAndMarks);
      updateTableData(selectedTest.dateAndMarks[0].marks);
    }
  };

  const handleDateChange = (e) => {
    const selectedTest = clarityTests.find(test => test.name === currentTest);
    if (selectedTest) {
      const selectedDate = selectedTest.dateAndMarks.find(date => date.date === e.target.value);
      if (selectedDate) {
        setCurrentDate(e.target.value);
        updateTableData(selectedDate.marks);
      }
    }
  };

  // Radar chart data
  const radarData = {
    labels: tableData.map(data => data.skill),
    datasets: [
      {
        label: 'Scores',
        data: tableData.map(data => data.score),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Line Chart Title',
        padding: {
          top: 100, 
          bottom: 10,
        }
      },

      legend: {
        position: 'top',
      },
    },
    
  };
  
  const radarChartOptions = {
    plugins: {
      title: {
        display: true,
        padding: {
          top: 10, 
          bottom: 10,
        },
      },
      
    },
  };
  

  return (
    <div className='clarity-analytics-container'>
      
      <HeaderStudent header_name="Clarity Analytics" />

      <div className='inside-clarity-analytics-container'>

      <div className='metrics'>
        <div className='metric-card'>
          <div className='metric-title'>Pending Work</div>
          <div className='metric-value blue'>3</div>
        </div>
        <div className='metric-card'>
          <div className='metric-title'>Tests Completed</div>
          <div className='metric-value green'>12</div>
        </div>
        <div className='metric-card'>
          <div className='metric-title'>Status</div>
          <div className='metric-value orange'>Good</div>
        </div>
      </div>
      <div className='controls'>
        <select onChange={handleTestChange} value={currentTest}>
          {clarityTests.map(test => (
            <option key={test._id} value={test.name}>{test.name}</option>
          ))}
        </select>
        <select onChange={handleDateChange} value={currentDate}>
          {clarityTests.find(test => test.name === currentTest)?.dateAndMarks.map(date => (
            <option key={date._id} value={date.date}>
              {new Date(date.date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
      <div className='table-section'>
        <table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.skill}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Clarity Chart</h2>
    <div className='clarity-chart-container'>
      
   
        <div className='chart-section'>
          <LineChart
            xAxisData={marksData.map(data => new Date(data.date).toLocaleDateString())}
            yAxisData={marksData.map(data => data.average)}
            label="Average Marks"
            options={lineChartOptions}
            
          />
        </div>
        
        <div className='chart-section'>
          <Radar 
           title={`Personality Progress`} 
          data={radarData} 
          options={radarChartOptions}/>
          
        </div>
      </div>

    </div>
      </div>
      <div className='chart-section'>

        <LineChart
          title={`${currentTest} Progress`}
          xAxisData={marksData.map(data => new Date(data.date).toLocaleDateString())}
          yAxisData={marksData.map(data => data.average)}
          label="Average Marks"
        />

        <div>
          <Radar data={radarData} />
        </div>


      </div>
      
    


     

  );
};

export default ClarityAnalytics;