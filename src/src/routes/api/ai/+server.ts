import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const body = await request.json();

	const {
		events,
		commitments,
		goals,
		tasks
	} = body;

	if (!env.GEMINI_API_KEY) {
		return json(
			{ error: 'GEMINI_API_KEY is missing from .env' },
			{ status: 500 }
		);
	}

	const prompt = `
You are assisting the user in organizing their calendar.

You will receive information about events they already have this week,
along with their commitments, goals, and tasks.

Your job is to create new calendar events that intelligently fit into
their existing schedule.

Rules:

- Never overlap existing events.
- Commitments must happen at their specified date and time.
- Goals may be split into multiple sessions.
- Tasks should be scheduled once.
- Avoid scheduling things during the middle of the night.
- Use reasonable start and end times.
- Do not change existing calendar events.

Existing events:
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

Do not include markdown.
Do not include backticks.
Do not explain your answer.
Only return the JSON object.
`;

	try {
		const ai = new GoogleGenAI({
			apiKey: env.GEMINI_API_KEY
		});

		const response = await ai.models.generateContent({
			model: 'gemini-3.8-flash',
			contents: prompt,
			config: {
				responseMimeType: 'application/json'
			}
		});

		const text = response.text;

		console.log('Gemini response:', text);

		if (!text) {
			throw new Error('Gemini returned an empty response');
		}

		/*
			The Schedule page currently expects response.json()
			to give it a STRING, which it then passes to JSON.parse().
			So we intentionally return the Gemini text as a JSON string.
		*/
		return json(text);
	} catch (error) {
		console.error('Gemini API error');

		if (error instanceof Error) {
			console.error('Message:', error.message);
			console.error(error);

			return json(
				{
					error: error.message
				},
				{ status: 500 }
			);
		}

		console.error(error);

		return json(
			{
				error: 'Unknown Gemini API error'
			},
			{ status: 500 }
		);
	}
}
