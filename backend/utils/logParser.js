function parseErrorLog(errorLog) {

    if (!errorLog || errorLog.trim() === "") {
        return null;
    }

    const result = {
        errorType: null,
        message: errorLog,
        keyword: null,
        probableCause: null
    };

    const lower = errorLog.toLowerCase();

    // 1. Error Type
    const typeMatch = errorLog.match(/([a-zA-Z]+Error|Exception|NullPointerException)/);
    if (typeMatch) {
        result.errorType = typeMatch[1];
    }

    // 2. Keyword (function/variable in quotes OR function call)
    const quoteMatch = errorLog.match(/'([^']+)'|"([^"]+)"/);
    const methodMatch = errorLog.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?=\s*\()/);

    result.keyword = quoteMatch?.[1] || quoteMatch?.[2] || methodMatch?.[1] || null;

    // 3. Cause detection (priority-based)
    if (
        lower.includes("null pointer") ||
        lower.includes("cannot read") ||
        lower.includes("undefined") ||
        lower.includes("none type")
    ) {
        result.probableCause = "Trying to use something that is empty or not available";
    }

    // 4. Override only if more specific pattern found
    if (lower.includes("cannot read")) {
        result.probableCause = "Code is trying to access property of missing value";
    }

    return result;
}

module.exports = {
    parseErrorLog
};