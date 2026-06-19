function validateBugRequest(data) {

    const errors = [];

    if (!data.errorLog || data.errorLog.trim() === "") {
        errors.push("Error log is required");
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