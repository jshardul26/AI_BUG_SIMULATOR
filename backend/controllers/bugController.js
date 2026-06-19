const { parseErrorLog } = require("../utils/logParser");
const { validateBugRequest } = require("../utils/validator");
const analyzeBug = (req, res) => {

    console.log("Analyze Bug API called");

    const { code, errorLog, language } = req.body;

    // 1. VALIDATION
    const validationResult = validateBugRequest(req.body);

    if (!validationResult.isValid) {
        return res.status(400).json({
            success: false,
            errors: validationResult.errors
        });
    }

    // 2. LOG PARSING (NEW STEP 🔥)
    const parsedError = parseErrorLog(errorLog);

    // 3. RESPONSE (for now we return parsed result)
    return res.json({
        success: true,
        message: "Bug analyzed successfully",
        originalData: {
            code,
            errorLog,
            language
        },
        parsedError
    });

};

module.exports = {
    analyzeBug
};