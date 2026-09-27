import { google } from 'googleapis';
import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
    // 1. Extract the authorization code provided by Google's redirection step
    const code = url.searchParams.get('code');
    if (!code) {
        throw error(400, 'Authorization code missing from redirection query params.');
    }

    // 2. Initialize the OAuth2 client config using private environment keys
    const oauth2Client = new google.auth.OAuth2(
        env.OAUTH_CLIENT_ID,
        env.OAUTH_CLIENT_SECRET,
        'http://localhost:5173/api/calendar/callback' // Make sure this exact URI is saved in your Google Console!
    );

    try {
        // 3. Trade the authorization code for security tokens (access_token, refresh_token)
        const { tokens } = await oauth2Client.getToken(code);

        // 4. Save the full tokens payload securely into an HTTP-Only session cookie
        cookies.set('google_tokens', JSON.stringify(tokens), {
            path: '/',
            httpOnly: true,     // Block client-side JavaScript access (prevents token-theft XSS)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies across HTTPS channels in production
            sameSite: 'lax',    // Mitigates cross-site request forgery risks
            maxAge: 60 * 60 * 24 * 30 // Persist tokens locally for 30 days
        });

        // 5. Send the authenticated user back to the visual app homepage 
        throw redirect(303, '/home');

    } catch (err) {
        // If it's an intended SvelteKit redirect event, let it execution pass-through unaltered
        if (err instanceof Error && 'status' in err && err.status === 303) throw err;

        console.error('Google OAuth token trade operation failed:', err);
        throw error(500, 'Could not authenticate authorization code with Google services.');
    }
}
