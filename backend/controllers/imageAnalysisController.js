const { extractTextFromImage } = require("../services/ocrService");
const { cleanOCRText } = require("../utils/textCleaner");
const { classifyInput } = require("../update/inputClassifier");
const { parseErrorLog } = require("../utils/logParser");
const { buildBugAnalysisPrompt } = require("../utils/promptBuilder");
const { generateBugSolution } = require("../services/aiService");
const { parseAIResponse } = require("../utils/responseParser");

const analyzeImage = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const imagePath = req.file.path;

        // 1. OCR
        let extractedText = await extractTextFromImage(imagePath);

        // 2. CLEAN OCR OUTPUT (IMPORTANT FIX)
        extractedText = cleanOCRText(extractedText);

        // 3. CLASSIFY INPUT
        const inputType = classifyInput(extractedText);

        // 4. If NOT bug → stop early
        if (inputType !== "bug") {
            return res.json({
                success: true,
                message: "Input detected but not a bug",
                inputType,
                extractedText
            });
        }

        // 5. Parse error log
        const parsedError = parseErrorLog(extractedText);

        // 6. Build prompt
        const aiPrompt = buildBugAnalysisPrompt({
            code: "",
            errorLog: extractedText,
            language: "Unknown",
            parsedError
        });

        // 7. AI call
        const aiResponse = await generateBugSolution(aiPrompt);

        const structuredResponse = parseAIResponse(aiResponse);

        return res.json({
            success: true,
            message: "Bug analyzed successfully",
            extractedText,
            parsedError,
            structuredResponse
        });

    } catch (error) {

        console.error("Image Analysis Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to analyze image",
            error: error.message
        });
    }
};

module.exports = {
    analyzeImage
};