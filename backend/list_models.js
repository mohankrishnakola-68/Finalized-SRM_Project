import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
    console.log("Checking for available models...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("HTTP Error:", response.status, response.statusText);
            const body = await response.text();
            console.error("Body:", body);
            return;
        }
        const data = await response.json();
        console.log("Available Models Found:", data.models?.length || 0);
        data.models?.forEach(m => console.log(` - ${m.name}`));
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}

checkModels();
