import { google } from 'googleapis';
import { json, error, type Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function createGoogleClient(cookies: Cookies) {
    const tokenData =
        cookies.get(
            'google_tokens'
        );

    if (!tokenData) {
        throw error(
            401,
            'Google Calendar is not connected.'
        );
    }

    const tokens =
        JSON.parse(tokenData);

    const oauth2Client =
        new google.auth.OAuth2(
            env.OAUTH_CLIENT_ID,
            env.OAUTH_CLIENT_SECRET,
            'http://localhost:5173/api/calendar/callback'
        );

    oauth2Client.setCredentials(
        tokens
    );

    /*
        If Google refreshes the access token,
        save the new credentials back into
        the cookie.
    */
    oauth2Client.on(
        'tokens',
        (newTokens) => {

            const updatedTokens = {
                ...tokens,
                ...newTokens
            };

            cookies.set(
                'google_tokens',
                JSON.stringify(
                    updatedTokens
                ),
                {
                    path: '/',
                    httpOnly: true,
                    secure:
                        process.env.NODE_ENV ===
                        'production',
                    sameSite: 'lax',
                    maxAge:
                        60 *
                        60 *
                        24 *
                        30
                }
            );
        }
    );

    return oauth2Client;
}

/*
    Gemini returns times like:

    2026-09-28 09:00

    Google wants:

    2026-09-28T09:00:00
*/
function normalizeDateTime(
    value: string
): string {

    let normalized =
        value
            .trim()
            .replace(
                ' ',
                'T'
            );

    /*
        YYYY-MM-DDTHH:mm
    */
    if (
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
            normalized
        )
    ) {
        normalized += ':00';
    }

    return normalized;
}


/*
    GET
    Loads events from the user's primary calendar.
*/
export async function GET({
    cookies
}) {
    const oauth2Client =
        createGoogleClient(
            cookies
        );

    try {
        const calendar =
            google.calendar({
                version: 'v3',
                auth:
                    oauth2Client
            });

        const response =
            await calendar.events.list({
                calendarId:
                    'primary',

                timeMin:
                    new Date().toISOString(),

                maxResults:
                    100,

                singleEvents:
                    true,

                orderBy:
                    'startTime'
            });

        return json({
            events:
                response.data.items ??
                []
        });

    } catch (err) {

        console.error(
            'Failed to fetch Google Calendar:',
            err
        );

        throw error(
            500,
            'Could not fetch Google Calendar events.'
        );
    }
}


/*
    POST
    Adds the AI-generated events to the user's
    PRIMARY Google Calendar.
*/
export async function POST({
    request,
    cookies
}) {
    const oauth2Client =
        createGoogleClient(
            cookies
        );

    const body =
        await request.json();

    const generatedEvents =
        body?.events;

    const timeZone =
        typeof body?.timeZone ===
        'string'
            ? body.timeZone
            : 'America/New_York';

    if (
        !Array.isArray(
            generatedEvents
        ) ||
        generatedEvents.length === 0
    ) {
        return json(
            {
                error:
                    'There are no generated events to add.'
            },
            {
                status: 400
            }
        );
    }

    const calendar =
        google.calendar({
            version: 'v3',
            auth:
                oauth2Client
        });

    const results =
        await Promise.allSettled(
            generatedEvents.map(
                async (event) => {

                    if (
                        !event?.title ||
                        !event?.start ||
                        !event?.end
                    ) {
                        throw new Error(
                            'Generated event is missing required data.'
                        );
                    }

                    const response =
                        await calendar.events.insert({
                            calendarId:
                                'primary',

                            requestBody: {
                                summary:
                                    event.title,

                                description:
                                    event.description ??
                                    'Scheduled by W.O.S.',

                                start: {
                                    dateTime:
                                        normalizeDateTime(
                                            event.start
                                        ),

                                    timeZone
                                },

                                end: {
                                    dateTime:
                                        normalizeDateTime(
                                            event.end
                                        ),

                                    timeZone
                                }
                            }
                        });

                    return {
                        id:
                            response.data.id,
                        title:
                            response.data.summary
                    };
                }
            )
        );

    const added =
        results.filter(
            (result) =>
                result.status ===
                'fulfilled'
        ).length;

    const failed =
        results.filter(
            (result) =>
                result.status ===
                'rejected'
        ).length;

    /*
        Log failed event inserts individually
        so debugging is much easier.
    */
    results.forEach(
        (result, index) => {

            if (
                result.status ===
                'rejected'
            ) {
                console.error(
                    `Failed to insert event ${index}:`,
                    result.reason
                );
            }
        }
    );

    if (
        added === 0 &&
        failed > 0
    ) {
        return json(
            {
                error:
                    'Google rejected all generated calendar events.',
                added,
                failed
            },
            {
                status: 500
            }
        );
    }

    return json({
        success: true,
        added,
        failed
    });
}
