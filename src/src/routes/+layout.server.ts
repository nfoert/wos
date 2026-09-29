import type { LayoutServerLoad } from './$types';
import { google } from 'googleapis';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const tokenCookie = cookies.get('google_tokens');


    if (!tokenCookie) {
        return {
            calendarStatus: {
                isConnected: false,
                lastChecked: new Date().toISOString()
            }
        };
    }

    try {
        const tokens = JSON.parse(tokenCookie);

        const oauth2Client = new google.auth.OAuth2(
            env.OAUTH_CLIENT_ID,
            env.OAUTH_CLIENT_SECRET,
            'http://localhost:5173/api/calendar/callback'
        );

        oauth2Client.setCredentials(tokens);

        
        oauth2Client.on('tokens', (newTokens) => {
            const updatedTokens = {
                ...tokens,
                ...newTokens
            };

            cookies.set(
                'google_tokens',
                JSON.stringify(updatedTokens),
                {
                    path: '/',
                    httpOnly: true,
                    secure:
                        process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 30
                }
            );
        });

        
        const accessToken =
            await oauth2Client.getAccessToken();

        if (!accessToken.token) {
            throw new Error(
                'Google access token could not be obtained.'
            );
        }

        return {
            calendarStatus: {
                isConnected: true,
                lastChecked: new Date().toISOString()
            }
        };
    } catch (err) {
        console.error(
            'Stored Google login is no longer valid:',
            err
        );

        cookies.delete('google_tokens', {
            path: '/'
        });

        return {
            calendarStatus: {
                isConnected: false,
                lastChecked: new Date().toISOString()
            }
        };
    }
};
