function parseAIResponse(aiText) {

    try {

        return JSON.parse(aiText);

    } catch (error) {

        console.error("JSON Parse Error:", error.message);

        return {
            bugPattern: null,
            rootCause: null,
            flashcards: [],
            steps: [],
            fix: null,
            correctedCode: null,
            flowchart: [],
            quiz: [],
            learningOutcome: null,
            parsingError: true
        };
    }
}

module.exports = {
    parseAIResponse
};