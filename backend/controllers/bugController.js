const { validateBugRequest } = require("../utils/validator");
const { parseErrorLog } = require("../utils/logParser");
const { buildBugAnalysisPrompt } = require("../utils/promptBuilder");
const { generateBugSolution } = require("../services/aiService");
const { parseAIResponse } = require("../utils/responseParser");

const analyzeBug = async (req, res) => {

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

    try {

        // STEP 2: PARSE ERROR LOG
        const parsedError = parseErrorLog(errorLog);

        // STEP 3: BUILD AI PROMPT
        const aiPrompt = buildBugAnalysisPrompt({
            code,
            errorLog,
            language,
            parsedError
        });

        const aiResponse = await generateBugSolution(aiPrompt);

        const structuredResponse = parseAIResponse(aiResponse);

        // STEP 5: RETURN FINAL RESPONSE
        return res.json({
            success: true,
            message: "Bug analyzed successfully",
            parsedError,
            aiResponse
        });

    } catch (error) {
        console.error("Controller Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    analyzeBug
};