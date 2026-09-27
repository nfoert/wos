import { env } from '$env/dynamic/private';
import { json, error } from '@sveltejs/kit';
import { google } from 'googleapis';

export async function GET({ cookies }) {
    const tokenCookie = cookies.get('google_tokens');

    if (!tokenCookie) {
        return { calendars: null };
    }

    const oauth2Client = new google.auth.OAuth2(
        env.OAUTH_CLIENT_ID,
        env.OAUTH_CLIENT_SECRET,
        'http://localhost:5173/api/calendar/callback'
    );

    try {
        // FIX 2: Parse the token string and inject it into the client configuration
        const tokens = JSON.parse(tokenCookie);
        oauth2Client.setCredentials(tokens);

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendar.calendarList.list();
        
        return json({ calendars: response.data.items || [] });
    } catch (err) {
        console.error('Failed to load calendar list:', err);
        return json(
            { error: err instanceof Error ? err.message : 'Failed to fetch calendars' }, 
            { status: 500 }
        );
    }
}