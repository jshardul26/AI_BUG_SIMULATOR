require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const Groq = require("groq-sdk");

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Sends prompt to Groq AI and returns response
 * @param {string} prompt - Final prompt from promptBuilder
 * @returns {string} AI response text
 */
async function generateBugSolution(prompt) {

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "system",
                    content: `
You are an expert AI coding tutor.

Your job:
- Explain bugs in VERY SIMPLE language
- Teach like a friendly teacher
- Use flashcards, steps, and flow explanation
- Avoid complex technical jargon
- Make learning easy for beginners
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            temperature: 0.7
        });

        // Extract AI response text
        return response.choices[0].message.content;

    } catch (error) {
        console.error("❌ Groq AI Error:", error.message);

        return {
            success: false,
            message: "AI service failed",
            error: error.message
        };
    }
}

module.exports = {
    generateBugSolution
};