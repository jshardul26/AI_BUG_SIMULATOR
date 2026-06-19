const { validateBugRequest } = require("../utils/validator");
const { parseErrorLog } = require("../utils/logParser");
const { buildBugAnalysisPrompt } = require("../utils/promptBuilder");

const analyzeBug = (req, res) => {

    console.log("Analyze Bug API called");

    const { code, errorLog, language } = req.body;

    // STEP 1: VALIDATION
    const validationResult = validateBugRequest(req.body);

    if (!validationResult.isValid) {
        return res.status(400).json({
            success: false,
            errors: validationResult.errors
        });
    }

    // STEP 2: PARSE ERROR LOG
    const parsedError = parseErrorLog(errorLog);

    // STEP 3: BUILD AI PROMPT
    const aiPrompt = buildBugAnalysisPrompt({
        code,
        errorLog,
        language,
        parsedError
    });

    // STEP 4: RETURN RESPONSE (for now we just return prompt)
    return res.json({
        success: true,
        message: "Bug processed successfully",
        parsedError,
        aiPrompt
    });
};

module.exports = {
    analyzeBug
};