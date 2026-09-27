import { WEATHER_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const latitude = url.searchParams.get('lat');
	const longitude = url.searchParams.get('lon');

	if (!latitude || !longitude) {
		return json(
			{ error: 'Missing latitude or longitude' },
			{ status: 400 }
		);
	}

	const weatherUrl =
		`https://weather.googleapis.com/v1/forecast/days:lookup` +
		`?key=${WEATHER_API_KEY}` +
		`&location.latitude=${latitude}` +
		`&location.longitude=${longitude}` +
		`&days=7` +
		`&unitsSystem=IMPERIAL`;

	const response = await fetch(weatherUrl);
	const data = await response.json();

	const simplifiedWeather = data.forecastDays.map((day: any) => ({
		date: `${day.displayDate.year}-${day.displayDate.month}-${day.displayDate.day}`,
		condition: day.daytimeForecast?.weatherCondition?.description?.text,
		high: day.maxTemperature?.degrees,
		low: day.minTemperature?.degrees,
		rainChance: day.daytimeForecast?.precipitation?.probability?.percent
	}));

	return json(simplifiedWeather);
}
