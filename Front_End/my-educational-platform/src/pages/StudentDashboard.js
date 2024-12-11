import React from 'react';
import '../styles/StudentDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import JournalIMG from '../assests/journeling.svg';



const StudentDashboard = () => {
    const navigate = useNavigate();
    const { userData, logout } = useAuth();
    const handleAnalyticsClick = () => {
        navigate('/analytics');
    };
    const handleTestsClick = () => {
        navigate('/allTests')
    }
    const handleJournalClick = ()=>{
        navigate('/journal-page');
    }

    const handleLogout = () => {
        try {
            logout();
            navigate('/login');
        }
        catch (err) {
            console.error(err);
        }
        
    };

    const handleTestStart = () => {
        navigate('/allTests');
    };

    const handleCareerClick = () => {
        navigate('/career');
    }
    const handleAluminaiClick = () => {
        navigate('/aluminai');
    }

    return (
        <div className="student-dashboard-container">
            <header className="header">
                <div className="header-content">
                    <h1>Welcome back, {userData.name}!</h1>
                    <p>Track your learning journey and stay updated with your progress</p>
                </div>
                <div className="header-actions">
                    {/* <button className="icon-button">
                        <i className="fas fa-bell"></i>
                    </button> */}
                    <div className="user-avatar">{userData.name.substring(0, 2).toUpperCase()}</div>
                    <button className="logout-button" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card" onClick={handleAnalyticsClick}>
                    <img
                        src="https://www.edureka.co/blog/wp-content/uploads/2018/12/Data-Analytics-What-is-Data-Analytics-Edureka-1.png"
                        alt="Analytics Dashboard"
                        className="stat-image"
                    />
                    <div className="stat-content">
                        <div className="stat-header">
                            <span className="stat-icon">
                                <i className="fas fa-chart-line"></i>
                            </span>
                            <h3 className="stat-title">Analytics</h3>
                        </div>
                        <p className="stat-description">
                            Track your performance metrics, learning patterns, and progress through interactive dashboards and detailed reports.
                        </p>
                    </div>
                </div>

                <div className="stat-card" onClick={handleTestsClick}>
                    <img
                        src="https://img.freepik.com/premium-vector/job-exam-test-vector-illustration_138676-243.jpg"
                        alt="Test Overview"
                        className="stat-image"
                    />
                    <div className="stat-content">
                        <div className="stat-header">
                            <span className="stat-icon">
                                <i className="fas fa-tasks"></i>
                            </span>
                            <h3 className="stat-title">Tests</h3>
                        </div>
                        <p className="stat-description">
                            Access your upcoming assessments, practice tests, and historical performance data to improve your academic success.
                        </p>
                    </div>
                </div>

                

                <div className='go-to-journal-section stat-card' onClick={handleJournalClick}>
                <img
                        src={JournalIMG}
                        alt="Analytics Dashboard"
                        className="stat-image"
                    />
                    <div className="stat-content">
                        <div className="stat-header">
                            <span className="stat-icon">
                                <i className="fas fa-chart-line"></i>
                            </span>
                            <h3 className="stat-title">Journal</h3>
                        </div>
                        <p className="stat-description">
                            Write About your Mood , Express yourself.Track your emotions
                        </p>
                    </div>
                </div>

                <div className="stat-card" onClick={handleCareerClick}>
                    <img
                        src="https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/career-development-pillar-page-overview.png"
                        alt="Career Development"
                        className="stat-image"
                    />
                    <div className="stat-content">
                        <div className="stat-header">
                            <span className="stat-icon">
                                <i className="fas fa-briefcase"></i>
                            </span>
                            <h3 className="stat-title">Career</h3>
                        </div>
                        <p className="stat-description">
                            Explore career paths, job opportunities, and professional development resources tailored to your academic journey.
                        </p>
                    </div>
                </div>
                
            </div>

           

            <div className="main-grid">
                <div className="assessment-section">
                    <h2 className="section-header">Upcoming Assessments</h2>
                    <div className="assessment-item">
                        <div className="assessment-info">
                            <h3>Career Aptitude Test</h3>
                            <p>Due by May 15, 2024</p>
                        </div>
                        <button className="take-test-button" onClick={handleTestStart}>
                            Take Test
                        </button>
                    </div>
                    <div className="assessment-item">
                        <div className="assessment-info">
                            <h3>Personality Assessment</h3>
                            <p>Available from May 20, 2024</p>
                        </div>
                        <span className="status status-upcoming">Upcoming</span>
                    </div>
                </div>
                <div className="stat-card" onClick={handleAluminaiClick}>
                <h2 className="section-header">Alumni  Network</h2>
                    <img
                        src="https://www.univariety.com/blog/wp-content/uploads/2022/02/5853-min-scaled.jpg"
                        alt="Alumni Network"
                        className="stat-image"
                    />
                    <div className="stat-content">
                        <div className="stat-header">
                            <span className="stat-icon">
                                <i className="fas fa-user-graduate"></i>
                            </span>
                            <h3 className="stat-title">Alumni</h3>
                        </div>
                        <p className="stat-description">
                            Connect with successful graduates, access mentorship opportunities, and explore networking events within our alumni community.
                        </p>
                    </div>
                </div>
                <div className="messages-section">
                    <h2 className="section-header">Recent Messages</h2>
                    <div className="message">
                        <div className="message-header">
                            <span className="message-sender">Career Counselor</span>
                            <span className="message-time">10:30 AM</span>
                        </div>
                        <p className="message-preview">
                            Your career assessment results are ready. Let's schedule a meeting...
                        </p>
                    </div>
                    <div className="message">
                        <div className="message-header">
                            <span className="message-sender">Academic Advisor</span>
                            <span className="message-time">Yesterday</span>
                        </div>
                        <p className="message-preview">
                            Please review your course selection for next semester...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;