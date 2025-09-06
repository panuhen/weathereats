import { NextResponse } from 'next/server';

const cache = new Map();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  const cacheKey = `${lat},${lon}`;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenWeatherMap API key not configured' }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `Failed to fetch weather data: ${errorData.message}` }, { status: response.status });
    }

    const data = await response.json();

    const weather = {
      temp: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      precip: data.rain?.['1h'] || data.snow?.['1h'] || 0,
      wind: data.wind.speed,
    };

    cache.set(cacheKey, { data: weather, timestamp: Date.now() });

    return NextResponse.json(weather);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
