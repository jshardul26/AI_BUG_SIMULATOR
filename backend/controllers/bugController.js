const { validateBugRequest } = require("../utils/validator");

const analyzeBug = (req, res) => {

    console.log("Analyze Bug API called");

    // Extract frontend data
    const { code, errorLog, language } = req.body;

    // Validate request
    const validationResult =
        validateBugRequest(req.body);

    if (!validationResult.isValid) {

        return res.status(400).json({
            success: false,
            errors: validationResult.errors
        });

    }

    // Continue if valid
    res.json({
        success: true,
        message: "Bug received successfully",
        receivedData: {
            code,
            errorLog,
            language
        }
    });

};

module.exports = {
    analyzeBug
};