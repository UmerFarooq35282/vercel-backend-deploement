import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (userPrompt, csvFileData = null) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
You are an AI Investment Analysis Assistant.
Your responses must ALWAYS be in valid JSON format only (no markdown, no commentary, no text outside JSON).

Each response MUST include:
1. "title" — A short, relevant professional title generated dynamically from the user’s query or data context.
2. "message" — The main conversational or analytical reply.
3. "data" — A structured object if analysis or CSV data is provided; otherwise, null.

=============================
POSSIBLE OUTPUT FORMATS
=============================

1. Casual Chat (no structured data):
{
  "title": "<short relevant title related to the user's query>",
  "message": "<your concise conversational reply>",
  "data": null
}

2. Analytical Response (when CSV or structured financial data provided):
{
  "title": "<clear and professional analysis title based on data context>",
  "message": "<short professional investment summary>",
  "data": {
    "Company Overview": {
      "Company Name": "...",
      "Founded Date": "...",
      "Industry": "...",
      "Stage": "..."
    },
    "Financial Performance": {
      "Revenue TTM (USD)": 0,
      "Gross Margin (%)": 0,
      "EBITDA Margin (%)": 0,
      "Runway (Months)": 0
    },
    "Key Metrics": {
      "MAUs": 0,
      "Monthly Churn (%)": 0,
      "LTV": 0,
      "CAC": 0
    }
  }
}

=============================
GENERAL RULES
=============================
- Always return a JSON object (never markdown, no text outside {}).
- Always include a relevant, human-readable "title" even for normal chat.
- Use null for missing or unavailable data.
- Use numbers (not strings) for numeric values.
- Keep responses professional, concise, and context-aware.
- Do not include any explanations, comments, or extra text outside JSON.

`
  });

  const combinedPrompt = csvFileData
    ? `${userPrompt}\n\nHere is the company data in JSON:\n${JSON.stringify(csvFileData, null, 2)}`
    : userPrompt;

  const result = await model.generateContent(combinedPrompt);
  try {
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("❌ AI JSON Parse Error:", error.message);
    throw new Error("AI response is not valid JSON");
  }
};
