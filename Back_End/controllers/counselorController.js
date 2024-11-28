const Counselor = require('../models/Counselor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const Student = require('../models/Student');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

dotenv.config();

// Register Counselor
exports.registerCounselor = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const counselor = await Counselor.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: 'Counselor registered successfully',
            counselor: {
                id: counselor._id,
                name: counselor.name,
                email: counselor.email,
            },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login Counselor
exports.loginCounselor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the counselor by email and populate the assignedStudents field
        const counselor = await Counselor.findOne({ email }).populate({
            path: 'assignedStudents',
            select: 'name _id classes', // Select only the fields you need
        });

        if (counselor && (await bcrypt.compare(password, counselor.password))) {
            // Generate a JWT token
            const token = jwt.sign({ id: counselor._id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            // Send the response with the populated counselor object
            res.json({
                token,
                counselor,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Assign Students to Counselor
exports.assignStudent = async (req, res) => {
    try {
        const { counselorId, studentId } = req.body;

        const counselor = await Counselor.findById(counselorId);
        if (!counselor) {
            return res.status(404).json({ message: 'Counselor not found' });
        }

        if (!counselor.assignedStudents.includes(studentId)) {
            counselor.assignedStudents.push(studentId);
            await counselor.save();
        }

        res.json({ message: 'Student assigned successfully', counselor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.assignTestToStudent = async (req, res) => {
    try {
        const { studentId, testId } = req.body; 

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate the test ID
        const validTest = await Test.findById(testId).select('_id');
        console.log(testId);
        if (!validTest) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        // Check if the test is already assigned
        const assignedTest = student.assignedTests.find(
            assignedTest => assignedTest.testId.toString() === testId
        );

        if (assignedTest) {
            assignedTest.completed = false;
        } else {
            student.assignedTests.push({ testId, completed: false });
        }

        await student.save();

        res.status(200).json({ message: 'Test assigned or reassigned successfully', student });
    } catch (error) {
        console.error('Error assigning test:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.removeTestFromStudent = async (req, res) => {
    try {
        const { studentId, testId } = req.body; // testId should be a single test ID

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate the test ID
        const validTest = await Test.findById(testId).select('_id');
        if (!validTest) {
            return res.status(400).json({ message: 'Invalid test ID' });
        }

        // Find the index of the test to remove
        const testIndex = student.assignedTests.findIndex(
            assignedTest => assignedTest.testId.toString() === testId
        );

        if (testIndex === -1) {
            return res.status(404).json({ message: 'Test not found in assigned tests' });
        }

        // Remove the test from the array
        student.assignedTests.splice(testIndex, 1);

        await student.save();

        res.status(200).json({ message: 'Test removed successfully', student });
    } catch (error) {
        console.error('Error removing test:', error);
        res.status(500).json({ error: error.message });
    }
};

async function generateCareerOptionsWithGemini(skills) {
    const prompt = `Based on the following skills and their percentages, suggest career options with average salary in indian rupees and description:\n${JSON.stringify(skills)}\nOutput the career options in the JSON format: [{"name": "Career Name", "averageSalary": 50000, "description": "Career description"}]. and dont give anything else rather than that json.`;

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

exports.removeCareerOption = async (req, res) => {
    try {
        const { studentId, careerName } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the career option to remove
        const careerIndex = student.careerOptions.findIndex(
            (career) => career.name === careerName
        );

        if (careerIndex === -1) {
            return res.status(404).json({ message: 'Career option not found' });
        }

        // Remove the career option from the array
        student.careerOptions.splice(careerIndex, 1);

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Career option removed successfully',
            careerOptions: student.careerOptions,
        });
    } catch (error) {
        console.error('Error removing career option:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.editCareerOption = async (req, res) => {
    try {
        const { studentId, careerName, newAverageSalary, newDescription } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the career option to edit
        const career = student.careerOptions.find(
            (career) => career.name === careerName
        );

        if (!career) {
            return res.status(404).json({ message: 'Career option not found' });
        }

        // Update the career option's details
        career.averageSalary = newAverageSalary;
        career.description = newDescription;

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Career option updated successfully',
            careerOptions: student.careerOptions,
        });
    } catch (error) {
        console.error('Error editing career option:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.addNewCareerOption = async (req, res) => {
    try {
        const { studentId, careerName, averageSalary, description } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the career option already exists
        const existingCareer = student.careerOptions.find(
            (career) => career.name === careerName
        );

        if (existingCareer) {
            return res.status(400).json({ message: 'Career option already exists' });
        }

        // Add the new career option
        student.careerOptions.push({
            name: careerName,
            averageSalary,
            description,
        });

        // Save the updated student document
        await student.save();

        res.status(201).json({
            message: 'Career option added successfully',
            careerOptions: student.careerOptions,
        });
    } catch (error) {
        console.error('Error adding new career option:', error);
        res.status(500).json({ error: error.message });
    }
};


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

exports.addSkill = async (req, res) => {
    try {
        const { studentId, skillName, percentage } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the skill already exists
        const existingSkill = student.skills.find(
            (skill) => skill.name === skillName
        );

        if (existingSkill) {
            return res.status(400).json({ message: 'Skill already exists' });
        }

        // Add the new skill
        student.skills.push({
            name: skillName,
            percentage,
        });

        // Save the updated student document
        await student.save();

        res.status(201).json({
            message: 'Skill added successfully',
            skills: student.skills,
        });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const { studentId, skillName, newPercentage } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the skill to update
        const skill = student.skills.find(
            (skill) => skill.name === skillName
        );

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Update the skill's percentage
        skill.percentage = newPercentage;

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Skill updated successfully',
            skills: student.skills,
        });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const { studentId, skillName } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the skill to delete
        const skillIndex = student.skills.findIndex(
            (skill) => skill.name === skillName
        );

        if (skillIndex === -1) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        // Remove the skill from the array
        student.skills.splice(skillIndex, 1);

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Skill deleted successfully',
            skills: student.skills,
        });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.addRequiredSkill = async (req, res) => {
    try {
        const { studentId, skillName, percentage } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the required skill already exists
        const existingSkill = student.requiredSkills.find(
            (skill) => skill.name === skillName
        );

        if (existingSkill) {
            return res.status(400).json({ message: 'Required skill already exists' });
        }

        // Add the new required skill
        student.requiredSkills.push({
            name: skillName,
            currentPercentage: percentage,
        });

        // Save the updated student document
        await student.save();

        res.status(201).json({
            message: 'Required skill added successfully',
            requiredSkills: student.requiredSkills,
        });
    } catch (error) {
        console.error('Error adding required skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateRequiredSkill = async (req, res) => {
    try {
        const { studentId, skillName, newPercentage } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the required skill to update
        const skill = student.requiredSkills.find(
            (skill) => skill.name === skillName
        );

        if (!skill) {
            return res.status(404).json({ message: 'Required skill not found' });
        }

        // Update the required skill's percentage
        skill.currentPercentage = newPercentage;

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Required skill updated successfully',
            requiredSkills: student.requiredSkills,
        });
    } catch (error) {
        console.error('Error updating required skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRequiredSkill = async (req, res) => {
    try {
        const { studentId, skillName } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the required skill to delete
        const skillIndex = student.requiredSkills.findIndex(
            (skill) => skill.name === skillName
        );

        if (skillIndex === -1) {
            return res.status(404).json({ message: 'Required skill not found' });
        }

        // Remove the required skill from the array
        student.requiredSkills.splice(skillIndex, 1);

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Required skill deleted successfully',
            requiredSkills: student.requiredSkills,
        });
    } catch (error) {
        console.error('Error deleting required skill:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { studentId, note } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Add the new note with an automatically generated ID
        const newNote = {
            note,
        };
        student.counselorNotes.push(newNote);

        // Save the updated student document
        await student.save();

        res.status(201).json({
            message: 'Note added successfully',
            counselorNotes: student.counselorNotes,
        });
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.removeNote = async (req, res) => {
    try {
        const { studentId, noteId } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the index of the note to delete using the note ID
        const noteIndex = student.counselorNotes.findIndex(
            (note) => note._id.toString() === noteId
        );

        if (noteIndex === -1) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Remove the note from the array
        student.counselorNotes.splice(noteIndex, 1);

        // Save the updated student document
        await student.save();

        res.status(200).json({
            message: 'Note removed successfully',
            counselorNotes: student.counselorNotes,
        });
    } catch (error) {
        console.error('Error removing note:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.generateAISummary = async (req, res) => {
    try {
        const { studentId } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Prepare data for AI summary
        let prompt = "I am a counselor and Generate a comprehensive summary for the student to make me understand the student based on the following data and make the summary as simple as possible:\n";

        // Add classes data
        prompt += "Classes:\n";
        student.classes.forEach(cls => {
            prompt += `Class No: ${cls.classNo}, Subjects: ${cls.subjects.map(sub => sub.name).join(', ')}\n`;
        });

        // Add clarity test data
        prompt += "Clarity Tests:\n";
        student.clarityTests.forEach(test => {
            prompt += `Test: ${test.name}, Dates and Marks: ${test.dateAndMarks.map(entry => `${entry.date.toISOString()}: ${JSON.stringify(entry.marks)}`).join(', ')}\n`;
        });

        // Add counselor notes
        prompt += "Counselor Notes:\n";
        student.counselorNotes?.forEach(note => {
            prompt += `Date: ${note.date.toISOString()}, Note: ${note.note}\n`;
        });

        // Call Gemini API to generate summary
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip out any markdown or unwanted characters
        responseText = responseText.replace(/```json|```/g, '').trim();

        // Update the student's AI summary
        student.aiSummary = responseText;
        await student.save();

        res.status(200).json({
            message: "AI summary generated successfully",
            aiSummary: student.aiSummary,
        });
    } catch (error) {
        console.error("Error generating AI summary:", error);
        res.status(500).json({ error: error.message });
    }
};