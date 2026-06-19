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

    // 1. Extract Error Type (works for JS, Python, Java)
    // Examples: TypeError, ReferenceError, AttributeError, NullPointerException
    const typeMatch = errorLog.match(/([a-zA-Z]+Error|Exception|Error)/);
    if (typeMatch) {
        result.errorType = typeMatch[0];
    }

    // 2. Extract quoted words ('map', "data", etc.)
    const quoteMatch = errorLog.match(/'([^']+)'|"([^"]+)"/);
    if (quoteMatch) {
        result.keyword = quoteMatch[1] || quoteMatch[2];
    }

    // 3. Detect null/undefined/None (universal failure pattern)
    if (
        errorLog.toLowerCase().includes("undefined") ||
        errorLog.toLowerCase().includes("null") ||
        errorLog.toLowerCase().includes("none")
    ) {
        result.probableCause = "Using null/undefined/None value in execution";
    }

    // 4. Generic method/function detection (ANY language)
    // captures words like: map(), append(), render(), fetchData()
    const methodMatch = errorLog.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?=\s*\()/);
    if (methodMatch && !result.keyword) {
        result.keyword = methodMatch[1];
    }

    // 5. Common crash pattern detection (language independent logic)
    if (
        errorLog.toLowerCase().includes("cannot read") ||
        errorLog.toLowerCase().includes("undefined") ||
        errorLog.toLowerCase().includes("null pointer") ||
        errorLog.toLowerCase().includes("none type")
    ) {
        result.probableCause = "Accessing property or method on invalid object";
    }

    return result;
}

module.exports = {
    parseErrorLog
};