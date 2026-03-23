import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// 🧠 HIGH-FIDELITY SYSTEM INSTRUCTION
const SYSTEM_PROMPT = `
You are the Haptic-Q AI Surgical Assistant.
You are embedded in a Remote-Assisted Surgery System.
Your knowledge includes:
- Quantum-Inspired Path Optimization (Cost = Distance + Risk*5)
- QKD-secured communication (QBER metrics)
- AI Vision (OpenCV for boundary detection)
- Real-time Haptics (Vibration sync)

You answer ANY question truthfully and accurately.
Include [ACTION:START_SIMULATION], [ACTION:SIMULATE_INTERCEPT], or [ACTION:TOGGLE_VISION] only when requested.
`;

export async function processQuery(query) {
    if (!API_KEY) {
        return { action: 'NONE', response: "AI configuration missing. Please check your credentials.", mode: 'ERROR' };
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${query}` }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text.trim();

        // Detect Actions
        let action = 'NONE';
        const q = query.toLowerCase();
        if (q.includes('initialize') || q.includes('start simulation')) action = 'START_SIMULATION';
        else if (q.includes('intercept') || q.includes('hacker')) action = 'SIMULATE_INTERCEPT';
        else if (q.includes('vision') || q.includes('overlay')) action = 'TOGGLE_VISION';

        return {
            action: action,
            response: responseText.replace(/\[ACTION:.*?\]/g, '').trim(),
            mode: 'GEMINI_LIVE'
        };

    } catch (e) {
        console.error("Gemini Direct Connect Error:", e.message);
        return {
            action: 'NONE',
            response: "Link Jitter detected. This is usually due to an invalid API key or a network timeout. Please verify your Gemini API key in the configuration.",
            mode: 'LOCAL_FALLBACK'
        };
    }
}
