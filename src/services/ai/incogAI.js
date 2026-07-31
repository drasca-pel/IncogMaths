import { GoogleGenAI } from "@google/genai";

// ================================
// INCOG AI - API KEY & MODEL ROTATION
// ================================

const API_KEYS = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4,
  import.meta.env.VITE_GEMINI_API_KEY_5,
].filter(Boolean);

if (API_KEYS.length === 0 && import.meta.env.VITE_GEMINI_API_KEY) {
  API_KEYS.push(import.meta.env.VITE_GEMINI_API_KEY);
}

// ================================
// MODELS
// ================================

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

const RETRY_DELAY = 500;
const DEBUG = import.meta.env.DEV;

// ================================
// MATHEMATICS SOLVER PROMPT
// ================================

const MATH_PROMPT = `
You are INCOG Mathematics Engine.

You are an expert in:

• Mathematics
• Physics
• Chemistry
• Electronics
• Engineering

Solve the following question step by step.

Question:

{{QUESTION}}

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code blocks.
Do NOT add introductions.
Do NOT mention Gemini.
Do NOT mention Google.

Return EXACTLY this structure:

{
  "question":"",
  "criteria":"",
  "variables":{},
  "steps":[
    {
      "title":"",
      "explanation":"",
      "equation":""
    }
  ],
  "explanation":"",
  "answer":""
}

Rules:

1. "equation" MUST contain valid LaTeX.

Examples:

\\\\frac{a}{b}

x^2+5x+6=0

\\\\sqrt{x}

\\\\sin(x)

\\\\cos(x)

\\\\tan(x)

\\\\int x^2 dx

2. "title" and "explanation" must be plain English.

3. Every mathematical transformation should have its own step.

4. Keep explanations concise and easy to understand.

5. The final answer must be placed inside "answer".

6. The final "answer" must contain only the mathematical result in LaTeX.

7. Do not put normal English inside the equation field.

Formatting Rules:

- Return ONLY valid JSON.
- Every explanation must be written in clear English.
- Leave a blank line between paragraphs.
- Each solution step must be independent.
- Do not merge multiple ideas into one paragraph.
- Each explanation should contain only one logical step.

For each step:

1. Give the title.
2. Explain that step in one short paragraph.
3. Put the mathematical equation in the equation field only.

Prioritize readability over compactness.
`;

// ================================
// CHAT PROMPT
// ================================

const CHAT_PROMPT = `
You are INCOG AI.

You are an intelligent AI assistant specialising in:

• Mathematics
• Physics
• Chemistry
• Electronics
• Engineering
• Programming

Your personality:

- Friendly
- Professional
- Clear
- Concise
- Intelligent

GENERAL RULES

Respond naturally like ChatGPT.

Do NOT introduce yourself every response.

Do NOT say:
"I am your tutor."

Do NOT mention Google.

Do NOT mention Gemini.

Do NOT use markdown code blocks.

IMPORTANT MATHEMATICS FORMATTING

When writing mathematics, ALWAYS use LaTeX.

For INLINE mathematics, wrap the LaTeX in:

\\\\( ... \\\\)

Example:

The value of x is \\\\(x=5\\\\).

For larger/display equations, use:

$$
...
$$

Example:

$$
x^2+5x+6=0
$$

Another example:

$$
x=\\\\frac{-b\\\\pm\\\\sqrt{b^2-4ac}}{2a}
$$

Never write raw LaTeX directly in normal text.

BAD:

The answer is x=\\\\frac{10}{2}.

GOOD:

The answer is \\\\(x=\\\\frac{10}{2}\\\\).

For normal English, use ordinary text.

Do not put ordinary English inside LaTeX.

For example, do NOT write:

\\\\text{The answer is } x=5

Instead write:

The answer is \\\\(x=5\\\\).

Keep paragraphs short.

Use line breaks when they improve readability.

If the user asks a mathematical question:

- Explain naturally.
- Use steps when useful.
- Use proper LaTeX for every mathematical expression.
- Make the mathematics easy to read.

Supported mathematical notation includes:

\\\\frac{a}{b}

x^2

\\\\sqrt{x}

\\\\sin(x)

\\\\cos(x)

\\\\tan(x)

\\\\pi

\\\\int

\\\\sum

\\\\times

\\\\div

\\\\pm

\\\\leq

\\\\geq

User message:

{{MESSAGE}}
`;

// ================================
// BUILD CONVERSATION HISTORY
// ================================

function buildHistory(history = []) {
  const contents = [];

  for (const item of history) {
    if (item.user?.trim()) {
      contents.push({
        role: "user",
        parts: [
          {
            text: item.user,
          },
        ],
      });
    }

    if (item.assistant?.trim()) {
      contents.push({
        role: "model",
        parts: [
          {
            text: item.assistant,
          },
        ],
      });
    }
  }

  return contents;
}

// ================================
// CLEAN JSON
// ================================

function cleanJSON(text = "") {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

// ================================
// FOOTER
// ================================

function appendFooter(text = "") {
  return text.trim();
}

// ================================
// GEMINI FALLBACK ENGINE
// ================================

async function generateWithFallback(contents) {
  if (API_KEYS.length === 0) {
    throw new Error(
      "No Gemini API keys found in your environment variables."
    );
  }

  let lastError = null;

  for (
    let keyIndex = 0;
    keyIndex < API_KEYS.length;
    keyIndex++
  ) {
    const currentApiKey = API_KEYS[keyIndex];

    const ai = new GoogleGenAI({
      apiKey: currentApiKey,
    });

    for (const model of GEMINI_MODELS) {
      try {
        if (DEBUG) {
          console.log(
            `Trying Key #${keyIndex + 1} with model ${model}...`
          );
        }

        const response = await ai.models.generateContent({
          model,
          contents,
        });

        const text = response.text?.trim();

        if (text) {
          if (DEBUG) {
            console.log(
              `Key #${keyIndex + 1} with ${model} succeeded.`
            );
          }

          return text;
        }
      } catch (error) {
        lastError = error;

        if (DEBUG) {
          console.warn(
            `Key #${keyIndex + 1} with ${model} failed:`,
            error.message
          );
        }

        await new Promise(resolve =>
          setTimeout(resolve, RETRY_DELAY)
        );
      }
    }
  }

  throw lastError;
}

// ================================
// SOLVE MATHEMATICS
// ================================

export async function solveMaths(
  question,
  history = []
) {
  const contents = buildHistory(history);

  const formattedMathPrompt =
    MATH_PROMPT.replaceAll(
      "{{QUESTION}}",
      question
    );

  contents.push({
    role: "user",
    parts: [
      {
        text: formattedMathPrompt,
      },
    ],
  });

  try {
    const raw = await generateWithFallback(contents);

    const parsed = JSON.parse(
      cleanJSON(raw)
    );

    return parsed;
  } catch (error) {
    if (DEBUG) {
      console.error("Solve Error:", error);
    }

    return {
      question,
      criteria: "",
      variables: {},
      steps: [],
      explanation:
        "INCOG AI is temporarily unavailable. Please try again later.",
      answer: "No solution generated.",
    };
  }
}

// ================================
// AI CHAT
// ================================

export async function chatWithAssistant(
  message,
  history = []
) {
  const contents = buildHistory(history);

  const formattedChatPrompt =
    CHAT_PROMPT.replaceAll(
      "{{MESSAGE}}",
      message
    );

  contents.push({
    role: "user",
    parts: [
      {
        text: formattedChatPrompt,
      },
    ],
  });

  try {
    const reply =
      await generateWithFallback(contents);

    return reply;
  } catch (error) {
    if (DEBUG) {
      console.error(error);
    }

    return appendFooter(
      "INCOG AI is temporarily unavailable.\n\nPlease try again later."
    );
  }
}

// ================================
// EXPORTS
// ================================

export {
  buildHistory,
  cleanJSON,
  generateWithFallback,
  appendFooter,
};