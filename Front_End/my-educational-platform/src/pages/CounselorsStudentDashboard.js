import React, { useEffect, useState, useCallback } from 'react';
import { FaUser, FaPlus, FaSyncAlt, FaGraduationCap, FaBrain, FaChartLine, FaTrash, FaSpinner, } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import '../styles/CounselorsStudentDachboard.css';
import { useAuth } from '../AuthContext';
import { getUserData, generateAISummary, addNote, removeNote } from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HeaderStudent from '../components/HeaderStudent';
import { RiParentFill } from "react-icons/ri";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import Button from '../components/Button';
import { RiMentalHealthFill } from "react-icons/ri";




const StudentProfile = () => {
    
    
    const { authToken } = useAuth();
    const [studentData, setStudentData] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);


    const messages = [
        "Analyzing student performance trends...",
        "Updating academic insights...",
        "Processing recent academic data...",
        "Generating comprehensive analysis...",
        "Calculating performance metrics..."
    ];

    const fetchStudentData = useCallback(async () => {
        try {
            const data = await getUserData(studentId, authToken);
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }, [studentId, authToken]);
    
    useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);
    

    const handleRefreshAnalysis = async () => {
        setIsRefreshing(true);
        document.querySelector('.ai-summary').classList.add("glow-animation-ai-summary");
        const updateMessage = () => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setLoadingMessage(randomMessage);
        };
        
        const messageInterval = setInterval(updateMessage, 2000);
        updateMessage();

        try {
            await generateAISummary(studentId, authToken);
            await fetchStudentData();
        } catch (error) {
            console.error('Error refreshing AI summary:', error);
        } finally {
            setIsRefreshing(false);
            clearInterval(messageInterval);
            setLoadingMessage('');
            setTimeout(() => {
                document.querySelector('.ai-summary').classList.remove("glow-animation-ai-summary");
            }, 1000); 
        }
    };


    const handleAddNote = async () => {
        if (!newNote.trim()) return; 
    
        try {
            document.querySelector('.timeline-container').style.display = 'none';
            setIsAddingNote(true); 
            const loader_container_notes= document.querySelector('.loading-container-notes');
            loader_container_notes.style.display = 'block';
            await new Promise(resolve => setTimeout(resolve, 2000));
            await addNote(studentId, newNote, authToken);
            setNewNote(''); 
            await fetchStudentData(); 
        } catch (error) {
            console.error('Error adding note:', error);
        } finally {
            setIsAddingNote(false); 
            document.querySelector('.timeline-container').style.display = 'block';
            document.querySelector('.loading-container-notes').style.display = 'none';
        }
    };
    
    <button 
        onClick={handleAddNote}
        disabled={isAddingNote}
    >
        {isAddingNote ? 'Adding...' : <><FaPlus /> Add Note</>}
    </button>
    const handleRemoveNote = async (noteId) => {
        try {
            await removeNote(studentId, noteId, authToken);
            await fetchStudentData(); 
        } catch (error) {
            console.error('Error removing note:', error);
        }
    };

    const handleReadAloud = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            if (isSpeaking) {
                setIsSpeaking(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(
                sanitizedAISummary.replace(/<[^>]*>/g, '')
            );

            utterance.onend = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser');
        }
    };

    if (!studentData) {
        return <div>Loading...</div>;
    }

    const sanitizedAISummary = DOMPurify.sanitize(studentData.aiSummary);

    const handleAcademicAnalysis = () => {
        navigate(`/academic-analytics?studentId=${studentId}`);
    }   


    const handleClarityAnalysis = () => {
        navigate(`/clarity-analytics/?studentId=${studentId}`);
    }

    const handleSkillsAnalysis = () => {
        navigate(`/career/?studentId=${studentId}`);
    }

    const handleCounselingSession = () => {
        navigate(`/notes/?studentId=${studentId}`);
    }


    const handleMentalWellbeing = () => {
        navigate(`/journal-page/?studentId=${studentId}`);
    }

    return (
        
        <div className="container-body" style={{display: 'flex', flexDirection: 'column'}}>
            <HeaderStudent header_name={"Student Profile"} />
            <div className="container">
                <header className="profile-header">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            <FaUser />
                        </div>
                        <div className="profile-details">
                            <h1>{studentData.name}</h1>
                            <p>Grade {studentData.classes[studentData.classes.length - 1].classNo} • Student ID: #{studentData._id.slice(0, 7)}</p>
                        </div>
                    </div>
                </header>

                <section className="performance-grid">
                    <div className="performance-card" id="academicAnalysis" onClick={handleAcademicAnalysis}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FaGraduationCap style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Academic Analysis</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                            Strong performance in STEM subjects with a GPA of 3.8. Consistently performs above class average in mathematics and sciences. Areas for improvement identified in literature and writing skills.
                        </p>
                    </div>

                    <div className="performance-card" id="clarityAnalysis" onClick={handleClarityAnalysis}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FaBrain style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Clarity Analysis</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                            Demonstrates clear understanding of complex concepts. Shows strong analytical thinking abilities and can articulate ideas effectively in class discussions.
                        </p>
                    </div>

                    <div className="performance-card" id="skillsAnalysis" onClick={handleSkillsAnalysis}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FaChartLine style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Career & Skills Analysis</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                            Excellent problem-solving and critical thinking skills. Strong in team collaboration and leadership. Active participant in group projects and study sessions.
                        </p>
                    </div>
                    <div className="performance-card" id="skillsAnalysis" onClick={handleMentalWellbeing}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <RiMentalHealthFill style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Mental Wellbeing</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'left' }}>
                            Analyzing student's mental wellbeing and providing insights on how to improve it.Includes His daily Journal For better Understanding and Guidance.
                        </p>
                    </div>
                </section>

                <div className="content-grid-overveiw">
                    <main>
                    <section className="ai-summary ">
                        <div className="summary-header">
                            <h2>AI-Generated Summary</h2>
                            <button 
                                className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`} 
                                onClick={handleRefreshAnalysis}
                                disabled={isRefreshing}
                            >
                                <FaSyncAlt className={isRefreshing ? 'rotating' : ''} />
                                {isRefreshing ? 'Refreshing...' : 'Refresh Analysis'}
                            </button>
                        </div>
                        {isRefreshing ? (
                            <div className="loading-container ">
                                <div className="loading-gradient"></div>
                                <div className="loading-text">
                                    <FaSpinner className="rotating" />
                                    <p>{loadingMessage}</p>
                                </div>
                            </div>
                        ) : (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: sanitizedAISummary }} />
                                        <button onClick={handleReadAloud}>
                                            {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                                        </button>
                                    </>
                        )}
                    </section>
                        

                    <section className="counseling-notes">
            <div className="notes-header">
                <h2>Counseling Notes</h2>
                <div className="add-note" onClick={handleCounselingSession}>
                    <Button displayText="Add notes" text={<IoIosAddCircleOutline />}/>
                </div>
            </div>
    <div className="timeline-container">
        {studentData.counselorNotes.map((note, index) => (
            <div className="timeline-item" key={note._id}>
                <div className="timeline-line"></div>
                <div
                    className={`timeline-point ${
                        index === studentData.counselorNotes.length - 1 ? 'active' : ''
                    }`}
                ></div>
                <div className="timeline-content">
                    <div className="note-title">{note.note}</div>
                    <div className="note-time">{new Date(note.date).toLocaleDateString()}</div>
                    <button
                        className="btn btn-outline delete-button"
                        onClick={() => handleRemoveNote(note._id)}
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>
        ))}
    </div>
</section>           
                    </main>

                    <aside>
                       <div className='aside-container'>
                        <section className="student-info">
                            <h2 style={{ marginBottom: '1rem' }}>Student Information</h2>
                            <div className="info-item">
                                <span className="info-label">Age</span>
                                <span className="info-value">{studentData.details.age}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Gender</span>
                                <span className="info-value">{studentData.details.gender}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Address</span>
                                <span className="info-value">{studentData.details.address}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{studentData.details.phone}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{studentData.details.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Mother's Name</span>
                                <span className="info-value">{studentData.details.motherName}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Father's Name</span>
                                <span className="info-value">{studentData.details.fatherName}</span>
                            </div>
                        </section>
                        <section>
                            <div className='student-info-aside'>
                                <RiParentFill size={'35px'} color='white' style={{ backgroundColor: 'var(--primary-color)', borderRadius:'100px' ,padding:'5px' }} />
                                <h2 style={{borderBottom:'1px solid var(--border-color)', paddingBottom:'5px',}}>Sessions With Parents</h2>
                                <div className='session-no-container'>
                                <IoIosRemoveCircleOutline color='red' size={'22px'}/>
                                <h1 style={{color:'var(--primary-color', fontSize:'32px'}}>4</h1>
                                <IoIosAddCircleOutline  color='green' size={'22px'}/>
                                </div>
                                
                            </div>
                            <div className='student-info-aside'>
                                <FaUser size={'35px'} color='white' style={{ backgroundColor: 'var(--primary-color)', borderRadius:'100px' ,padding:'5px' }} />
                                <h2 style={{borderBottom:'1px solid var(--border-color)', paddingBottom:'5px',}}>Sessions With Student</h2>
                                <div className='session-no-container'>
                                <IoIosRemoveCircleOutline color='red' size={'22px'}/>
                                <h1 style={{color:'var(--primary-color', fontSize:'32px'}}>4</h1>
                                <IoIosAddCircleOutline  color='green' size={'22px'}/>
                                </div>
                                
                            </div>
                        </section>
                     </div>  
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;