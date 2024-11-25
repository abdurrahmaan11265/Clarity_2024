const express = require('express');
const {
    registerCounselor,
    loginCounselor,
    assignStudent,
    getAssignedStudents,
    assignTestToStudent
} = require('../controllers/counselorController');
const protect = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../utils/validators');

const router = express.Router();

router.post('/register', validateRegistration, registerCounselor);
router.post('/login', validateLogin, loginCounselor);
router.post('/assign', protect, assignStudent);
router.post('/assign-test', protect, assignTestToStudent);
router.get('/students', protect, getAssignedStudents);

module.exports = router;
