function parseAIResponse(aiText) {

    if (!aiText || typeof aiText !== "string") {
        return null;
    }

    return {
        rootCause: extractSection(aiText, "ROOT CAUSE"),
        flashcards: extractList(aiText, "FLASHCARDS"),
        steps: extractList(aiText, "STEP-BY-STEP STORY"),
        fix: extractSection(aiText, "SIMPLE FIX"),
        flowchart: extractSection(aiText, "VISUAL FLOW")
    };
}

// Extract paragraph section
function extractSection(text, keyword) {
    const regex = new RegExp(`${keyword}[\\s\\S]*?(?=\\n\\n|\\d\\. |$)`, "i");
    const match = text.match(regex);
    return match ? match[0].replace(keyword, "").trim() : null;
}

// Extract bullet/list items
function extractList(text, keyword) {
    const section = extractSection(text, keyword);
    if (!section) return [];

    return section
        .split("\n")
        .map(line => line.replace(/[-•\d.]/g, "").trim())
        .filter(Boolean);
}

module.exports = {
    parseAIResponse
};