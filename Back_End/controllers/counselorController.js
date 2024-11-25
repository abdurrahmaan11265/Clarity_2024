const Counselor = require('../models/Counselor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const Student = require('../models/Student');

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

        const counselor = await Counselor.findOne({ email });
        if (counselor && (await bcrypt.compare(password, counselor.password))) {
            const token = jwt.sign({ id: counselor._id }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            res.json({
                token,
                counselor: {
                    id: counselor._id,
                    name: counselor.name,
                    email: counselor.email,
                },
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

// Get Assigned Students
exports.getAssignedStudents = async (req, res) => {
    try {
        const { id } = req.user; // Counselor ID from JWT

        const counselor = await Counselor.findById(id).populate('assignedStudents');
        if (!counselor) {
            return res.status(404).json({ message: 'Counselor not found' });
        }

        res.json(counselor.assignedStudents);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.assignTestToStudent = async (req, res) => {
    try {
        const { studentId, testIds } = req.body; // testIds should be an array of test IDs

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate test IDs
        const validTestIds = await Test.find({ _id: { $in: testIds } }).select('_id');
        if (validTestIds.length !== testIds.length) {
            return res.status(400).json({ message: 'One or more test IDs are invalid' });
        }

        // Assign or reassign the test IDs to the student
        testIds.forEach(testId => {
            const assignedTest = student.assignedTests.find(assignedTest => assignedTest.testId.toString() === testId);
            if (assignedTest) {
                // If the test is already assigned, mark it as not completed
                assignedTest.completed = false;
            } else {
                // If the test is not assigned, add it
                student.assignedTests.push({ testId, completed: false });
            }
        });

        await student.save();

        res.status(200).json({ message: 'Tests assigned or reassigned successfully', student });
    } catch (error) {
        console.error('Error assigning tests:', error);
        res.status(500).json({ error: error.message });
    }
};