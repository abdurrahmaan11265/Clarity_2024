import React, { useEffect, useState, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import '../styles/Notes.css';
import { useAuth } from '../AuthContext';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { getUserData, addNote, removeNote, askCareerQuestion } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import HeaderStudent from '../components/HeaderStudent';

const StudentProfile = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [studentData, setStudentData] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const { authToken } = useAuth();
    const recognitionRef = useRef(null);

    const fetchStudentData = async () => {
        try {
            const data = await getUserData(studentId, authToken);
            setStudentData(data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    useEffect(() => {
        fetchStudentData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const handleStartRecording = () => {
        setIsRecording(true);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart;
                }
            }
            setTranscript((prevTranscript) => prevTranscript + finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            if (!isRecording) {
                // If stopped manually, do nothing
                console.log('Speech recognition stopped manually');
            } else {
                // Otherwise, log and reset
                console.warn('Speech recognition ended unexpectedly');
                setIsRecording(false);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
        document.querySelector('.mic-icon').style.display = 'none';
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        document.querySelector('.mic-icon').style.display = 'block';
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    };


    const handleTranscriptChange = (e) => {
        setTranscript(e.target.value);
    };
    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        try {
            document.querySelector('.timeline-container').style.display = 'none';
            setIsAddingNote(true);
            const loader_container_notes = document.querySelector('.loading-container-notes');
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

    const handleAddNoteAI = async () => {
        if (!transcript.trim()) return;
        const prompt = `I am a Counselor and I need to generate a note for myself based on the following transcript which was recorded during my counseling session with a student: ${transcript}`;
        const response = await askCareerQuestion(prompt);
        setNewNote(response.answer);
    };

    return (
        <div className="container-notes-ai" style={{ marginTop: '0px' }}>
            <HeaderStudent header_name={"Notes"} />
            <div className="notes-left-right-container">
                <div className="left-section-notes">
                    <section className="counseling-notes">
                        <div className="notes-header">
                            <h2>Counseling Notes</h2>
                            <div className="add-note">
                                <textarea
                                    type="text"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a new note"
                                    required
                                />
                                <button
                                    className={`btn btn-outline ${isAddingNote ? '' : ''}`}
                                    onClick={handleAddNote}
                                    disabled={isAddingNote}
                                >
                                    {isAddingNote ? 'Adding...' : <><FaPlus /> Add Note</>}
                                </button>
                                <div className="loading-container-notes" style={{ display: 'none' }}>
                                    <div className="btn adding-note"></div>
                                    <div className="loading-text">New notes being Generated..</div>

                                </div>
                                <div className='category-selector'>

                                </div>
                            </div>
                        </div>
                        <div className="timeline-container">
                            {studentData && studentData.counselorNotes && studentData.counselorNotes.map((note, index) => (
                                <div className="timeline-item" key={note._id}>
                                    <div className="timeline-line"></div>
                                    <div
                                        className={`timeline-point ${index === studentData.counselorNotes.length - 1 ? 'active' : ''
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
                </div>
                <div className="right-section">
                    <div className='right-section-container'>
                        <div className={`mic-container ${isRecording ? 'recording' : ''}`}>
                            <FaMicrophone className="mic-icon" />
                            {isRecording && (
                                < div className='loading-container-record'>
                                    <div className="boxContainer">
                                        <div className="box box1"></div>
                                        <div className="box box2"></div>
                                        <div className="box box3"></div>
                                        <div className="box box4"></div>
                                        <div className="box box5"></div>
                                    </div>
                                    <div className="boxContainer">
                                        <div className="box box1"></div>
                                        <div className="box box2"></div>
                                        <div className="box box3"></div>
                                        <div className="box box4"></div>
                                        <div className="box box5"></div>
                                    </div>
                                    <div className="boxContainer">
                                        <div className="box box1"></div>
                                        <div className="box box2"></div>
                                        <div className="box box3"></div>
                                        <div className="box box4"></div>
                                        <div className="box box5"></div>
                                    </div>
                                </div>

                            )}
                        </div>
                        <button
                            className={`record-button ${isRecording ? 'stop' : 'start'}`}
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                        <div className="transcript-container">
                            <h3 style={{ textAlign: 'center' }}>Recorded Text</h3>
                            <textarea
                                onClick={handleStopRecording}
                                value={transcript}
                                onChange={handleTranscriptChange}
                                placeholder="Type or record your text here..."
                            />
                            <button onClick={handleAddNoteAI}>Analyse and create Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;