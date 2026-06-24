function classifyInput(text) {

    if (!text) return "empty";

    const lower = text.toLowerCase();

    const errorSignals = [
        "exception",
        "error",
        "null",
        "stack trace",
        "at main",
        "java",
        "traceback",
        "undefined",
        "cannot read"
    ];

    const bugScore = errorSignals.filter(word =>
        lower.includes(word)
    ).length;

    const hasCodeStructure =
        lower.includes("class") ||
        lower.includes("public") ||
        lower.includes("{") ||
        lower.includes("}");

    // STRONG RULE: if null + code + method call → bug
    const strongBugPattern =
        lower.includes("null") &&
        lower.includes(".") &&
        lower.includes("(");

    if (strongBugPattern) return "bug";

    if (bugScore >= 2) return "bug";

    if (hasCodeStructure && bugScore >= 1) return "bug";

    return "unknown";
}

module.exports = {
    classifyInput
};