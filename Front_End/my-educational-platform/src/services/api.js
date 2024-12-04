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
export const loginCounselor = (data) => api.post('/api/counselors/login', data);
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

export const assignTestToStudent = async (studentId, testId, authToken) => {
    return api.post('/api/counselors/assign-test', { studentId, testId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const removeTestFromStudent = async (studentId, testId, authToken) => {
    return api.post('/api/counselors/remove-test', { studentId, testId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const generateCareerOptions = async (studentId, authToken) => {
    return api.post('/api/counselors/generate-career-options', { studentId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const removeCareerOption = async (studentId, careerName, authToken) => {
    return api.post('/api/counselors/remove-career-option', { studentId, careerName }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const editCareerOption = async (studentId, careerName, newAverageSalary, newDescription, authToken) => {
    return api.post('/api/counselors/edit-career-option', { studentId, careerName, newAverageSalary, newDescription }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const addNewCareerOption = async (studentId, careerName, averageSalary, description, authToken) => {
    return api.post('/api/counselors/add-new-career-option', { studentId, careerName, averageSalary, description }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const analyzeSkills = async (studentId, authToken) => {
    return api.post('/api/counselors/analyze-skills', { studentId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const addSkill = async (studentId, skillName, percentage, authToken) => {
    return api.post('/api/counselors/add-skill', { studentId, skillName, percentage }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const updateSkill = async (studentId, skillName, newPercentage, authToken) => {
    return api.post('/api/counselors/update-skill', { studentId, skillName, newPercentage }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const deleteSkill = async (studentId, skillName, authToken) => {
        return api.post('/api/counselors/delete-skill', { studentId, skillName }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const addRequiredSkill = async (studentId, skillName, percentage, authToken) => {
        return api.post('/api/counselors/add-required-skill', { studentId, skillName, percentage }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const updateRequiredSkill = async (studentId, skillName, newPercentage, authToken) => {
        return api.post('/api/counselors/update-required-skill', { studentId, skillName, newPercentage }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const deleteRequiredSkill = async (studentId, skillName, authToken) => {
    return api.post('/api/counselors/delete-required-skill', { studentId, skillName }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const addNote = async (studentId, note, authToken) => {
        return api.post('/api/counselors/add-note', { studentId, note }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const removeNote = async (studentId, noteId, authToken) => {
    return api.post('/api/counselors/remove-note', { studentId, noteId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};

export const generateAISummary = async (studentId, authToken) => {
    return api.post('/api/counselors/generate-ai-summary', { studentId }, {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    });
};