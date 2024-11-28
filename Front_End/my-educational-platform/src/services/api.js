// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5523', // Adjust the base URL to match your backend
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registerStudent = (data) => api.post('/api/students/register', data);
export const loginStudent = (data) => api.post('/api/students/login', data);
export const getAllTests = async (testIds) => {
    try {
        const response = await api.post('/api/students/get-test-names', {
            testIds
        });
        return response;
    } catch (error) {
        console.error("Error in getAllTests:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getTest = async (testId) => {
    try {
        const response = await api.get(`/api/tests/${testId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching test:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const submitTest = async (data) => { 
    try {
        const response = await api.post(`api/tests/submit-responses`, data);
        return response.data;
    } catch (error) {
        console.error("Error submitting test:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const getUserData = async (userId, token) => {
    try {
        const response = await api.get(`/api/students/user-data/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export const updatePreferredCareer = async (studentId, preferredCareer) => {
    try {
        const response = await api.post('/api/students/update-preffered-career', {
            studentId,
            preferredCareer
        });
        return response.data;
    } catch (error) {
        console.error("Error updating preferred career:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const askCareerQuestion = async (studentId, question) => {
    try {
        const response = await api.post('/api/students/ask-career-question', {
            studentId,
            question
        });
        return response.data;
    } catch (error) {
        console.error("Error asking career question:", error.response ? error.response.data : error.message);
        throw error;
    }
};
