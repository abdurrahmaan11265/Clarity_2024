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
    updatePreferredCareerAndSkills,
    askCareerQuestion,
    getCareerStages,
    getSkillsComparison
} = require('../controllers/studentController');
const { getTestNames } = require('../controllers/testController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);

// subject marks
router.post('/add-class', addClass);
router.delete('/delete-class', deleteClass);
router.post('/add-subject', addSubject);
router.delete('/delete-subject', deleteSubject);
router.put('/update-marks', updateMarks); // this is for adding or updating marks of a subject's exam in a class

// tests
router.post('/get-test-names', getTestNames);

// Protected route to get user data
router.get('/user-data/:userId', protect, getUserData);

// update preferred career and skills
router.post('/update-preffered-career', updatePreferredCareerAndSkills);

// ask career question
router.post('/ask-career-question', askCareerQuestion);

// get career stages
router.post('/get-career-stages', getCareerStages);

// get skills comparison with specific career name
router.post('/get-skills-comparison', protect, getSkillsComparison);

module.exports = router;