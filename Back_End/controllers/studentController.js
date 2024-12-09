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
            const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
exports. updateMarks = async (req, res) => {
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
        return responseText; // Return the cleaned and formatted text
    } catch (error) {
        console.error("Error generating answer:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}


exports.askCareerQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        console.log(question)
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

async function generateCareerStagesWithGemini(careerName) {
    const prompt = `For the career "${careerName}", provide a structured learning path with 5 stages. Each stage should be an object with the following format:
    [{
        id: ,
        title: "stage 1",
        content: "Sub-heading",
        flashcards: [
          { title: "Skills or Technologies", content: "" },
          { title: "Time to dedicate", content: "Verify system integration" },
          { title: "Why learn", content: "Conduct user acceptance testing" }
        ]
      },
      ...
    ]
    The id should start from 1 and go to 5. The title should be a small title name for that stage. The content should be about that specific title. In the flashcards array, the titles must not be changed, but the content must be changed according to the stage. Just give the json array and nothing else.`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();

        return JSON.parse(responseText); // Return the parsed JSON
    } catch (error) {
        console.error("Error generating career stages:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}

exports.getCareerStages = async (req, res) => {
    try {
        const { careerName } = req.body;

        // Generate career stages using Gemini AI
        const careerStages = await generateCareerStagesWithGemini(careerName);

        res.status(200).json({
            message: "Career stages generated successfully",
            careerStages,
        });
    } catch (error) {
        console.error("Error in getCareerStages:", error);
        res.status(500).json({ error: error.message });
    }
};

async function generateSkillsComparisonWithGemini(careerName, currentSkills) {
    const prompt = `For the career "${careerName}", considering the current skills: ${JSON.stringify(currentSkills)}, provide the following:
    1. A list of top 7 required skills with their average proficiency percentage and the student's current proficiency percentage. Format: [{"skillName": "Skill Name", "avgPercentage": 50, "currentPercentage": 40}].
    2. A list of prominent figures in this field with a brief description for each. Format: [{"name": "Person Name", "description": "Brief description"}].
    Return the response in this JSON format: {"skillsComparison": [{"skillName": "Skill Name", "avgPercentage": 50, "currentPercentage": 40}], "prominentFigures": [{"name": "Person Name", "description": "Brief description"}]}. Only provide the JSON response.`;

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();

        // Parse the response into JSON
        const parsedResponse = JSON.parse(responseText);

        // Extract skillsComparison and prominentFigures from the parsed response
        const skillsComparison = parsedResponse.skillsComparison || [];
        const prominentFigures = parsedResponse.prominentFigures || [];

        return { skillsComparison, prominentFigures };
    } catch (error) {
        console.error("Error generating skills comparison and figures:", error);
        throw error; // Ensure the error is thrown to be caught in the calling function
    }
}

exports.getSkillsComparison = async (req, res) => {
    try {
        const { studentId, careerName } = req.body;

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Generate skills comparison and prominent figures using Gemini AI
        const { skillsComparison, prominentFigures } = await generateSkillsComparisonWithGemini(careerName, student.skills);

        res.status(200).json({
            message: "Skills comparison and prominent figures generated successfully",
            skillsComparison,
            prominentFigures
        });
    } catch (error) {
        console.error("Error in getSkillsComparison:", error);
        res.status(500).json({ error: error.message });
    }
};