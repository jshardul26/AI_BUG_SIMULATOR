function buildBugAnalysisPrompt({
code,
errorLog,
language,
parsedError
}) {


const hasCode =
    !!code && code.trim() !== "";

const hasErrorLog =
    !!errorLog && errorLog.trim() !== "";

let analysisMode = "";

if (hasCode && hasErrorLog) {

    analysisMode = `


Full Analysis Mode:
Analyze both the code and the error log.
Use both sources of information.
`;

} else if (hasCode) {

    analysisMode = `


Code Analysis Mode:
No error log was provided.

Analyze the code.
Identify likely bugs.
Explain possible runtime issues.
Suggest fixes.
`;


} else {

    analysisMode = `


Error Log Analysis Mode:
No source code was provided.

Analyze the error log.
Identify likely causes.
Explain what probably happened.
Suggest fixes.
`;


}

return `


You are an expert software debugging mentor.

Your audience is:

* Beginner programmers
* College students
* Developers trying to understand WHY a bug happened

Your job is NOT just to fix the bug.

Your job is to TEACH.

---

## RESPONSE RULES

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return code fences.

Do NOT return any text outside JSON.

Return exactly this structure:

{
"rootCause": "",
"flashcards": [
{
"question": "",
"answer": ""
}
],
"steps": [],
"fix": "",
"correctedCode": "",
"flowchart": [],
"quiz": [
{
"question": "",
"options": [],
"correctAnswer": ""
}
],
"learningOutcome": ""
}

---

## CONTENT QUALITY RULES

1. ROOT CAUSE

Explain:

* What happened
* Why it happened
* Which object/value caused the issue

Use simple English.
Maximum 5-7 sentences.
Avoid technical jargon.

Include a real-world analogy.

---

2. FLASHCARDS

Generate 4-6 educational flashcards.

Each flashcard must teach a concept.

Format:

{
"question": "",
"answer": ""
}

---

3. STEPS

Explain the bug story step-by-step.

Generate 5-8 detailed steps.

---

4. FIX

Provide:

* What needs to be changed
* Why the change fixes the issue

Rules:

* Do NOT include code here.
* Keep explanation beginner friendly.

---

5. CORRECTED CODE

Provide the corrected version of the code.

Rules:

* Return only the corrected code.
* Preserve the original language.
* Fix only the relevant bug.
* Do not include explanations.

---

6. FLOWCHART

Generate logical flowchart nodes.

Generate 6-10 nodes.

Example:

[
"Create variable",
"Assign null value",
"Call length()",
"NullPointerException occurs",
"Add null check",
"Program runs successfully"
]

---

7. QUIZ

Generate exactly 3 multiple-choice questions.

Rules:

* Beginner friendly
* 4 options each
* One correct answer
* Test understanding of the bug

Format:

[
{
"question": "",
"options": [
"",
"",
"",
""
],
"correctAnswer": ""
}
]

---

8. LEARNING OUTCOME

Generate one concise sentence describing what practical debugging skill the learner gained.

Examples:

"The learner will understand how to identify and prevent null value errors."

"The learner will understand how to verify object existence before calling methods."

"The learner will understand how stack traces help locate runtime failures."

---

IMPORTANT JSON RULES

Return ONLY valid JSON.

Do NOT include markdown.

Do NOT include backticks.

Do NOT include explanations outside JSON.

Do NOT include headings outside JSON.

---

ANALYSIS MODE

${analysisMode}

---

BUG INFORMATION

Language:
${language || "Not Provided"}

Code:
${code || "Not Provided"}

Error Log:
${errorLog || "Not Provided"}

Parsed Error:
${JSON.stringify(parsedError)}

Analyze thoroughly and return ONLY valid JSON.
`;
}

module.exports = {
buildBugAnalysisPrompt
};
