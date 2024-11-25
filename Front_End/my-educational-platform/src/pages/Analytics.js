import React, { useState, useEffect } from 'react';
import '../styles/Analytics.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const { userData } = useAuth();
  const [testsCompleted, setTestsCompleted] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.clarityTests) {
      const totalCompleted = userData.clarityTests.reduce((total, test) => total + (test.dateAndMarks.length), 0);
      setTestsCompleted(totalCompleted);
    }
  }, [userData]);

  const handleGoBack = () => {
    navigate('/student');
  };

  return (
    <div className='analytics-container'>
      <header>
        <div className="nav flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-2" aria-label="Go back" onClick={handleGoBack}>
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
        </div>
      </header>

      <div className="container_body">
        <div className="grid grid-cols-3 mt-4">
          <div className="card">
            <img src="https://www.oustudents.com/pageassets/support-and-advice/student-advice/academic-appeals/Academic-appeals.jpg"
              alt="Academic Analysis Cover" className="card-cover" />
            <div className="card-content">
              <h2 className="card-title">Academic Analysis</h2>
              <p className="card-description">In-depth analysis of your academic performance</p>
              <div className="metric">
                <div className="metric-label">Classes Analyzed</div>
                <div className="metric-value">{userData.classes.length}</div>
              </div>
              <div className="sub-metric">
                <span>Get Well Structed Analysis</span>
              </div>
              <div className="sub-metric">
                <span>Proper Tracking System</span>
              </div>
              <button className="button button-outline w-full mt-4" id="button-academics" onClick={() => navigate('/academic-analytics')}>View Detailed Report</button>
            </div>
          </div>

          <div className="card">
            <img src="https://thumbs.dreamstime.com/b/smart-business-man-light-bulbs-as-symbol-solutions-knowledge-concept-searching-brilliant-ideas-creative-people-321694761.jpg"
              alt="Clarity Test Analysis Cover" className="card-cover" />
            <div className="card-content">
              <h2 className="card-title">Clarity Test Analysis</h2>
              <p className="card-description">Track your progress in clarity tests and identify areas for improvement</p>
              <div className="metric">
                <div className="metric-label">Tests Completed</div>
                <div className="metric-value">{testsCompleted}</div>
              </div>
              <div className="sub-metric">
                <span>Friendly Tests</span>
              </div>
              <div className="sub-metric">
                <span>Interesting Tasks</span>
              </div>
              <button className="button button-outline w-full mt-4" id="button-clarity" onClick={() => navigate('/clarity-analytics')}>View Detailed Report</button>
            </div>
          </div>

          <div className="card">
            <img src="https://www.industryconnect.org/wp-content/uploads/2022/06/soft-skills.jpg"
              alt="Skills Analysis Cover" className="card-cover" />
            <div className="card-content">
              <h2 className="card-title">Skills Analysis</h2>
              <p className="card-description">Evaluate your skill development and track progress towards mastery</p>
              <div className="metric">
                <div className="metric-label">Skills Mastered</div>
                <div className="metric-value">12</div>
              </div>
              <div className="sub-metric">
                <span>In Progress</span>
                <span>5 skills</span>
              </div>
              <div className="sub-metric">
                <span>Next Milestone</span>
                <span className="text-yellow">3 skills away</span>
              </div>
              <button className="button button-outline w-full mt-4" id="button-skills">View Detailed Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;