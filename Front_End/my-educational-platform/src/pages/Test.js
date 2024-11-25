import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Test.css';
import { getTest, submitTest, getUserData } from '../services/api';
import { useAuth } from '../AuthContext';

const Test = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { userData, setUserData, authToken } = useAuth();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});

    useEffect(() => {
        const fetchTestData = async () => {
            if (!testId) {
                console.error("No testId provided");
                setLoading(false);
                return;
            }

            try {
                const data = await getTest(testId);
                setTestData(data);

                // Initialize selectedOptions with the first option of each question
                const initialSelectedOptions = {};
                data.categories.forEach(category => {
                    category.questions.forEach(question => {
                        if (question.options.length > 0) {
                            initialSelectedOptions[question._id] = question.options[0];
                        }
                    });
                });
                setSelectedOptions(initialSelectedOptions);
            } catch (error) {
                console.error("Error fetching test data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [testId]);

    const handleOptionChange = (questionId, option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        if (!testData || !userData) {
            console.error("Test data or user data is missing.");
            return;
        }

        const responses = testData.categories.map(category => ({
            category: category.category,
            selectedOptions: category.questions.map(question => selectedOptions[question._id] || "Not Answered")
        }));

        const submissionData = {
            testId,
            studentId: userData._id,
            responses
        };

        try {
            const result = await submitTest(submissionData);
            console.log("Test submitted successfully:", result);

            // Fetch updated user data with token
            const updatedUserData = await getUserData(userData._id, authToken);
            setUserData(updatedUserData);

            navigate('/allTests');
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("There was an error submitting the test. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!testData || !testData.categories) {
        return <div>Error loading test data.</div>;
    }

    return (
        <div className="test-container">
            <header>
                <div className="header-content">
                    <div className="header-group">
                        <button className="back-button" onClick={() => window.history.back()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m12 19-7-7 7-7"/>
                                <path d="M19 12H5"/>
                            </svg>
                        </button>
                        <h1>{testData.name}</h1>
                    </div>
                    <button className="logout-button" onClick={() => alert('Logout functionality would go here')}>Logout</button>
                </div>
            </header>
            <main className="container-body">
                {testData.categories.map(category => (
                    <div key={category._id} className="category-container">
                        <h2>{category.category}</h2>
                        {category.questions.map(question => (
                            <div key={question._id} className="question">
                                <h2>{question.question}</h2>
                                <div className="options">
                                    {question.options.map((option, index) => (
                                        <label key={index} className="option">
                                            <input
                                                type="radio"
                                                name={question._id}
                                                value={option}
                                                checked={selectedOptions[question._id] === option}
                                                onChange={() => handleOptionChange(question._id, option)}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <button className="submit-button" onClick={handleSubmit}>Submit Test</button>
            </main>
        </div>
    );
};

export default Test;