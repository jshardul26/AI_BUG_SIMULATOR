const Groq = require("groq-sdk");

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Fix: nothing bounded how long a single Groq request could take. If the
// request stalls, this hangs the whole controller call (and, without the
// server.timeout backstop in server.js, potentially the connection)
// indefinitely. This wraps the call with a hard timeout so a stall fails
// fast and predictably instead of hanging.
const REQUEST_TIMEOUT_MS = 25000;

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(`AI request timed out after ${ms}ms`)),
                ms
            )
        )
    ]);
}


async function generateBugSolution(prompt) {

    try {

        const response = await withTimeout(
            groq.chat.completions.create({

                // Fix: llama-3.1-8b-instant is deprecated by Groq (see
                // console.groq.com/docs/deprecations — check the shutdown
                // date) and is too small for this task. The schema
                // requires multi-section structured output with
                // cross-field logical consistency (corrected code must
                // match root cause, flashcards/quiz must reference the
                // actual code, etc.) — that kind of reasoning is where
                // small models fail even when surface formatting looks
                // fine. openai/gpt-oss-120b is Groq's current suggested
                // migration target and a much better fit for this task's
                // reasoning demands. If this model isn't available on your
                // account/tier, check `groq models list` (or the Groq
                // console) and swap in whichever large model you have
                // access to.
                model: "openai/gpt-oss-120b",

                messages: [
                    {
                        role: "system",
                        content: `
You are an expert AI coding tutor and debugging assistant.

Your job:
- Explain bugs in simple, beginner-friendly language.
- Teach, don't just fix.
- Analyze the complete input before answering.
- Detect all real issues actually present in the input — do not invent
  bugs, variables, or behavior that isn't implied by the code/error log.
- Every fix and corrected code you provide must resolve every issue you
  named, and must preserve the original intended behavior rather than
  introducing new logic that wasn't implied by the input.

Follow the detailed formatting and schema instructions in the user
message exactly. Return ONLY valid JSON, matching that schema.
`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],

                // Fix: 0.7 is too high for a task that needs precise,
                // grounded reasoning rather than creative variation. Lower
                // temperature reduces the risk of the model inventing
                // plausible-sounding but ungrounded fixes/logic.
                temperature: 0.2,

                // Fix: no max_tokens was set. This schema (root cause +
                // 4-6 flashcards + 5-8 steps + fix + full corrected code +
                // 6-10 flowchart nodes + 3 quiz questions + learning
                // outcome) can be long; leaving this unset risks silent
                // truncation mid-JSON on larger code inputs. Set
                // explicitly, comfortably under the model's output cap.
                max_tokens: 3500,

                // Fix: enables Groq's JSON mode, which constrains
                // generation to syntactically valid JSON at the token
                // level. This does not enforce your exact schema (that's
                // still the prompt's job), but it eliminates a class of
                // failures like stray text, missing quotes, or trailing
                // commas that no amount of prompt wording fully prevents
                // on a smaller/faster model.
                response_format: { type: "json_object" }
            }),
            REQUEST_TIMEOUT_MS
        );


        return response.choices[0].message.content;


    } catch (error) {

        console.error("❌ Groq AI Error:", error.message);


        return {
            success: false,
            message: "AI service failed",
            error: error.message
        };
    }
}


module.exports = {
    generateBugSolution
};