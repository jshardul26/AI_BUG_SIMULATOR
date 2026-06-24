function validateBugRequest(data) {

    const errors = [];

    const hasCode =
        data.code &&
        data.code.trim() !== "";

    const hasErrorLog =
        data.errorLog &&
        data.errorLog.trim() !== "";

    // At least one input required
    if (!hasCode && !hasErrorLog) {
        errors.push(
            "Provide either code, error log, or both"
        );
    }

    if (!data.language || data.language.trim() === "") {
        errors.push("Language is required");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateBugRequest
};