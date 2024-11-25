const { GoogleGenerativeAI } = require("@google/generative-ai");

async function generateContent() {
    const genAI = new GoogleGenerativeAI("AIzaSyACavXzO0e-GcdEpS8x4MEmQ1DMjdBlezc");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on the following test scores, identify the skills and assign a percentage to each skill, search new skills which can be derived from the score:
Test: intelligences, Date: 2024-11-01T00:00:00.000Z, Scores: {"verbal":85,"numerical":10,"logical":92}. Test: intelligences, Date: 2024-12-01T00:00:00.000Z, Scores: {"verbal":85,"numerical":90,"logical":92}. Test: skill based, Date: 2024-12-01T00:00:00.000Z, Scores: {"creativity":85,"efficiency":90,"accuracy":92}. 
Output the skills in the json format: 'Skill: percentage'. and dont give anything else rather than that json`;

    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

// {
//   "Verbal Comprehension": "85%",
//   "Numerical Reasoning": "85%",
//   "Logical Reasoning": "92%",
//   "Creativity": "85%",
//   "Efficiency": "90%",
//   "Accuracy": "92%",
//   "Problem-Solving": "88%",
//   "Analytical Skills": "90%"
// }

// {
//     "Verbal Comprehension": "85%",
//     "Numerical Reasoning": "90%",
//     "Logical Reasoning": "92%",
//     "Creativity": "85%",
//     "Efficiency": "90%",
//     "Accuracy": "92%",
//     "Problem-Solving": "90%"
// }

generateContent();