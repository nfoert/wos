import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
    const tokenData = cookies.get('google_tokens');

    if (tokenData) {
        try {
            const tokens = JSON.parse(tokenData);

            const token = tokens.refresh_token ?? tokens.access_token;

            if (token) {
                await fetch('https://oauth2.googleapis.com/revoke', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        token
                    })
                });
            }
        } catch (err) {
            console.error('Failed to revoke Google token:', err);
        }
    }

    cookies.delete('google_tokens', {
        path: '/'
    });

    throw redirect(303, '/');
}