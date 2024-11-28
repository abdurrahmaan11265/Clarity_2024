import React, { useState, useEffect } from 'react';
import '../styles/Career.css';
import { useAuth } from '../AuthContext';
import {
    updatePreferredCareer,
    getUserData,
    askCareerQuestion,
    addNewCareerOption,
    removeCareerOption,
    editCareerOption,
    addSkill,
    updateSkill,
    deleteSkill,
    addRequiredSkill,
    updateRequiredSkill,
    deleteRequiredSkill
} from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Career = () => {
    const { userData, setUserData, authToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const [studentData, setStudentData] = useState(null);
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownDisabled, setDropdownDisabled] = useState(false);
    const [clarityQuestion, setClarityQuestion] = useState('');
    const [clarityAnswer, setClarityAnswer] = useState('');

    const [newCareer, setNewCareer] = useState({ name: '', averageSalary: '', description: '' });
    const [newSkill, setNewSkill] = useState({ name: '', percentage: '' });
    const [newRequiredSkill, setNewRequiredSkill] = useState({ name: '', percentage: '' });

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const data = await getUserData(studentId, authToken);
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        if (userData.userType === 'counselor' && studentId) {
            fetchStudentData();
        } else {
            setStudentData(userData);
        }
    }, [userData, studentId, authToken]);

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
            await updatePreferredCareer(studentData._id, newCareer);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
            setDropdownDisabled(true);
            setShowDropdown(false);
            setTimeout(() => setDropdownDisabled(false), 1000);
        } catch (error) {
            console.error("Failed to update preferred career:", error);
        }
    };

    const handleAskClarity = async () => {
        try {
            const response = await askCareerQuestion(studentData._id, clarityQuestion);
            setClarityAnswer(response.answer);
        } catch (error) {
            console.error("Failed to get answer from Clarity AI:", error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleAddCareerOption = async () => {
        if (!newCareer.name || !newCareer.averageSalary || !newCareer.description) {
            alert("Please fill in all fields for the new career option.");
            return;
        }
        try {
            await addNewCareerOption(studentData._id, newCareer.name, newCareer.averageSalary, newCareer.description, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
            setNewCareer({ name: '', averageSalary: '', description: '' });
        } catch (error) {
            console.error("Failed to add career option:", error);
        }
    };

    const handleDeleteCareerOption = async (careerName) => {
        try {
            await removeCareerOption(studentData._id, careerName, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to delete career option:", error);
        }
    };

    const handleUpdateCareerOption = async (careerName, newAverageSalary, newDescription) => {
        const updatedAverageSalary = prompt("Enter new average salary:", newAverageSalary);
        const updatedDescription = prompt("Enter new description:", newDescription);

        if (!updatedAverageSalary || !updatedDescription) {
            alert("Please provide both a new average salary and description.");
            return;
        }

        try {
            await editCareerOption(studentData._id, careerName, updatedAverageSalary, updatedDescription, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to update career option:", error);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.name || !newSkill.percentage) {
            alert("Please fill in all fields for the new skill.");
            return;
        }
        try {
            await addSkill(studentData._id, newSkill.name, newSkill.percentage, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
            setNewSkill({ name: '', percentage: '' });
        } catch (error) {
            console.error("Failed to add skill:", error);
        }
    };

    const handleDeleteSkill = async (skillName) => {
        try {
            await deleteSkill(studentData._id, skillName, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    const handleUpdateSkill = async (skillName, currentPercentage) => {
        const updatedPercentage = prompt("Enter new percentage:", currentPercentage);

        if (!updatedPercentage) {
            alert("Please provide a new percentage.");
            return;
        }

        try {
            await updateSkill(studentData._id, skillName, updatedPercentage, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to update skill:", error);
        }
    };

    const handleAddRequiredSkill = async () => {
        if (!newRequiredSkill.name || !newRequiredSkill.percentage) {
            alert("Please fill in all fields for the new required skill.");
            return;
        }
        try {
            await addRequiredSkill(studentData._id, newRequiredSkill.name, newRequiredSkill.percentage, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
            setNewRequiredSkill({ name: '', percentage: '' });
        } catch (error) {
            console.error("Failed to add required skill:", error);
        }
    };

    const handleDeleteRequiredSkill = async (skillName) => {
        try {
            await deleteRequiredSkill(studentData._id, skillName, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to delete required skill:", error);
        }
    };

    const handleUpdateRequiredSkill = async (skillName, currentPercentage) => {
        const updatedPercentage = prompt("Enter new percentage:", currentPercentage);

        if (!updatedPercentage) {
            alert("Please provide a new percentage.");
            return;
        }

        try {
            await updateRequiredSkill(studentData._id, skillName, updatedPercentage, authToken);
            const updatedUserData = await getUserData(studentData._id, authToken);
            setStudentData(updatedUserData);
        } catch (error) {
            console.error("Failed to update required skill:", error);
        }
    };

    const skillsToShow = studentData ? (showAllSkills ? studentData.skills : studentData.skills.slice(0, 7)) : [];

    return (
        <div className="career-container">
            {studentData && (
                <>
                    <header className="header">
                        {userData.userType === 'student' && <div className="user-info">
                            <i className="fa fa-circle-user fa-2xs"></i>
                            <h1>Welcome, {studentData.name}!</h1>
                        </div>}
                        <button className="custom-select" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={handleBack}>Back</button>
                    </header>

                    <main className="main-content">
                        <h1>Career Dashboard</h1>
                        <p>Explore your career opportunities and track your skill development with our comprehensive dashboard.</p>
                        <table className="skills-table">
                            <thead>
                                <tr>
                                    <th>Skills</th>
                                    <th>Percent</th>
                                    {userData.userType === 'counselor' && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {skillsToShow.map(skill => (
                                    <tr key={skill._id.$oid}>
                                        <td>{skill.name}</td>
                                        <td>{skill.percentage}%</td>
                                        {userData.userType === 'counselor' && (
                                            <td>
                                                <button onClick={() => handleUpdateSkill(skill.name, skill.percentage)}>Edit</button>
                                                <button onClick={() => handleDeleteSkill(skill.name)}>Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {studentData.skills.length > 7 && (
                            <button onClick={toggleSkillsVisibility} className="see-more-btn">
                                {showAllSkills ? 'See Less' : 'See More'}
                            </button>
                        )}

                        {userData.userType === 'counselor' && (
                            <div className="add-skill-section">
                                <h3>Add New Skill</h3>
                                <input
                                    type="text"
                                    placeholder="Skill Name"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Percentage"
                                    value={newSkill.percentage}
                                    onChange={(e) => setNewSkill({ ...newSkill, percentage: e.target.value })}
                                />
                                <button onClick={handleAddSkill}>Add Skill</button>
                            </div>
                        )}

                        <div className="grid-layout">
                            <div className="main-section">
                                <div className="card">
                                    <h2>Career Options</h2>
                                    <table className="salary-table">
                                        <thead>
                                            <tr>
                                                <th>Career Name</th>
                                                <th>Current Average Salary</th>
                                                <th>Description & Scope</th>
                                                {userData.userType === 'counselor' && <th>Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentData.careerOptions.map(option => (
                                                <tr key={option._id.$oid}>
                                                    <td>{option.name}</td>
                                                    <td>{option.averageSalary.toLocaleString()}</td>
                                                    <td>{option.description}</td>
                                                    {userData.userType === 'counselor' && (
                                                        <td>
                                                            <button onClick={() => handleUpdateCareerOption(option.name, option.averageSalary, option.description)}>Edit</button>
                                                            <button onClick={() => handleDeleteCareerOption(option.name)}>Delete</button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {userData.userType === 'counselor' && (
                                        <div className="add-career-section">
                                            <h3>Add New Career Option</h3>
                                            <input
                                                type="text"
                                                placeholder="Career Name"
                                                value={newCareer.name}
                                                onChange={(e) => setNewCareer({ ...newCareer, name: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Average Salary"
                                                value={newCareer.averageSalary}
                                                onChange={(e) => setNewCareer({ ...newCareer, averageSalary: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={newCareer.description}
                                                onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                                            />
                                            <button onClick={handleAddCareerOption}>Add Career Option</button>
                                        </div>
                                    )}

                                    <div className="notice">
                                        NOTE: In order to make any changes in these, please contact your counsellor.
                                    </div>
                                </div>

                                <div className="card">
                                    <h2>Preferred Career</h2>
                                    <div className="current-option">
                                        <p>{studentData.prefferedCareer}</p>
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
                                            {studentData.careerOptions.map(option => (
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
                                            {studentData.requiredSkills.map(skill => (
                                                <div className="skill" key={skill._id.$oid}>
                                                    <div
                                                        className="progress-circle"
                                                        style={{ '--percentage': skill.currentPercentage }}
                                                    >
                                                        <span className="skill-name">{skill.name}</span>
                                                        <span className="tooltip">{skill.currentPercentage}%</span>
                                                    </div>
                                                    {userData.userType === 'counselor' && (
                                                        <div className="skill-actions">
                                                            <button onClick={() => handleUpdateRequiredSkill(skill.name, skill.currentPercentage)}>Edit</button>
                                                            <button onClick={() => handleDeleteRequiredSkill(skill.name)}>Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {userData.userType === 'counselor' && (
                                            <div className="add-required-skill-section">
                                                <h3>Add New Required Skill</h3>
                                                <input
                                                    type="text"
                                                    placeholder="Skill Name"
                                                    value={newRequiredSkill.name}
                                                    onChange={(e) => setNewRequiredSkill({ ...newRequiredSkill, name: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Percentage"
                                                    value={newRequiredSkill.percentage}
                                                    onChange={(e) => setNewRequiredSkill({ ...newRequiredSkill, percentage: e.target.value })}
                                                />
                                                <button onClick={handleAddRequiredSkill}>Add Required Skill</button>
                                            </div>
                                        )}
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
                </>
            )}
        </div>
    );
};

export default Career;