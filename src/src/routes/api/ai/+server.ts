import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const body = await request.json();

    const {
        events,
        commitments,
        goals,
        tasks,
        rangeMode,
        rangeStart,
        rangeEnd
    } = body;

    if (!env.GEMINI_API_KEY) {
        return json(
            {
                error:
                    'GEMINI_API_KEY is missing from .env'
            },
            {
                status: 500
            }
        );
    }

    if (!rangeStart || !rangeEnd) {
        return json(
            {
                error:
                    'Scheduling date range was not provided.'
            },
            {
                status: 400
            }
        );
    }

    const prompt = `
You are the scheduling engine for W.O.S., the Week Optimization System.

Your job is to create an optimized calendar based on the user's existing calendar events, commitments, weekly goals, and tasks.

PLANNING WINDOW:

Start date: ${rangeStart}
End date: ${rangeEnd}
Mode: ${rangeMode}

You MUST schedule every newly created event inside this planning window.

Never create an event before ${rangeStart}.
Never create an event after ${rangeEnd}.

IMPORTANT SCHEDULING RULES:

- Never overlap an existing calendar event.

- Existing calendar events are fixed and may never be moved.

- Commitments are fixed events.

- A commitment contains a weekday and start/end time.

- Commitments should occur on the matching weekday inside the selected planning window.

- If the user selected BOTH weeks, commitments should repeat in both weeks.

- Goals contain a number of hours PER WEEK.

- Goals may be divided into multiple reasonable sessions.

- If BOTH weeks are selected, the requested goal hours apply separately to each week.

Example:
A goal of 6 hours per week across two weeks means approximately 6 hours should be scheduled during week one and another 6 hours during week two.

- Tasks should normally be scheduled once.

- Never schedule a task after its due date.

- Task priority MUST meaningfully affect scheduling.

- High-priority tasks should be given useful and convenient time slots before lower-priority tasks whenever possible.

- High-priority tasks should preferably be completed earlier rather than being pushed to leftover time.

- Medium-priority tasks should be scheduled after high-priority work has been accommodated.

- Low-priority tasks should fill remaining reasonable availability.

- If two tasks compete for the same useful time period, favor the higher-priority task.

- Never move or ignore a fixed commitment merely to fit a task.

- Do not schedule activities in the middle of the night.

- Prefer reasonable waking hours.

- Avoid unnecessarily fragmented schedules.

- Avoid placing several demanding activities directly back-to-back when reasonable alternatives exist.

- Respect all due dates.

- Use the entire selected planning window intelligently.

Existing calendar events:
${JSON.stringify(events)}

Commitments:
${JSON.stringify(commitments)}

Goals:
${JSON.stringify(goals)}

Tasks:
${JSON.stringify(tasks)}

Return ONLY valid JSON in exactly this format:

{
    "events": [
        {
            "title": "Event Title",
            "start": "YYYY-MM-DD HH:mm",
            "end": "YYYY-MM-DD HH:mm",
            "description": "Event Description"
        }
    ]
}

Every start and end date MUST fall between ${rangeStart} and ${rangeEnd}.

Do not include markdown.
Do not include backticks.
Do not explain your answer.
Do not write text before or after the JSON.
Return only the JSON object.
`;

    try {
        const ai =
            new GoogleGenAI({
                apiKey:
                    env.GEMINI_API_KEY
            });

        let response;

for (let attempt = 0; attempt < 4; attempt++) {
    try {
        response = await ai.models.generateContent({
            model: 'gemini-3.1-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        break;
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : String(error);

        const temporaryError =
            message.includes('503') ||
            message.includes('UNAVAILABLE') ||
            message.includes('high demand');

        if (!temporaryError || attempt === 3) {
            throw error;
        }

        const delay = 1000 * Math.pow(2, attempt);

        console.log(
            `Gemini busy. Retrying in ${delay / 1000}s...`
        );

        await new Promise((resolve) =>
            setTimeout(resolve, delay)
        );
    }
}

if (!response) {
    throw new Error(
        'Gemini is temporarily unavailable.'
    );
}


        const text =
            response.text;

        console.log(
            'Gemini response:',
            text
        );

        if (!text) {
            throw new Error(
                'Gemini returned an empty response'
            );
        }

        /*
            Keep returning the text because the frontend
            now safely handles either a JSON string or object.
        */
        return json(text);

    } catch (error) {

        console.error(
            'Gemini API error'
        );

        if (
            error instanceof Error
        ) {
            console.error(
                'Message:',
                error.message
            );

            console.error(
                error
            );

            return json(
                {
                    error:
                        error.message
                },
                {
                    status: 500
                }
            );
        }

        console.error(error);

        return json(
            {
                error:
                    'Unknown Gemini API error'
            },
            {
                status: 500
            }
        );
    }
}
