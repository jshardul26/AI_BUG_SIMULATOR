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

    // -----------------------------
    // Error Type Detection
    // -----------------------------

    if (lower.includes("indexerror") || lower.includes("out of range")) {
        result.errorType = "Boundary Error";
        result.probableCause = "Program tried to access an index outside the valid range.";
    }

    else if (
        lower.includes("arrayindexoutofboundsexception")
    ) {
        result.errorType = "Boundary Error";
        result.probableCause = "Program accessed an array position that does not exist.";
    }

    else if (
        lower.includes("nullpointerexception") ||
        lower.includes("cannot read properties of") ||
        lower.includes("cannot read property") ||
        lower.includes("cannot read") ||
        lower.includes("undefined") ||
        lower.includes("nonetype") ||
        lower.includes("attributeerror")
    ) {
        result.errorType = "Null Reference Error";
        result.probableCause = "Program tried to use a variable that does not reference a valid object.";
    }

    else if (
        lower.includes("syntaxerror") ||
        lower.includes("unexpected token") ||
        lower.includes("missing ;") ||
        lower.includes("expected")
    ) {
        result.errorType = "Syntax Error";
        result.probableCause = "The program contains invalid language syntax.";
    }

    else if (
        lower.includes("typeerror") ||
        lower.includes("classcastexception")
    ) {
        result.errorType = "Type Error";
        result.probableCause = "Operation performed on an incompatible data type.";
    }

    else if (
        lower.includes("zerodivisionerror") ||
        lower.includes("division by zero") ||
        lower.includes("arithmeticexception")
    ) {
        result.errorType = "Runtime Exception";
        result.probableCause = "Program attempted to divide a number by zero.";
    }

    else if (
        lower.includes("keyerror")
    ) {
        result.errorType = "Runtime Exception";
        result.probableCause = "Program tried to access a dictionary key that does not exist.";
    }

    else if (
        lower.includes("recursionerror") ||
        lower.includes("stackoverflowerror")
    ) {
        result.errorType = "Recursion Error";
        result.probableCause = "Recursive function exceeded the maximum recursion depth.";
    }

    else if (
        lower.includes("memoryerror") ||
        lower.includes("outofmemoryerror")
    ) {
        result.errorType = "Memory Issue";
        result.probableCause = "Program exhausted available memory.";
    }

    else if (
        lower.includes("sql") ||
        lower.includes("database")
    ) {
        result.errorType = "Database Error";
        result.probableCause = "Database query or connection failed.";
    }

    else if (
        lower.includes("fetch failed") ||
        lower.includes("networkerror") ||
        lower.includes("404") ||
        lower.includes("500")
    ) {
        result.errorType = "API Error";
        result.probableCause = "API request failed or returned an invalid response.";
    }

    else {
        result.errorType = "Unknown";
        result.probableCause = "Unable to determine the exact cause from the provided error log.";
    }

    // -----------------------------
    // Keyword Detection
    // -----------------------------

    const quoteMatch = errorLog.match(/'([^']+)'|"([^"]+)"/);

    const functionMatch = errorLog.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?=\s*\()/);

    result.keyword =
        quoteMatch?.[1] ||
        quoteMatch?.[2] ||
        functionMatch?.[1] ||
        result.errorType;

    return result;
}

module.exports = {
    parseErrorLog
};