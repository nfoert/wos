import { GoogleGenAI } from "@google/genai";
import { env } from '$env/dynamic/private';
import { json } from "@sveltejs/kit";
import ollama from 'ollama';

const mode: "ollama" | "gemini" = "gemini";

export async function POST({ request }) {
    const body = await request.json();
    const { events, commitments, goals, tasks } = body;

    console.log(body)

    const prompt = `
    You are assisting the user in organizing their calendar.

    You will recieve information on events they already have in their calendar this week. 
    You will also recieve the user's commitments, goals, and tasks for the week. Your job is to identify where these things fit into their calendar, 
        by creating new calendar events for each of the things they want to accomplish.

    Events represent the events the user already has in their calendar.
    Commitments represent scheduled events the user already knows about for their week. Events should be created exactly to the date and time for this commitment.
    Goals represent a consistent task that should be completed a certain number of hours this week. One or more events can be created to complete this goal.
    Tasks represent a one-time task that should be completed this week. One time slot should be created to complete this task.

    When creating new calendar events, consider the time you're suggesting for the event. 
    Make sure things aren't being scheduled in the middle of the night, unless the user has already blocked out time to sleep.

    The user has the following events: ${JSON.stringify(events)}
    The user has the following commitments: ${JSON.stringify(commitments)}
    The user has the following goals: ${JSON.stringify(goals)}
    The user has the following tasks: ${JSON.stringify(tasks)}

    Return a JSON object with the following format:
    {
        "events": [
            {
                "title": "Event Title",
                "start": "YYYY-MM-DD HH:mm",
                "end": "YYYY-MM-DD HH:mm",
                "description": "Event Description"
            }
        ],
        ...
    }

    ONLY return the JSON object, nothing else. Your response must be valid JSON. Don't include any markdown indicating this text should be formatted as JSON. 
    Don't use newlines (\n), and keep your response in one message.
    This returned JSON data represents events that are to be added to the user's calendar, based on their commitments, goals, and tasks.
    `

    if (mode === "ollama") {
        return await ollama.chat({
            model: "qwen2.5:3b",
            messages: [
                { role: "user", content: prompt }
            ]
        }).then((response) => {
            console.log(response)
            return json(response.message.content)
        }).catch((error) => {
            return json(error.message)
        })
    } else {
        const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    
        try {
            // 2. Await the direct interactions.create promise cleanly without nesting a .then()
            const response = await ai.interactions.create({
                model: "gemini-3.7-flash", // Using the updated model standard
                input: prompt,
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
}
