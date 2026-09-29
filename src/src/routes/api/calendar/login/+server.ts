import { google } from 'googleapis';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const oauth2Client = new google.auth.OAuth2(
    env.OAUTH_CLIENT_ID,
    env.OAUTH_CLIENT_SECRET,
    'http://localhost:5173/api/calendar/callback'
);

export function GET() {
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
    ];

    const url =
        oauth2Client.generateAuthUrl({
            access_type: 'offline',

            /*
                Forces Google to give us proper consent
                and a refresh token.

                The refresh token is what lets W.O.S.
                stay connected between sessions.
            */
            prompt: 'consent',

            scope: scopes
        });

    throw redirect(302, url);
}
