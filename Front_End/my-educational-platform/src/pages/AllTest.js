// AllTest.js
import React, { useEffect, useState } from 'react';
import '../styles/AllTest.css';
import { useNavigate } from 'react-router-dom';
import { getAllTests } from '../services/api';
import { useAuth } from '../AuthContext';

const AllTest = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const { userData } = useAuth();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const assignedTests = userData.assignedTests || [];
                const incompleteTestIds = assignedTests
                    .filter(test => !test.completed)
                    .map(test => test.testId);
                if (!Array.isArray(incompleteTestIds) || incompleteTestIds.length === 0) {
                    console.error("No incomplete test IDs available to fetch.");
                    return;
                }

                const res = await getAllTests(incompleteTestIds);
                setTests(res.data);
            } catch (error) {
                console.error("Error fetching tests:", error);
            }
        };

        if (userData && userData.assignedTests) {
            fetchTests();
        }
    }, [userData]);

    const handleGoBack = () => {
        navigate('/student');
    };

    useEffect(() => {
        const testCards = document.querySelectorAll('.test-card');
        testCards.forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), 100 + index * 100);
        });
    }, [tests]);

    return (
        <div className='all-test-container'>
            <header>
                <div className="nav flex items-center justify-between">
                    <div className="flex items-center">
                        <button className="mr-2" aria-label="Go back" onClick={handleGoBack}>
                            <svg className="icon" viewBox="0 0 24 24">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold">Clarity Test</h1>
                    </div>
                </div>
            </header>

            <main id="mainContent" className="Main-Content">
                <div id="testGrid" className="Tests">
                    {tests.length === 0 ? (
                        <div className="no-tests-message">
                            <p>No tests available to display.</p>
                        </div>
                    ) : (
                        tests.map((test, index) => {
                            const isCompleted = userData.assignedTests.some(
                                assignedTest => assignedTest.testId === test._id && assignedTest.completed
                            );

                            if (isCompleted) {
                                return null; // Skip rendering this test if it's completed
                            }

                            return (
                                <div key={index} className="test-card">
                                    <h2>{test.name}</h2>
                                    <button onClick={() => navigate(`/test/${test._id}`)}>Start Test</button>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default AllTest;