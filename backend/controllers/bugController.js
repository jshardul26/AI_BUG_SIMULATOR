const { validateBugRequest } = require("../utils/validator");
const { parseErrorLog } = require("../utils/logParser");
const { buildBugAnalysisPrompt } = require("../utils/promptBuilder");
const { generateBugSolution } = require("../services/aiService");
const { parseAIResponse } = require("../utils/responseParser");


const analyzeBug = async (req, res) => {


    console.log("🚀 Analyze Bug API called");


    // Fix: "language" was never destructured or passed to the prompt
    // builder, so the prompt always said "Language: Not Provided" even
    // when the frontend sent one.
    const { code, errorLog } = req.body;



    // Validation

    const validationResult =
        validateBugRequest(req.body);


    if (!validationResult.isValid) {

        return res.status(400).json({

            success: false,

            errors: validationResult.errors

        });
    }



    try {


        // Fix: parseErrorLog was called unconditionally, even when
        // errorLog is undefined/empty (code-only mode). Guard it so a
        // missing error log can't throw here regardless of what
        // logParser.js does internally with an undefined/empty string.
        const parsedError =
            errorLog && errorLog.trim() !== ""
                ? parseErrorLog(errorLog)
                : null;



        // Build prompt

        const aiPrompt =
            buildBugAnalysisPrompt({

                code,

                errorLog,

                parsedError

            });



        // AI call

        const aiResponse =
            await generateBugSolution(aiPrompt);



        // Handle API failure

        if (typeof aiResponse !== "string") {


            return res.status(503).json({

                success: false,

                message:
                    "AI service temporarily unavailable.",


                structuredResponse: {

                    bugPattern: "Unknown",

                    rootCause:
                        "AI service is currently unavailable. Please try again later.",

                    flashcards: [],

                    steps: [],

                    fix: "",

                    correctedCode: "",

                    flowchart: [],

                    quiz: [],

                    learningOutcome:
                        "Retry the analysis after the AI service becomes available."

                }

            });

        }




        // Parse AI JSON

        const structuredResponse =
            parseAIResponse(aiResponse);


        // Fix: a parsing failure (malformed JSON from the model) was
        // previously still reported to the frontend as success:true with a
        // useless placeholder payload — indistinguishable from a real,
        // completed-but-bad analysis. Surface it as a real failure instead
        // so the frontend can show a retry state rather than displaying
        // placeholder text as if it were a genuine result.
        if (structuredResponse.parsingError) {

            return res.status(502).json({

                success: false,

                message:
                    "AI response could not be parsed. Please retry.",

                parsedError,

                structuredResponse

            });
        }


        return res.json({

            success: true,

            message:
                "Bug analyzed successfully",

            parsedError,

            structuredResponse

        });



    } catch(error) {


        console.error(
            "Controller Error:",
            error.message
        );



        return res.status(500).json({

            success:false,

            message:
                "Internal server error",

            error:error.message

        });

    }

};



module.exports = {
    analyzeBug
};