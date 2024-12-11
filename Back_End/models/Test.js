const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [String]
});

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true },
    questions: [questionSchema]
});

const studentResponseSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, default: Date.now },
    responses: [
        {
            category: { type: String, required: true },
            selectedOptions: [String]
        }
    ]
});

const testSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    categories: [categorySchema],
    studentResponses: [studentResponseSchema]
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;