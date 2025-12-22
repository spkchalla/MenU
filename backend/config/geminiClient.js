import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai";
dotenv.config();

if(!process.env.GOOGLE_API_KEY){

    throw new Error("Google api key is missing in the environment");
}

const geminiClient = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

export default geminiClient;