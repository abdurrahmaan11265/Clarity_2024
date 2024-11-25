const express = require('express');
const {
    registerStudent,
    loginStudent,
    addClass,
    deleteClass,
    addSubject,
    deleteSubject,
    updateMarks,
    getUserData,
    verifyToken,
    analyzeSkills
} = require('../controllers/studentController');
const { getTestNames } = require('../controllers/testController');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);

// subject marks
router.post('/add-class', addClass);
router.delete('/delete-class', deleteClass);
router.post('/add-subject', addSubject);
router.delete('/delete-subject', deleteSubject);
router.put('/update-marks', updateMarks);

// tests
router.post('/get-test-names', getTestNames);

// skills
router.post("/analyze-skills", analyzeSkills);

// Protected route to get user data
router.get('/user-data/:userId', verifyToken, getUserData);

module.exports = router;