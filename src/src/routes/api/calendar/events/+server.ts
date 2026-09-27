import { google } from 'googleapis';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
    const tokenData = cookies.get('google_tokens');

    if (!tokenData) {
        throw error(401, 'Not connected to Google Calendar');
    }

    try {
        const tokens = JSON.parse(tokenData);

        const oauth2Client = new google.auth.OAuth2(
            env.OAUTH_CLIENT_ID,
            env.OAUTH_CLIENT_SECRET,
            'http://localhost:5173/api/calendar/callback'
        );

        oauth2Client.setCredentials(tokens);

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        });

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 100,
            singleEvents: true,
            orderBy: 'startTime'
        });

        return json({
            events: response.data.items ?? []
        });
    } catch (err) {
        console.error('Failed to fetch Google Calendar:', err);

        throw error(500, 'Could not fetch Google Calendar events.');
    }
}