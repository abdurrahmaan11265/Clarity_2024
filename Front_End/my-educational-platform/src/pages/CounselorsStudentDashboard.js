// StudentProfile.js
import React, { useEffect, useState } from 'react';
import { FaUser, FaPlus, FaSyncAlt, FaGraduationCap, FaBrain, FaChartLine, FaTrash } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import '../styles/CounselorsStudentDachboard.css';
import { useAuth } from '../AuthContext';
import { getUserData, generateAISummary, addNote, removeNote } from '../services/api';
import { useSearchParams, useNavigate } from 'react-router-dom';

const StudentProfile = () => {
    const { authToken } = useAuth();
    const [studentData, setStudentData] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentData();
    }, [authToken, studentId]);

    const fetchStudentData = async () => {
        try {
            const data = await getUserData(studentId, authToken);
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const handleRefreshAnalysis = async () => {
        try {
            await generateAISummary(studentId, authToken);
            await fetchStudentData(); // Refresh the student data after generating the summary
        } catch (error) {
            console.error('Error refreshing AI summary:', error);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return; // Prevent adding empty notes
        try {
            await addNote(studentId, newNote, authToken);
            setNewNote(''); // Clear the input field
            await fetchStudentData(); // Refresh the student data to include the new note
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleRemoveNote = async (noteId) => {
        try {
            await removeNote(studentId, noteId, authToken);
            await fetchStudentData(); // Refresh the student data to reflect the removed note
        } catch (error) {
            console.error('Error removing note:', error);
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

    return (
        <div className="container-body">
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
                </section>

                <div className="content-grid-overveiw">
                    <main>
                        <section className="ai-summary">
                            <div className="summary-header">
                                <h2>AI-Generated Summary</h2>
                                <button className="refresh-button" onClick={handleRefreshAnalysis}>
                                    <FaSyncAlt />
                                    Refresh Analysis
                                </button>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: sanitizedAISummary }} />
                        </section>

                        <section className="counseling-notes">
                            <div className="notes-header">
                                <h2>Counseling Notes</h2>
                                <div className="add-note">
                                    <input
                                        type="text"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a new note"
                                        required
                                    />
                                    <button className="btn btn-outline" onClick={handleAddNote}>
                                        <FaPlus />
                                        Add Note
                                    </button>
                                </div>
                            </div>
                            {studentData.counselorNotes.map(note => (
                                <div className="note-item" key={note._id}>
                                    <div className="note-title">{note.note}</div>
                                    <div className="note-time">{new Date(note.date).toLocaleDateString()}</div>
                                    <button className="btn btn-outline" onClick={() => handleRemoveNote(note._id)}>
                                        <FaTrash />
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </section>
                    </main>

                    <aside>
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
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;