// Fix: no upper bound existed on code/errorLog length. A very large paste
// inflates the prompt sent to the model, increases cost, and increases the
// chance of the response getting truncated against the max_tokens cap set
// in aiService.js. These limits are generous (roughly a few thousand lines
// of code) — raise them if your use case genuinely needs more, but an
// explicit, deliberate limit is safer than none at all.
const MAX_CODE_LENGTH = 20000;
const MAX_ERROR_LOG_LENGTH = 10000;

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

    if (hasCode && data.code.length > MAX_CODE_LENGTH) {
        errors.push(
            `Code is too long (max ${MAX_CODE_LENGTH} characters)`
        );
    }

    if (hasErrorLog && data.errorLog.length > MAX_ERROR_LOG_LENGTH) {
        errors.push(
            `Error log is too long (max ${MAX_ERROR_LOG_LENGTH} characters)`
        );
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateBugRequest
};