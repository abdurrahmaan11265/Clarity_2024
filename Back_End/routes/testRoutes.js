// routes/testRoutes.js
const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const counselorAuth = require('../middleware/counselorAuth');


// Route to create a new test
router.post('/create', counselorAuth, testController.createTest);

// Route to get all tests
router.get('/', testController.getAllTests);

// Route to submit student responses
router.post('/submit-responses', testController.submitResponses);
router.get('/:testId', testController.getTestById);

module.exports = router;