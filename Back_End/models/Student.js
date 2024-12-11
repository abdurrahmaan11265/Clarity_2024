const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: String,
    totalMarks: Number,
    gainedMarks: Number,
});

const subjectSchema = new mongoose.Schema({
    name: String,
    examNameAndMarks: [examSchema],
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

const careerOptionSchema = new mongoose.Schema({
    name: String,
    averageSalary: Number,
    description: String,
    marketTrends: String,
});

const counselorNoteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    date: { type: Date, default: Date.now },
    note: String,
});

const journalEntrySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    date: { type: Date, default: Date.now },
    note: String,
    emotions: {
        type: Object,
        default: { happiness: 0, sadness: 0, disgust: 0, fear: 0, surprise: 0, anger: 0 },
    },
    positivity: Number,
    theme: String,
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
    careerOptions: [careerOptionSchema],
    prefferedCareer: String,
    requiredSkills: [
        {
            name: String,
            currentPercentage: Number,
        }
    ],
    password: { type: String, required: true },
    assignedTests: [{
        testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
        completed: { type: Boolean, default: false },
        testName: String
    }],
    counselorNotes: [counselorNoteSchema],
    journalEntries: [journalEntrySchema],
    aiSummary: { type: String, default: 'No summary yet' },
    userType: { type: String, default: 'student' }
});

module.exports = mongoose.model('Student', studentSchema);