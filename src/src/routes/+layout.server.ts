import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    // 1. Inspect the secure session cookie store
    const tokenCookie = cookies.get('google_tokens');

    // 2. Safely verify token existence
    if (!tokenCookie) {
        return {
            calendarStatus: {
                isConnected: false,
                lastChecked: new Date().toISOString()
            }
        };
    }

    try {
        // 3. Ensure the token data is structurally sound JSON
        JSON.parse(tokenCookie);

        return {
            calendarStatus: {
                isConnected: true,
                lastChecked: new Date().toISOString()
            }
        };
    } catch {
        // If the cookie is corrupted, proactively clean it up
        cookies.delete('google_tokens', { path: '/' });
        
        return {
            calendarStatus: {
                isConnected: false,
                lastChecked: new Date().toISOString()
            }
        };
    }
};
