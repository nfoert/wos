import { WEATHER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const body = await request.json();

	const { origin, destination } = body;

	if (!origin || !destination) {
		return json(
			{ error: 'Missing origin or destination' },
			{ status: 400 }
		);
	}

	const response = await fetch(
		'https://routes.googleapis.com/directions/v2:computeRoutes',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': WEATHER_API_KEY,
				'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
			},
			body: JSON.stringify({
				origin: {
					location: {
						latLng: {
							latitude: origin.lat,
							longitude: origin.lon
						}
					}
				},
				destination: {
					location: {
						latLng: {
							latitude: destination.lat,
							longitude: destination.lon
						}
					}
				},
				travelMode: 'DRIVE',
				routingPreference: 'TRAFFIC_AWARE'
			})
		}
	);

	const data = await response.json();

	if (!response.ok) {
		return json(
			{
				error: 'Google Routes API error',
				details: data
			},
			{ status: response.status }
		);
	}

	const route = data.routes?.[0];

	if (!route) {
		return json(
			{ error: 'No route found' },
			{ status: 404 }
		);
	}

	const durationSeconds = Number(
		String(route.duration).replace('s', '')
	);

	return json({
		distanceMeters: route.distanceMeters,
		distanceMiles: route.distanceMeters / 1609.344,
		durationSeconds,
		durationMinutes: durationSeconds / 60
	});
}
