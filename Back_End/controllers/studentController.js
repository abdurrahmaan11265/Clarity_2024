const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Register Student
exports.registerStudent = async (req, res) => {
    try {
        const { name, details, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Student.create({ name, details, password: hashedPassword });
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login Student
exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ 'details.email': email });
        if (student && (await bcrypt.compare(password, student.password))) {
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, student });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Add a class
exports.addClass = async (req, res) => {
    try {
        const { studentId, classNo } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        if (student.classes.some((cls) => cls.classNo === classNo)) {
            return res.status(400).json({ message: 'Class already exists' });
        }

        student.classes.push({ classNo, subjects: [] });
        await student.save();

        res.status(201).json({ message: 'Class added successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a class
exports.deleteClass = async (req, res) => {
    try {
        const { studentId, classNo } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        student.classes = student.classes.filter((cls) => cls.classNo !== classNo);
        await student.save();

        res.status(200).json({ message: 'Class deleted successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a subject to a class
exports.addSubject = async (req, res) => {
    try {
        const { studentId, classNo, subjectName, exams } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const classObj = student.classes.find((cls) => cls.classNo === classNo);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        if (classObj.subjects.some((subj) => subj.name === subjectName)) {
            return res.status(400).json({ message: 'Subject already exists' });
        }

        classObj.subjects.push({ name: subjectName.toLowerCase(), examNameAndMarks: exams || [] });
        await student.save();

        res.status(201).json({ message: 'Subject added successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a subject from a class
exports.deleteSubject = async (req, res) => {
    try {
        const { studentId, classNo, subjectName } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const classObj = student.classes.find((cls) => cls.classNo === classNo);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        classObj.subjects = classObj.subjects.filter((subj) => subj.name !== subjectName.toLowerCase());
        await student.save();

        res.status(200).json({ message: 'Subject deleted successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update marks for a subject in a class
exports.updateMarks = async (req, res) => {
    try {
        const { studentId, classNo, subjectName, examName, totalMarks, gainedMarks } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const classObj = student.classes.find((cls) => cls.classNo === classNo);
        if (!classObj) return res.status(404).json({ message: 'Class not found' });

        const subjectObj = classObj.subjects.find((subj) => subj.name === subjectName);
        if (!subjectObj) return res.status(404).json({ message: 'Subject not found' });

        const examObj = subjectObj.examNameAndMarks.find((exam) => exam.name === examName);
        if (examObj) {
            totalMarks ? (examObj.totalMarks = totalMarks) : null;
            gainedMarks ? (examObj.gainedMarks = gainedMarks) : null;
        } else {
            subjectObj.examNameAndMarks.push({ name: examName.split(' ').join('').toLowerCase(), totalMarks, gainedMarks });
        }

        await student.save();

        res.status(200).json({ message: 'Marks updated successfully', student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // Add a clarity test
// exports.addClarityTest = async (req, res) => {
//     try {
//         const { studentId, name } = req.body;

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         if (student.clarityTests.some((test) => test.name === name)) {
//             return res.status(400).json({ message: 'Clarity test already exists' });
//         }

//         student.clarityTests.push({ name: name.toLowerCase(), dateAndMarks: [] });
//         await student.save();

//         res.status(201).json({ message: 'Clarity test added successfully', student });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a clarity test
// exports.deleteClarityTest = async (req, res) => {
//     try {
//         const { studentId, name } = req.body;

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         student.clarityTests = student.clarityTests.filter((test) => test.name !== name);
//         await student.save();

//         res.status(200).json({ message: 'Clarity test deleted successfully', student });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Add marks for a specific date
// exports.addMarksForDate = async (req, res) => {
//     try {
//         const { studentId, name, date, marks } = req.body;

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         const clarityTest = student.clarityTests.find((test) => test.name === name);
//         if (!clarityTest) return res.status(404).json({ message: 'Clarity test not found' });

//         if (clarityTest.dateAndMarks.some((entry) => entry.date.toISOString() === new Date(date).toISOString())) {
//             return res.status(400).json({ message: 'Marks for the given date already exist' });
//         }

//         clarityTest.dateAndMarks.push({ date, marks });
//         await student.save();

//         res.status(201).json({ message: 'Marks added for the date successfully', student });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update marks for a specific date
// exports.updateMarksForDate = async (req, res) => {
//     try {
//         const { studentId, name, date, marks } = req.body;

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         const clarityTest = student.clarityTests.find((test) => test.name === name);
//         if (!clarityTest) return res.status(404).json({ message: 'Clarity test not found' });

//         const dateEntry = clarityTest.dateAndMarks.find(
//             (entry) => entry.date.toISOString() === new Date(date).toISOString()
//         );
//         if (!dateEntry) return res.status(404).json({ message: 'Date entry not found' });

//         dateEntry.marks = { ...dateEntry.marks, ...marks };
//         await student.save();

//         res.status(200).json({ message: 'Marks updated successfully', student });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a specific date entry
// exports.deleteDateEntry = async (req, res) => {
//     try {
//         const { studentId, name, date } = req.body;

//         const student = await Student.findById(studentId);
//         if (!student) return res.status(404).json({ message: 'Student not found' });

//         const clarityTest = student.clarityTests.find((test) => test.name === name);
//         if (!clarityTest) return res.status(404).json({ message: 'Clarity test not found' });

//         clarityTest.dateAndMarks = clarityTest.dateAndMarks.filter(
//             (entry) => entry.date.toISOString() !== new Date(date).toISOString()
//         );
//         await student.save();

//         res.status(200).json({ message: 'Date entry deleted successfully', student });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

async function inferSkillsFromTextWithGemini(prompt) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();
        // console.log(prompt);
        // console.log(responseText);

        return responseText; // Return the cleaned text
    } catch (error) {
        console.error("Error generating content:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}

exports.analyzeSkills = async (req, res) => {
    try {
        const { studentId } = req.body;

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Combine all clarity test scores into a prompt
        let prompt = "Based on the following test scores, identify the skills and assign a percentage to each skill, search new skills which can be derived from the score:\n";
        for (const test of student.clarityTests) {
            for (const entry of test.dateAndMarks) {
                const marks = entry.marks;
                prompt += `Test: ${test.name}, Date: ${entry.date.toISOString()}, Scores: ${JSON.stringify(marks)}. `;
            }
        }

        prompt += "\nOutput the skills in the json format: 'Skill: percentage'. and don't give anything else rather than that json.";

        // Call Gemini API to infer skills
        const skillsText = await inferSkillsFromTextWithGemini(prompt);

        // Parse the JSON response directly
        const skillsObject = JSON.parse(skillsText);

        // Convert the skills object into an array
        const skillsArray = Object.entries(skillsObject).map(([name, percentage]) => ({
            name,
            percentage: parseFloat(percentage),
        }));

        // Update the student's skills
        student.skills = skillsArray;
        await student.save();

        res.status(200).json({
            message: "Skills analyzed and updated successfully",
            skills: student.skills,
        });
    } catch (error) {
        console.error("Error in analyzeSkills:", error);
        res.status(500).json({ error: error.message });
    }
};

// Middleware to verify JWT
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};

// Route to get user data
exports.getUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        const student = await Student.findById(userId);

        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
};

async function generateCareerOptionsWithGemini(skills) {
    const prompt = `Based on the following skills and their percentages, suggest career options with average salary and description:\n${JSON.stringify(skills)}\nOutput the career options in the JSON format: [{"name": "Career Name", "averageSalary": 50000, "description": "Career description"}]. and dont give anything else rather than that json.`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();
        // console.log(prompt);
        // console.log(responseText);

        return JSON.parse(responseText); // Return the parsed JSON
    } catch (error) {
        console.error("Error generating career options:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}

exports.generateCareerOptions = async (req, res) => {
    try {
        const { studentId } = req.body;

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Use the student's skills to generate career options
        const careerOptions = await generateCareerOptionsWithGemini(student.skills);

        // Update the student's career options
        student.careerOptions = careerOptions;
        await student.save();

        res.status(200).json({
            message: "Career options generated and updated successfully",
            careerOptions: student.careerOptions,
        });
    } catch (error) {
        console.error("Error in generateCareerOptions:", error);
        res.status(500).json({ error: error.message });
    }
};

async function generateRequiredSkillsWithGemini(preferredCareer, currentSkills) {
    const prompt = `For the career "${preferredCareer}", considering the current skills: ${JSON.stringify(currentSkills)}, list the top 5 required skills with their current proficiency percentage based on the given data the skills may not be present in the current skills but are required for the career. Output the skills in the JSON format: [{"name": "Skill Name", "currentPercentage": 50}]. and dont give anything else rather than that json.`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();
        // console.log(prompt);
        // console.log(responseText);

        return JSON.parse(responseText); // Return the parsed JSON
    } catch (error) {
        console.error("Error generating required skills:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}

exports.updatePreferredCareerAndSkills = async (req, res) => {
    try {
        const { studentId, preferredCareer } = req.body;

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update the student's preferred career
        student.prefferedCareer = preferredCareer;

        // Generate required skills based on the preferred career and current skills
        const requiredSkills = await generateRequiredSkillsWithGemini(preferredCareer, student.skills);

        // Update the student's required skills
        student.requiredSkills = requiredSkills;
        await student.save();

        res.status(200).json({
            message: "Preferred career and required skills updated successfully",
            prefferedCareer: student.prefferedCareer,
            requiredSkills: student.requiredSkills,
        });
    } catch (error) {
        console.error("Error in updatePreferredCareerAndSkills:", error);
        res.status(500).json({ error: error.message });
    }
};

async function answerQuestionWithGemini(question) {
    const prompt = `You are a well-educated student career counselor. Answer the following question in a helpful and informative manner. Use bullet points or new lines to separate each section or paragraph, avoid using unnecessary symbols, and make it concise: "${question}"`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();

        // Format the response with new lines or bullet points
        responseText = responseText
            .replace(/(\*\*|\*\*|\#)/g, '') // Remove markdown symbols
            .replace(/(\*\s)/g, '- ') // Convert asterisks to bullet points
            .replace(/(\n\s*)+/g, '\n') // Normalize new lines
            .replace(/(\s*\n\s*)/g, '\n\n'); // Ensure paragraphs are separated by double new lines

        console.log(prompt);
        console.log(responseText);

        return responseText; // Return the cleaned and formatted text
    } catch (error) {
        console.error("Error generating answer:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}


exports.askCareerQuestion = async (req, res) => {
    try {
        const { studentId, question } = req.body;

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Get the answer from the AI
        const answer = await answerQuestionWithGemini(question);

        res.status(200).json({
            message: "Question answered successfully",
            question,
            answer,
        });
    } catch (error) {
        console.error("Error in askCareerQuestion:", error);
        res.status(500).json({ error: error.message });
    }
};

