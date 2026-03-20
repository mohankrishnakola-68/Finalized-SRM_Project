import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function diagnostic() {
    console.log("Testing Key:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "MISSING");
    
    try {
        // Try listing models first
        const modelList = [];
        // The SDK doesn't have a direct listModels without a weird setup sometimes, 
        // but we can try a direct fetch or just try different versions.
        
        console.log("Attempting gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("SUCCESS with gemini-1.5-flash:", result.response.text());
    } catch (e) {
        console.error("FAILED gemini-1.5-flash:", e.message);
        
        try {
            console.log("Attempting gemini-pro...");
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello");
            console.log("SUCCESS with gemini-pro:", result.response.text());
        } catch (e2) {
            console.error("FAILED gemini-pro:", e2.message);
        }
    }
}

diagnostic();
