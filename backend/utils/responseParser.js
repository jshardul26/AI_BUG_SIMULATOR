function parseAIResponse(aiText) {

    try {

        return JSON.parse(aiText);

    } catch (error) {

        console.error("JSON Parse Error:", error.message);

        return {
            rootCause: null,
            flashcards: [],
            steps: [],
            fix: null,
            flowchart: [],
            parsingError: true
        };
    }
}

module.exports = {
    parseAIResponse
};