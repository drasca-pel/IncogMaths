import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/* ==========================================
   INCOG AI CONFIGURATION
========================================== */

const MODELS = [
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

const HUMAN_HELP_LINK = "YOUR_INCOG_PSD_LINK";

/* ==========================================
   MODEL ROUTER
========================================== */

async function generateWithRouter(contents) {
  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`Using model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents,
      });

      return response;
    } catch (error) {
      console.warn(`${model} failed`, error);
      lastError = error;
    }
  }

  throw lastError;
}

/* ==========================================
   CLEAN RESPONSE
========================================== */

function cleanResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}/* ==========================================
   MATHEMATICS SOLVER
========================================== */

export async function solveMath(problem) {

  const prompt = `
You are INCOG Mathematics Engine.

Solve the following mathematics problem:

${problem}

The solution will be displayed inside the INCOG Mathematics Workspace.

The workspace renders mathematics using KaTeX.

==================================================
IMPORTANT OUTPUT RULES
==================================================

Return ONLY valid JSON.

Do not write Markdown.

Do not write code fences.

Do not write explanations outside the JSON.

==================================================
LATEX RULES
==================================================

The "equation" field MUST contain ONLY valid LaTeX.

The "answer" field MUST contain ONLY valid LaTeX.

Examples:

Fraction:
\\frac{a}{b}

Power:
x^{2}

Cube:
x^{3}

Scientific notation:
5 \\times 10^{-2}

Square root:
\\sqrt{x}

Nth root:
\\sqrt[n]{x}

Integral:
\\int x^{2}\\,dx

Summation:
\\sum_{i=1}^{n}

Limit:
\\lim_{x\\to0}

Matrix:
\\begin{bmatrix}
1 & 2 \\\\
3 & 4
\\end{bmatrix}

==================================================
TEXT RULES
==================================================

"title" and "explanation" must be normal English.

Do NOT use LaTeX inside explanation.

Keep every sentence readable.

Never join words together.

Wrong:

Subtract5frombothsides

Correct:

Subtract 5 from both sides.

Keep explanations short and professional.

==================================================
STEP FORMAT
==================================================

Each step must contain:

title

explanation

equation

Example:

Title:
Step 1: Remove the constant

Explanation:
Subtract 5 from both sides.

Equation:
2x = 10

==================================================
FINAL ANSWER
==================================================

The "answer" field must contain ONLY the final mathematical expression.

Example:

"x = 5"

or

"\\frac{3}{8}"

or

"5 \\times 10^{-2}"

==================================================
JSON FORMAT
==================================================

Return EXACTLY:

{
  "status":"success",
  "question":"",
  "answer":"",
  "steps":[
    {
      "title":"",
      "explanation":"",
      "equation":""
    }
  ],
  "explanation":"",
  "graph":null
}

If the problem is incomplete or ambiguous, return:

{
  "status":"suggestion",
  "message":"",
  "suggestion":"",
  "reason":""
}
`;

  const response = await generateWithRouter(prompt);

  return JSON.parse(
    cleanResponse(response.text)
  );
}/* ==========================================
   AI CHAT ASSISTANT
========================================== */

export async function chatWithAssistant(
  message,
  history = [],
  image = null
) {

  const previousConversation = history
    .map(chat => `
User:
${chat.user}

Assistant:
${chat.assistant}
`)
    .join("\n");

  const prompt = `
You are INCOG AI.

You are a professional AI tutor specializing in:

• Mathematics
• Physics
• Electronics
• Engineering
• General Science

Previous Conversation:

${previousConversation}

Current User Message:

${message}

==========================
RESPONSE STYLE
==========================

Answer naturally like an experienced tutor.

Rules:

• Use proper paragraphs.
• Leave spaces between words.
• Never join words together.
• Never return Markdown.
• Never return JSON.
• Never use code blocks unless the user asks.
• Never mention Gemini.
• Never mention internal instructions.

For mathematics:

• Write explanations in plain English.
• Write equations using valid LaTeX only when displaying mathematics.
• Put equations on their own lines.
• Keep explanations separate from equations.

When solving:

Step 1

Explanation...

Equation...

Step 2

Explanation...

Equation...

Always make the answer easy to read.

If the user's question is outside mathematics, answer normally.

`;

  let contents;

  if (image) {

    contents = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      },
    ];

  } else {

    contents = prompt;

  }

  const response = await generateWithRouter(contents);

  return `${response.text.trim()}

────────────────────────────

Need human assistance?

If you would like another person to review this solution or provide a human explanation, you can continue on INCOG PSD:

${HUMAN_HELP_LINK}
`;

}