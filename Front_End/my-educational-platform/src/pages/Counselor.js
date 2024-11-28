import React, { useState, useEffect, useRef } from 'react';
import '../styles/Counselor.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSearch, FaUser, FaEye } from 'react-icons/fa';

const CounselorDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { logout, userData } = useAuth();
    const navigate = useNavigate();
    const animationFrameId = useRef(null);

    useEffect(() => {
        const studentCountElement = document.getElementById('studentCount');
        const schoolCountElement = document.getElementById('schoolCount');

        if (studentCountElement && schoolCountElement) {
            animateValue('studentCount', 0, userData?.assignedStudents.length, 1000);
            animateValue('schoolCount', 0, 1, 1000);
        }

        // Cleanup function to cancel animation frames
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [userData?.assignedStudents]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredStudents = userData?.assignedStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm) || student._id.includes(searchTerm)
    ) || [];

    const handleViewProfile = (studentId) => {
        navigate(`/counselors-student-dashboard?studentId=${studentId}`);
    };

    const animateValue = (id, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const element = document.getElementById(id);
            if (element) {
                element.textContent = Math.floor(progress * (end - start) + start);
            }
            if (progress < 1) {
                animationFrameId.current = window.requestAnimationFrame(step);
            }
        };
        animationFrameId.current = window.requestAnimationFrame(step);
    };

    return (
        <div className="container-body">
            <main className="main-content">
                <div className="welcome-header">
                    <div className="welcome_text">
                        <h1>Welcome back, {userData?.name}</h1>
                    </div>
                    <button className="btn btn-outline" id="logoutBtn" onClick={handleLogout}>
                        <FaSignOutAlt /> Log out
                    </button>
                </div>

                <div className="stats-section">
                    <div className="stat-card">
                        <div className="stat-value" id="studentCount">0</div>
                        <div className="stat-label" style={{ color: 'black' }}>Total Students</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value" id="schoolCount">0</div>
                        <div className="stat-label" style={{ color: 'black' }}>Total Schools</div>
                    </div>
                </div>

                <div className="students-header">
                    <h2 style={{ marginTop: '1rem', fontSize: '2rem' }}>My Students</h2>
                    <div className="search-bar">
                        <FaSearch />
                        <input type="text" placeholder="Search students..." id="searchInput" onChange={handleSearch} />
                    </div>
                </div>

                <div className="students-grid" id="studentsGrid">
                    {filteredStudents.map(student => (
                        <div className="student-card" key={student._id}>
                            <div className="student-header">
                                <div className="student-avatar"><FaUser /></div>
                                <div className="student-info">
                                    <h3>{student.name}</h3>
                                    <p>Grade {student.classes[student.classes.length - 1].classNo} | Student ID: {student._id.slice(0, 7)}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="btn btn-primary" onClick={() => handleViewProfile(student._id)}>
                                    <FaEye /> View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CounselorDashboard;