import React, { useState } from 'react';
import '../styles/Career.css'; 
import { useAuth } from '../AuthContext'; 
import { updatePreferredCareer, getUserData, askCareerQuestion } from '../services/api'; 
import HeaderStudent from '../components/HeaderStudent';
import SearchImage from '../assests/search_sparkle.png';
import RoadmapComponent from '../components/Roadmap.js';

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
    const [isLoading, setIsLoading] = useState(false);

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
            await updatePreferredCareer(userData._id, newCareer);
            const updatedUserData = await getUserData(userData._id, authToken);
            setUserData(updatedUserData);
            setDropdownDisabled(true);
            setShowDropdown(false);
            setTimeout(() => setDropdownDisabled(false), 1000);
        } catch (error) {
            console.error("Failed to update preferred career:", error);
        } finally{
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
            const response = await askCareerQuestion(userData._id, `Tell me about ${careerOption} career?`);
            setClarityAnswer(response.answer);
        } catch (error) {
            console.error("Failed to get answer from Clarity AI:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const skillsToShow = showAllSkills ? userData.skills : userData.skills.slice(0, 7);

    return (
        <div className="career-container">
            <HeaderStudent header_name={"Career"}/>

            <main className="main-content">
                <h1 style={{ textAlign: 'center' }}>Career Dashboard</h1>
                <p style={{ textAlign: 'center' }}>Explore your career opportunities and track your skill development with our comprehensive dashboard.</p>
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
                                            <td><img src={SearchImage} alt="Search" onClick={() => handleAskClarityCareer(option.name)} /></td>
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
                                <div className="loading-overlay_for_skills" style={{ display: 'none' }}>
                                    <div className="spinner_for_skills">
                                        <div className="bounce1"></div>
                                        <div className="bounce2"></div>
                                        <div className="bounce3"></div>
                                    </div>
                                </div>
                                
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