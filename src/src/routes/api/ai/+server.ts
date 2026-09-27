import { GoogleGenAI } from "@google/genai";
import { env } from '$env/dynamic/private';
import { json } from "@sveltejs/kit";

export async function GET() {
    // 1. Ensure you use your Google Gemini/AI Studio key here, not an OpenAI key
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

    try {
        // 2. Await the direct interactions.create promise cleanly without nesting a .then()
        const response = await ai.interactions.create({
            model: "gemini-3.6-flash", // Using the updated model standard
            input: "Explain how AI works in a few words",
        });

        // 3. Google's GenAI SDK returns the completion text under 'output_text'
        return json({ text: response.output_text });
        
    } catch (error) {
        console.error("Gemini API error:", error);
        return json(
            { error: error instanceof Error ? error.message : "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
