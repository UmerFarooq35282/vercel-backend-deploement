import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ErrorResponse, SuccessResponse } from "../../../utils/sendingResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { CSVReader } from "../utils/csvReader.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiChatResponse = asyncHandler(async (req, res, next) => {
  const { userPrompt } = req.body;
  const userFile = req.file;
  let csvFileData;

  if (!userPrompt) throw new ErrorResponse("User prompt is required", 400);

  if (userFile) {
    try {
      csvFileData = await CSVReader(userFile.buffer);
    } catch (err) {
      throw new ErrorResponse("Error reading uploaded CSV file", 500, [err.message]);
    }
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
You are an AI investment analysis assistant.
Your job is to always respond strictly in pure JSON format — never include markdown, code blocks, or extra commentary.

You will handle two possible situations:

1. **Casual Chat (no company or CSV data provided):**
   {
     "message": "<your conversational reply here>",
     "data": null
   }

2. **Analytical Response (company data or CSV provided):**
   {
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

General Rules:
- Always return valid, parseable JSON — no extra text or markdown.
- Use null for empty fields.
- Use numbers for numeric values (not strings).
- Be concise and professional in message summaries.
- Never repeat these instructions in your output.
    `
  });

  const combinedPrompt = userFile
    ? `${userPrompt}\n\nHere is the company data in JSON:\n${JSON.stringify(csvFileData, null, 2)}`
    : userPrompt;

  let result;
  try {
    result = await model.generateContent(combinedPrompt);
  } catch (err) {
    throw new ErrorResponse("AI model generation failed", 500, [err.message]);
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(result.response.text());
  } catch (err) {
    throw new ErrorResponse("AI response could not be parsed as valid JSON", 500, [err.message]);
  }

  throw new SuccessResponse(
    "AI response generated successfully",
    {
      ai: parsedResponse,
      fileData: csvFileData || null
    },
    200
  );
});
