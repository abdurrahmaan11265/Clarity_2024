const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: String,
    totalMarks: Number,
    gainedMarks: Number,
});

const subjectSchema = new mongoose.Schema({
    name: String,
    examNameAndMarks: [examSchema], // Array of exams with their marks
});

const clarityTestSchema = new mongoose.Schema({
    name: String,
    dateAndMarks: [
        {
            date: Date,
            marks: {
                type: Object,
                default: {},
            },
        },
    ],
});

const classSchema = new mongoose.Schema({
    classNo: Number,
    subjects: [subjectSchema],
});

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: {
        age: Number,
        gender: String,
        address: String,
        phone: String,
        email: { type: String, required: true, unique: true },
        motherName: String,
        fatherName: String,
        telephone: String,
    },
    classes: [classSchema],
    clarityTests: [clarityTestSchema],
    skills: [
        {
            name: String,
            percentage: Number,
        }
    ],
    careerOptions: [String],
    prefferedCareer: String,
    requiredSkills: [String],
    password: { type: String, required: true },
    assignedTests: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        completed: { type: Boolean, default: false },
        testName: String
    }]
});

module.exports = mongoose.model('Student', studentSchema);