import { google } from "googleapis";
import { env } from '$env/dynamic/private';
import { error, json } from "@sveltejs/kit";

export async function GET({ cookies, params }) {
    const tokenCookie = cookies.get('google_tokens');

    // If no cookie exists, return empty events so frontend shows "Connect" button
    if (!tokenCookie) {
        return json({ events: [] });
    }

    const oauth2Client = new google.auth.OAuth2(
        env.OAUTH_CLIENT_ID,
        env.OAUTH_CLIENT_SECRET,
        'http://localhost:5173/api/calendar/callback'
    );

    try {
        const tokens = JSON.parse(tokenCookie);
        oauth2Client.setCredentials(tokens);

        // Handle auto-refreshing expired access tokens via the refresh token
        oauth2Client.on('tokens', (newTokens) => {
            const updatedTokens = { ...tokens, ...newTokens };
            cookies.set('google_tokens', JSON.stringify(updatedTokens), {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7
            });
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // --- Calculate Two-Week Range (This Week & Next Week) ---
        const now = new Date();
        
        // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
        const currentDay = now.getDay(); 
        
        // Calculate Monday of THIS week at 00:00:00
        const startOfWeek = new Date(now);
        const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Handle Sunday edge case
        startOfWeek.setDate(now.getDate() + distanceToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate Sunday night of NEXT week at 23:59:59 (Current Monday + 13 days)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 13); 
        endOfWeek.setHours(23, 59, 59, 999);

        // --- Fetch Filtered Events ---
        const response = await calendar.events.list({
            calendarId: params.calendarId,
            timeMin: startOfWeek.toISOString(), // ISO String format required by Google
            timeMax: endOfWeek.toISOString(),   // Caps the search window to this week
            singleEvents: true,                 // Expands recurring events into individual instances
            orderBy: 'startTime',
        });

        return json({ 
            events: response.data.items || [],
            weekStart: startOfWeek.toLocaleDateString(),
            weekEnd: endOfWeek.toLocaleDateString()
        });
    } catch (err) {
        console.error('Failed to load calendar events:', err);
        throw error(500);
    }
}