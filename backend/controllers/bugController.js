const { validateBugRequest } = require("../utils/validator");
const { parseErrorLog } = require("../utils/logParser");
const { buildBugAnalysisPrompt } = require("../utils/promptBuilder");
const { generateBugSolution } = require("../services/aiService");
const { parseAIResponse } = require("../utils/responseParser");

// In-memory bug history store
const bugHistory = [];
let bugIdCounter = 1000;

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

        // STEP 4: SAVE TO HISTORY
        const bugEntry = {
            id: `#${++bugIdCounter}`,
            title: parsedError.message || errorLog.split("\n")[0],
            language: language || "Unknown",
            severity: structuredResponse?.severity || "Medium",
            status: "Resolved",
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }),
            parsedError,
            structuredResponse
        };
        bugHistory.unshift(bugEntry);

        // STEP 5: RETURN FINAL RESPONSE
        return res.json({
            success: true,
            message: "Bug analyzed successfully",
            parsedError,
            structuredResponse
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

// Get bug history
const getBugHistory = (req, res) => {
    return res.json({
        success: true,
        total: bugHistory.length,
        bugs: bugHistory
    });
};

// Get stats
const getStats = (req, res) => {
    const total = bugHistory.length;
    const resolved = bugHistory.filter(b => b.status === "Resolved").length;
    const critical = bugHistory.filter(b => b.severity === "Critical").length;
    return res.json({
        success: true,
        stats: {
            totalAnalyses: total,
            bugsResolved: resolved,
            criticalIssues: critical,
            avgFixTime: "2.4h"
        }
    });
};

module.exports = {
    analyzeBug,
    getBugHistory,
    getStats
};