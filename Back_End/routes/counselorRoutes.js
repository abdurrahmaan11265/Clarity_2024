const express = require('express');
const {
    registerCounselor,
    loginCounselor,
    assignStudent,
    assignTestToStudent,
    removeTestFromStudent,
    generateCareerOptions,
    removeCareerOption,
    editCareerOption,
    addNewCareerOption,
    analyzeSkills,
    deleteSkill,
    addSkill,
    updateSkill,
    addRequiredSkill,
    deleteRequiredSkill,
    updateRequiredSkill,
    addNote,
    removeNote,
    generateAISummary
} = require('../controllers/counselorController');
const protect = require('../middleware/authMiddleware');
const counselorAuth = require('../middleware/counselorAuth');

const router = express.Router();

router.post('/register', registerCounselor);
router.post('/login', loginCounselor);

router.post('/assign', protect, assignStudent);
router.post('/assign-test', protect, assignTestToStudent);
router.post('/remove-test', protect, removeTestFromStudent);

// career options
router.post('/generate-career-options', counselorAuth, generateCareerOptions); //ai
router.post('/remove-career-option', counselorAuth, removeCareerOption);
router.post('/edit-career-option', counselorAuth, editCareerOption);
router.post('/add-new-career-option', counselorAuth, addNewCareerOption);

// analyze skills
router.post('/analyze-skills', counselorAuth, analyzeSkills);
router.post('/add-skill', counselorAuth, addSkill);
router.post('/update-skill', counselorAuth, updateSkill);
router.post('/delete-skill', counselorAuth, deleteSkill);

// required skills
router.post('/add-required-skill', counselorAuth, addRequiredSkill);
router.post('/update-required-skill', counselorAuth, updateRequiredSkill);
router.post('/delete-required-skill', counselorAuth, deleteRequiredSkill);

// notes
router.post('/add-note', counselorAuth, addNote);
router.post('/remove-note', counselorAuth, removeNote);

// ai summary
router.post('/generate-ai-summary', counselorAuth, generateAISummary);


module.exports = router;
