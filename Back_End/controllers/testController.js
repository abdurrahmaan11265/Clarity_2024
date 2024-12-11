// controllers/testController.js
const Test = require('../models/Test'); // Assuming the Test model is in the models directory
const Student = require('../models/Student');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const app = express();

app.use(express.json()); // This middleware is crucial for parsing JSON bodies

// Create a new test
exports.createTest = async (req, res) => {
    try {
        const { name, categories } = req.body; // Destructure name from the request body
        const test = new Test({ name, categories }); // Include name when creating a new Test
        await test.save();
        res.status(201).json({ message: 'Test created successfully', test });
    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const { testId } = req.params;
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        res.status(200).json(test);
    } catch (error) {
        console.error("Error fetching test:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all tests
exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        console.error("Error fetching tests:", error);
        res.status(500).json({ error: error.message });
    }
};

// New function to evaluate responses using GeminiAI
async function evaluateWithGeminiAI(responses) {
    // Simulate a prompt to GeminiAI
    const prompt = `
        You are a well-trained psychologist. Evaluate the following responses and provide the result in the format {category1: percentage scored, category2: percentage,... } and be precise you can give upto 2 decimal places:
        ${JSON.stringify(responses)}
        and only give the json format nothing else.
    `;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Placeholder for GeminiAI API call
    // Simulate the evaluation result
    const evaluationResult = await model.generateContent(prompt);

    // Return the simulated evaluation result
    return JSON.parse(evaluationResult.response.text().replace(/```json|```/g, '').trim());
}

exports.submitResponses = async (req, res) => {
    try {
        const { testId, studentId, responses } = req.body;
        console.log(responses);
        const test = await Test.findById(testId);
        const student = await Student.findById(studentId);

        if (!test || !student) {
            return res.status(404).json({ message: "Test or Student not found" });
        }

        // Check if the test is assigned to the student
        const assignedTest = student.assignedTests.find(t => t.testId.toString() === testId);
        if (!assignedTest) {
            return res.status(403).json({ message: "Test not assigned to the student" });
        }

        // Check if the test has already been completed
        if (assignedTest.completed) {
            return res.status(400).json({ message: "Test has already been completed" });
        }

        // Evaluate responses using GeminiAI
        const evaluationResult = await evaluateWithGeminiAI(responses);

        // Update student responses in Test model
        const existingResponseIndex = test.studentResponses.findIndex(response => response.studentId.toString() === studentId);
        if (existingResponseIndex !== -1) {
            test.studentResponses[existingResponseIndex].responses = responses;
        } else {
            test.studentResponses.push({ studentId, responses });
        }
        
        // Store the evaluated test result in the Student model
        const clarityTest = student.clarityTests.find(ct => ct.name === test.name);
        if (clarityTest) {
            clarityTest.dateAndMarks.push({
                date: new Date(),
                marks: evaluationResult
            });
        } else {
            student.clarityTests.push({
                name: test.name,
                dateAndMarks: [{ date: new Date(), marks: evaluationResult }]
            });
        }
        
        // Mark the test as completed
        assignedTest.completed = true;
        await test.save();
        await student.save();

        res.status(200).json({ message: "Responses submitted and evaluated successfully", evaluationResult });
    } catch (error) {
        console.error("Error submitting responses:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTestNames = async (req, res) => {
    try {
        // Access the testIds array directly
        const { testIds } = req.body;

        // Validate input
        if (!Array.isArray(testIds) || testIds.length === 0) {
            return res.status(400).json({ message: "Invalid input: testIds should be a non-empty array." });
        }

        // Convert testIds to ObjectId
        const objectIdTestIds = testIds.map(id => {
            if (mongoose.Types.ObjectId.isValid(id)) {
                return new mongoose.Types.ObjectId(id); // Use 'new' to create ObjectId
            } else {
                throw new Error(`Invalid ObjectId: ${id}`);
            }
        });

        // Fetch test names
        const testNames = await Test.find({ _id: { $in: objectIdTestIds } }).select('name');

        // Check if any test names were found
        if (testNames.length === 0) {
            return res.status(404).json({ message: "No tests found for the provided IDs." });
        }

        res.status(200).json(testNames);
    } catch (error) {
        console.error("Error fetching test names:", error);
        res.status(500).json({ error: error.message });
    }
};