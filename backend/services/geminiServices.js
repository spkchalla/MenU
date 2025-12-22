import { text } from "express";
import geminiClient from "../config/geminiClient.js";

export const generateStructuredResponse = async(inputText) =>{

    if(!inputText) throw new Error("Input text is required");

    // input validated
    // build the prompt
    // call the gemini client here to send the data
    const menuText = inputText;
    const cleanInput = JSON.stringify({text: menuText});
    const prompt = `
You are a backend data transformation system.

Your task is to convert the given mess menu text into a JSON object
that STRICTLY follows the schema described below.

--------------------------------
JSON SCHEMA (STRICT)
--------------------------------

{
  "weekStartDate": "YYYY-MM-DD",
  "days": [
    {
      "day": "Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday",
      "breakfast": { "items": [String] },
      "lunch": { "items": [String] },
      "snacks": { "items": [String] },
      "dinner": { "items": [String] }
    }
  ]
}

--------------------------------
RULES (MANDATORY)
--------------------------------

1. Output ONLY valid JSON.
2. DO NOT include markdown, comments, or explanations.
3. The JSON must be directly parsable using JSON.parse().
4. The "days" array MUST contain EXACTLY 7 entries.
5. Day names must match exactly:
   Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
6. Each meal must contain an "items" array of strings.
7. Ignore page numbers or standalone numbers (e.g. 1, 2, 3).
8. Combine multiline meal items into a single list.
9. Do NOT invent items. Use only what is present in the input.
10. Normalize spacing and capitalization for item names.
11. If a meal has no items, return an empty array (do NOT omit it).

--------------------------------
INPUT TEXT
--------------------------------

${cleanInput}
`;

    const result = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    })
    // receive data and export it

    let rawOutput = result.text;
    rawOutput = rawOutput
  .replace(/```json\s*/i, "")
  .replace(/```\s*$/i, "")
  .trim();
  if (!rawOutput.trim().startsWith("{")) {
    throw new Error("Gemini did not return JSON");
  }

    let structuredJson;
    try{
        structuredJson = JSON.parse(rawOutput);
        console.log("Raw gemini output:\n ", structuredJson)
    }catch(err){
        throw new Error("Failed to parse Gemini ouput as JSON: " + err.message);
    }
    
    return structuredJson;

};
