import React, { useState } from 'react';
import '../styles/Career.css'; 
import { useAuth } from '../AuthContext'; 
import { updatePreferredCareer, getUserData, askCareerQuestion } from '../services/api'; 

const Career = () => {
    const { userData, setUserData, authToken } = useAuth(); 
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); 
    const [dropdownDisabled, setDropdownDisabled] = useState(false);
    const [clarityQuestion, setClarityQuestion] = useState('');
    const [clarityAnswer, setClarityAnswer] = useState('');

    const toggleSkillsVisibility = () => {
        setShowAllSkills(!showAllSkills);
    };

    const toggleDropdownVisibility = () => {
        if (!dropdownDisabled) {
            setShowDropdown(!showDropdown);
        }
    };

    const handleCareerChange = async (event) => {
        const newCareer = event.target.value;
        try {
            await updatePreferredCareer(userData._id, newCareer);
            const updatedUserData = await getUserData(userData._id, authToken);
            setUserData(updatedUserData);
            setDropdownDisabled(true);
            setShowDropdown(false); 
            setTimeout(() => setDropdownDisabled(false), 1000);
        } catch (error) {
            console.error("Failed to update preferred career:", error);
        }
    };

    const handleAskClarity = async () => {
        try {
            const response = await askCareerQuestion(userData._id, clarityQuestion);
            setClarityAnswer(response.answer);
        } catch (error) {
            console.error("Failed to get answer from Clarity AI:", error);
        }
    };

    const skillsToShow = showAllSkills ? userData.skills : userData.skills.slice(0, 7);

    return (
        <div>
            <header className="header">
                <div className="user-info">
                    <i className="fa fa-circle-user fa-2xs"></i>
                    <h1>Welcome, {userData.name}!</h1>
                </div>
                <button className="custom-select" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Back</button>
            </header>

            <main className="main-content">
                <h1>Career Dashboard</h1>
                <p>Explore your career opportunities and track your skill development with our comprehensive dashboard.</p>
                <table className="skills-table">
                    <thead>
                        <tr>
                            <th>Skills</th>
                            <th>Percent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skillsToShow.map(skill => (
                            <tr key={skill._id.$oid}>
                                <td>{skill.name}</td>
                                <td>{skill.percentage}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {userData.skills.length > 7 && (
                    <button onClick={toggleSkillsVisibility} className="see-more-btn">
                        {showAllSkills ? 'See Less' : 'See More'}
                    </button>
                )}

                <div className="grid-layout">
                    <div className="main-section">
                        <div className="card">
                            <h2>Career Options</h2>
                            <table className="salary-table">
                                <thead>
                                    <tr>
                                        <th>Skill Name</th>
                                        <th>Current Average Salary</th>
                                        <th>Description & Scope</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData.careerOptions.map(option => (
                                        <tr key={option._id.$oid}>
                                            <td>{option.name}</td>
                                            <td>{option.averageSalary.toLocaleString()}</td>
                                            <td>{option.description}</td>
                                            <td><i className="fa fa-search" style={{ fontSize: '20px', color: '#3b82f6' }}></i></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="notice">
                                NOTE: In order to make any changes in these, please contact your counsellor.
                            </div>
                        </div>

                        <div className="card">
                            <h2>Preferred Career</h2>
                            <div className="current-option">
                                <p>{userData.prefferedCareer}</p>
                                <button
                                    className="change-btn"
                                    onClick={toggleDropdownVisibility}
                                    disabled={showDropdown} // Disable button when dropdown is visible
                                >
                                    Change Option
                                </button>
                            </div>

                            <div className="select-wrapper">
                                <select
                                    className={`custom-select ${showDropdown ? '' : 'hide'}`}
                                    defaultValue=""
                                    onChange={handleCareerChange}
                                    disabled={dropdownDisabled} // Disable dropdown after selection
                                >
                                    <option value="" disabled>Select a Career Option to Explore</option>
                                    {userData.careerOptions.map(option => (
                                        <option key={option._id.$oid} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="section-divider"></div>

                            <div className="required-skills">
                                <h2 style={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginTop: '20px' }}>
                                    Required Skills and Current Proficiency Levels
                                </h2>
                                <div className="skills-container">
                                    {userData.requiredSkills.map(skill => (
                                        <div className="skill" key={skill._id.$oid}>
                                            <div
                                                className="progress-circle"
                                                style={{ '--percentage': skill.currentPercentage }}
                                            >
                                                <span className="skill-name">{skill.name}</span>
                                                <span className="tooltip">{skill.currentPercentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="clarity-card">
                        <h2>Clarity AI Assistant</h2>
                        <div className="clarity-container">
                            <input
                                type="text"
                                className="clarity-input"
                                placeholder="Ask Clarity..."
                                value={clarityQuestion}
                                onChange={(e) => setClarityQuestion(e.target.value)}
                            />
                            <button className="clarity-btn" onClick={handleAskClarity}>Ask Clarity</button>
                            <div className="clarity-output">
                                {clarityAnswer || "How can I help you today?"}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Career;