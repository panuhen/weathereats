import { NextResponse } from 'next/server';
import { getDistance } from '../../utils/distance';

let lastRequest = 0;

export async function GET(request: Request) {
  const now = Date.now();
  if (now - lastRequest < 1000) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  lastRequest = now;

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius = searchParams.get('radius');

  if (!lat || !lon || !radius) {
    return NextResponse.json({ error: 'Latitude, longitude, and radius are required' }, { status: 400 });
  }

  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const query = `
    [out:json];
    (
      node[amenity=restaurant](around:${Number(radius) * 1000},${lat},${lon});
      way[amenity=restaurant](around:${Number(radius) * 1000},${lat},${lon});
      relation[amenity=restaurant](around:${Number(radius) * 1000},${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: query,
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch restaurant data' }, { status: response.status });
    }

    const data = await response.json();

    const restaurants = data.elements
      .map((element: {
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: { name?: string; cuisine?: string };
      }) => {
        const restaurantLat = element.lat || element.center?.lat;
        const restaurantLon = element.lon || element.center?.lon;

        // Skip elements without valid coordinates
        if (!restaurantLat || !restaurantLon) {
          return null;
        }

        return {
          name: element.tags?.name || 'Unnamed Restaurant',
          cuisine: element.tags?.cuisine || 'Unknown',
          lat: restaurantLat,
          lon: restaurantLon,
          distance: getDistance(Number(lat), Number(lon), restaurantLat, restaurantLon),
        };
      })
      .filter(Boolean);

    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch restaurant data' }, { status: 500 });
  }
}
