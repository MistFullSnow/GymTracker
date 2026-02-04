import { GoogleGenAI } from "@google/genai";
import { WorkoutLog } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateWeeklyAnalysis = async (logs: WorkoutLog[]) => {
  if (!apiKey) throw new Error("API Key is missing. Check Vercel settings.");
  
  const ai = new GoogleGenAI({ apiKey });

  // Format logs for the prompt
  const logsText = logs.map(l => 
    `Date: ${l.date}, Muscle: ${l.muscleGroup}, Exercise: ${l.exercise}, Weight: ${l.weight}kg, Reps: ${l.reps}, Notes: ${l.notes}`
  ).join('\n');

  const prompt = `
    You are an expert fitness analyst. Analyze the following workout logs for the most recent week compared to previous data.
    
    Data:
    ${logsText}

    Task:
    1. Calculate total volume (weight * reps * sets) per muscle group for this week.
    2. Compare to the previous week if data exists.
    3. Identify max weight improvements.
    4. Provide a factual, numerical summary. NO motivational fluff.

    Return the response as a valid JSON object with this structure:
    {
      "summary": "String containing the text summary",
      "stats": [
        {
          "muscleGroup": "String",
          "totalVolume": Number,
          "percentChange": Number (0 if no previous data),
          "maxWeight": Number
        }
      ]
    }
    DO NOT output Markdown code blocks. Just the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};
