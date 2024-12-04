import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Career.css';
import { useAuth } from '../AuthContext';
import { generateCareerOptions, analyzeSkills, updatePreferredCareer, getUserData, askCareerQuestion, addSkill, updateSkill, deleteSkill, addNewCareerOption, editCareerOption, removeCareerOption, addRequiredSkill, updateRequiredSkill, deleteRequiredSkill } from '../services/api';
import HeaderStudent from '../components/HeaderStudent';
import SearchImage from '../assests/search_sparkle.png';
import RoadmapComponent from '../components/Roadmap.js';
import { FaBrain } from 'react-icons/fa';

const ClarityCard = ({ isLoading, clarityQuestion, setClarityQuestion, handleAskClarity, clarityAnswer }) => {
    return (
        <div className="clarity-card">
            <h2>Clarity AI Assistant</h2>
            <div className="clarity-container" style={{ position: 'relative' }}>
                {isLoading ? (
                    <div className="loading-overlay">
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        <input
                            type="text"
                            className="clarity-input"
                            placeholder="Ask Clarity..."
                            value={clarityQuestion}
                            onChange={(e) => setClarityQuestion(e.target.value)}
                        />
                        <button
                            className="clarity-btn"
                            onClick={handleAskClarity}
                            disabled={isLoading}
                        >
                            Ask Clarity
                        </button>
                        <div className="clarity-output">
                            {clarityAnswer || "How can I help you today?"}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Career = () => {
    const { userData, authToken } = useAuth();
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const [studentData, setStudentData] = useState(null);
    const [showAllSkills, setShowAllSkills] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownDisabled, setDropdownDisabled] = useState(false);
    const [clarityQuestion, setClarityQuestion] = useState('');
    const [clarityAnswer, setClarityAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchStudentData = useCallback(async () => {
        try {
            const data = await getUserData(studentId, authToken);
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }, [studentId, authToken]);

    useEffect(() => {
        if (userData.userType === 'counselor' && studentId) {
            fetchStudentData();
        } else {
            setStudentData(userData);
        }
    }, [userData, studentId, fetchStudentData]);

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
        document.querySelector('.loading-overlay_for_skills').style.display = 'block';
        document.querySelector('.skills-container').style.display = 'none';

        try {
            await updatePreferredCareer(studentData._id, newCareer);
            await fetchStudentData();
            setDropdownDisabled(true);
            setShowDropdown(false);
            setTimeout(() => setDropdownDisabled(false), 1000);
        } catch (error) {
            console.error("Failed to update preferred career:", error);
        } finally {
            document.querySelector('.loading-overlay_for_skills').style.display = 'none';
            document.querySelector('.skills-container').style.display = 'flex';
        }
    };

    const handleAskClarity = async () => {
        setIsLoading(true);
        try {
            const response = await askCareerQuestion(studentData._id, clarityQuestion);
            setClarityAnswer(response.answer);
        } catch (error) {
            console.error("Failed to get answer from Clarity AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskClarityCareer = async (careerOption = '') => {
        setIsLoading(true);
        setClarityQuestion(`Tell me about ${careerOption} career?`);

        try {
            const response = await askCareerQuestion(studentData._id, `Tell me about ${careerOption} career?`);
            setClarityAnswer(response.answer);
        } catch (error) {
            console.error("Failed to get answer from Clarity AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = async () => {
        const skillName = document.querySelector('.add-skill-input').value;
        const percentage = document.querySelector('.add-skill-percentage').value;
        if (skillName === '' || percentage === '') {
            alert('Please fill all the fields');
            return;
        }
        if (percentage < 0 || percentage > 100) {
            alert('Percentage must be between 0 and 100');
            return;
        }
        try {
            await addSkill(studentData._id, skillName, percentage, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to add skill:", error);
        } finally {
            document.querySelector('.add-skill-input').value = '';
            document.querySelector('.add-skill-percentage').value = '';
        }
    };

    const handleEditSkill = async () => {
        const skillName = document.querySelector('.edit-skill-container select').value;
        const newPercentage = document.querySelector('.edit-skill-container input').value;
        if (newPercentage === '' || skillName === '') {
            alert('Please enter the new percentage and select the skill');
            return;
        }
        if (newPercentage < 0 || newPercentage > 100) {
            alert('Percentage must be between 0 and 100');
            return;
        }
        try {
            await updateSkill(studentData._id, skillName, newPercentage, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to update skill:", error);
        } finally {
            document.querySelector('.edit-skill-container input').value = '';

        }
    };

    const handleDeleteSkill = async (skillName) => {
        const confirm = window.confirm('Are you sure you want to delete this skill?');
        if (!confirm) {
            return;
        }
        try {
            await deleteSkill(studentData._id, skillName, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    const handleAddCareerOption = async () => {
        const careerName = document.querySelector('.add-career-container input[name="careerName"]').value;
        const averageSalary = document.querySelector('.add-career-container input[name="averageSalary"]').value;
        const description = document.querySelector('.add-career-container input[name="description"]').value;
        if (careerName === '' || averageSalary === '' || description === '') {
            alert('Please fill all the fields');
            return;
        }
        if (averageSalary < 0) {
            alert('Average Salary cannot be negative');
            return;
        }
        try {
            await addNewCareerOption(studentData._id, careerName, averageSalary, description, authToken);
            await fetchStudentData(); 
        } catch (error) {
            console.error("Failed to add career option:", error);
        } finally {
            document.querySelector('.add-career-container input[name="careerName"]').value = '';
            document.querySelector('.add-career-container input[name="averageSalary"]').value = '';
            document.querySelector('.add-career-container input[name="description"]').value = '';
        }
    };

    const handleEditCareerOption = async () => {
        const careerName = document.querySelector('.edit-career-container select').value;
        const newAverageSalary = document.querySelector('.edit-career-container input[name="newAverageSalary"]').value;
        const newDescription = document.querySelector('.edit-career-container input[name="newDescription"]').value;
        if (careerName === '' || newAverageSalary === '' || newDescription === '') {
            alert('Please fill all the fields');
            return;
        }
        if (newAverageSalary < 0) {
            alert('Average Salary cannot be negative');
            return;
        }
        try {
            await editCareerOption(studentData._id, careerName, newAverageSalary, newDescription, authToken);
            await fetchStudentData(); 
        } catch (error) {
            console.error("Failed to update career option:", error);
        } finally {
            document.querySelector('.edit-career-container input[name="newAverageSalary"]').value = '';
            document.querySelector('.edit-career-container input[name="newDescription"]').value = '';
        }
    };

    const handleDeleteCareerOption = async (careerName) => {
        const confirm = window.confirm('Are you sure you want to delete this career option?');
        if (!confirm) {
            return;
        }
        try {
            await removeCareerOption(studentData._id, careerName, authToken);
            await fetchStudentData(); 
        } catch (error) {
            console.error("Failed to delete career option:", error);
        }
    };

    const handleAddRequiredSkill = async () => {
        const skillName = document.querySelector('.add-required-skill-container input[name="skillName"]').value;
        const requiredPercentage = document.querySelector('.add-required-skill-container input[name="requiredPercentage"]').value;
        if (skillName === '' || requiredPercentage === '') {
            alert('Please fill all the fields');
            return;
        }
        if (requiredPercentage < 0 || requiredPercentage > 100) {
            alert('Percentage must be between 0 and 100');
            return;
        }
        try {
            await addRequiredSkill(studentData._id, skillName, requiredPercentage, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to add required skill:", error);
        } finally {
            document.querySelector('.add-required-skill-container input[name="skillName"]').value = '';
            document.querySelector('.add-required-skill-container input[name="requiredPercentage"]').value = '';
        }
    };

    const handleEditRequiredSkill = async () => {
        const skillName = document.querySelector('.edit-required-skill-container select').value;
        const newRequiredPercentage = document.querySelector('.edit-required-skill-container input[name="newRequiredPercentage"]').value;
        if (skillName === '' || newRequiredPercentage === '') {
            alert('Please fill all the fields');
            return;
        }
        if (newRequiredPercentage < 0 || newRequiredPercentage > 100) {
            alert('Percentage must be between 0 and 100');
            return;
        }
        try {
            await updateRequiredSkill(studentData._id, skillName, newRequiredPercentage, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to update required skill:", error);
        } finally {
            document.querySelector('.edit-required-skill-container input[name="newRequiredPercentage"]').value = '';
        }
    };

    const handleDeleteRequiredSkill = async (skillName) => {
        const confirm = window.confirm('Are you sure you want to delete this required skill?');
        if (!confirm) {
            return;
        }
        try {
            await deleteRequiredSkill(studentData._id, skillName, authToken);
            await fetchStudentData(); // Refresh student data
        } catch (error) {
            console.error("Failed to delete required skill:", error);
        }
    };

    const handleRefreshAnalysis = async () => {
        const confirm = window.confirm('Are you sure you want to refresh the skill analysis?');
        if (!confirm) {
            return;
        }
        await analyzeSkills(studentData._id, authToken);
        await fetchStudentData();
    };

    const handleGenerateCareerOptions = async () => {
        const confirm = window.confirm('Are you sure you want to generate career options with AI?');
        if (!confirm) {
            return;
        }
        await generateCareerOptions(studentData._id, authToken);
        await fetchStudentData();
    };

    const skillsToShow = studentData ? (showAllSkills ? studentData.skills : studentData.skills.slice(0, 7)) : [];

    return (
        <div className="career-container">
            <HeaderStudent header_name={"Career"}/>

            <main className="main-content">
                <h1 style={{ textAlign: 'center' }}>Career Dashboard</h1>
                {userData.userType === 'student' ? <p style={{ textAlign: 'center' }}>Explore your career opportunities and track your skill development with our comprehensive dashboard.</p> : <p style={{ textAlign: 'center' }}>Explore {studentData ? studentData.name : 'your'}'s career opportunities and track his skill development with our comprehensive dashboard.</p>}
                <table className="skills-table">
                    <thead>
                        <tr>
                            <th>Skills</th>
                            <th>Percent</th>
                            {userData.userType === 'counselor' && <th>{/*Action*/}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {skillsToShow.map(skill => (
                            <tr key={skill._id}>
                                <td>{skill.name}</td>
                                <td>{skill.percentage}%</td>
                                {userData.userType === 'counselor' && (
                                    <td>
                                        <button className='delete-btn' onClick={() => handleDeleteSkill(skill.name)} >Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {studentData && studentData.skills.length > 7 && (
                    <div className="seemore-analyse-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={toggleSkillsVisibility} className="see-more-btn">
                            {showAllSkills ? 'See Less' : 'See More'}
                        </button>
                        
                    </div>
                )}

                {
                    userData.userType === 'counselor' &&
                    <div className='add-edit-skill-container'>
                        <button className="refresh-button" onClick={handleRefreshAnalysis}>
                            <FaBrain />
                            Skill Analysis with AI
                        </button>
                        <div className='add-skill-container'>
                            <p>Add Skill</p>
                            <input type="text" placeholder='Add Skill' className='add-skill-input' required />
                            <input type="number" placeholder='Add Skill Percentage' className='add-skill-percentage' min={0} max={100} required />
                            <button onClick={handleAddSkill} className='add-btn'>Add</button>
                        </div>
                        <div className='edit-skill-container'>
                            <p>Edit Skill</p>
                            <select>
                                <option value="">Select Skill</option>
                                {studentData && studentData.skills.map(skill => (
                                    <option key={skill._id} value={skill.name}>{skill.name}</option>
                                ))}
                            </select>
                            <input type="text" placeholder='Edit Skill Percentage' />
                            <button onClick={handleEditSkill} className='add-btn'>Edit</button>
                        </div>
                    </div>
                }

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
                                         <th>{/*Action */}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentData && studentData.careerOptions.map(option => (
                                        <tr key={option._id}>
                                            <td>{option.name}</td>
                                            <td>{option.averageSalary ? option.averageSalary.toLocaleString() : 'N/A'}</td>
                                            <td>{option.description}</td>
                                            {userData.userType === 'student' && <td><img src={SearchImage} alt="Search" onClick={() => handleAskClarityCareer(option.name)} /></td>}

                                            {userData.userType === 'counselor' && (
                                                <td>
                                                    <button onClick={() => handleDeleteCareerOption(option.name)} className='delete-btn'>Delete</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {userData.userType === 'counselor' && (
                                <div className='add-edit-career-container'>
                                    <div className='add-career-container'>
                                        <p>Add Career Option</p>
                                        <input type="text" name="careerName" placeholder='Career Name' />
                                        <input type="number" name="averageSalary" placeholder='Average Salary' />
                                        <input type="text" name="description" placeholder='Description' />
                                        <button onClick={handleAddCareerOption} className='add-btn'>Add</button>
                                    </div>
                                    <div className='edit-career-container'>
                                        <p>Edit Career Option</p>
                                        <select>
                                            <option value="">Select Career</option>
                                            {studentData && studentData.careerOptions.map(option => (
                                                <option key={option._id} value={option.name}>{option.name}</option>
                                            ))}
                                        </select>
                                        <input type="number" name="newAverageSalary" placeholder='New Average Salary' />
                                        <input type="text" name="newDescription" placeholder='New Description' />
                                        <button onClick={handleEditCareerOption} className='add-btn'>Edit</button>
                                    </div>
                                    <button className="refresh-button" onClick={handleGenerateCareerOptions} style={{alignSelf: 'center'}} >
                                        <FaBrain />
                                        Generate Career Options with AI
                                    </button>
                                </div>
                            )}

                            {userData.userType === 'student' && <div className="notice">
                                NOTE: In order to make any changes in these, please contact your counsellor.
                            </div>}
                        </div>

                        <div className="card">
                            <h2>Preferred Career</h2>
                            <div className="current-option">
                                <p>{studentData ? studentData.prefferedCareer : 'Loading...'}</p>
                                <button
                                    className="change-btn"
                                    onClick={toggleDropdownVisibility}
                                    disabled={showDropdown}
                                >
                                    Change Option
                                </button>
                            </div>

                            <div className="select-wrapper">
                                <select
                                    className={`custom-select ${showDropdown ? '' : 'hide'}`}
                                    defaultValue=""
                                    onChange={handleCareerChange}
                                    disabled={dropdownDisabled}
                                >
                                    <option value="" disabled>Select a Career Option to Explore</option>
                                    {studentData && studentData.careerOptions.map(option => (
                                        <option key={option._id} value={option.name}>{option.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="section-divider"></div>

                            <div className="required-skills">
                                <h2 style={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginTop: '20px' }}>
                                    Required Skills and Current Proficiency Levels
                                </h2>
                                <div className="loading-overlay_for_skills" style={{ display: 'none' }}>
                                    <div className="spinner_for_skills">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                </div>

                                <div className="skills-container">
                                    {studentData && studentData.requiredSkills.map(skill => (
                                        <div className="skill" key={skill._id}>
                                            <div
                                                className="progress-circle"
                                                style={{ '--percentage': skill.currentPercentage }}
                                            >
                                                <span className="skill-name">{skill.name}</span>
                                                <span className="tooltip">{skill.currentPercentage}%</span>
                                            </div>
                                            {userData.userType === 'counselor' && (
                                                <button onClick={() => handleDeleteRequiredSkill(skill.name)} className='delete-btn'>Delete</button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {userData.userType === 'counselor' && (
                                    <div className='add-edit-required-skill-container'>
                                        <div className='add-required-skill-container'>
                                            <p>Add Required Skill</p>
                                            <input type="text" name="skillName" placeholder='Skill Name' />
                                            <input type="number" name="requiredPercentage" placeholder='Percentage' min={0} max={100} />
                                            <button onClick={handleAddRequiredSkill} className='add-btn'>Add</button>
                                        </div>
                                        <div className='edit-required-skill-container'>
                                            <p>Edit Required Skill</p>
                                            <select>
                                                <option value="">Select Skill</option>
                                                {studentData && studentData.requiredSkills.map(skill => (
                                                    <option key={skill._id} value={skill.name}>{skill.name}</option>
                                                ))}
                                            </select>
                                            <input type="number" name="newRequiredPercentage" placeholder='New Required Percentage' min={0} max={100} />
                                            <button onClick={handleEditRequiredSkill} className='add-btn'>Edit</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <ClarityCard
                        isLoading={isLoading}
                        clarityQuestion={clarityQuestion}
                        setClarityQuestion={setClarityQuestion}
                        handleAskClarity={handleAskClarity}
                        clarityAnswer={clarityAnswer}
                    />
                </div>

                <div className="roadmap-container">
                    <h2 style={{ fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginTop: '20px' }}>
                    </h2>
                    <RoadmapComponent />
                </div>

            </main>
        </div>
    );
};

export default Career;