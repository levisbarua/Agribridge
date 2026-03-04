import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

console.log("Key found:", !!apiKey);

const ai = new GoogleGenAI({ apiKey });

async function run() {
    try {
        console.log("Sending request...");
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: 'say hello',
        });
        console.log("Response:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
