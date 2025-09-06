// Server-side restaurant API route for github-gpt
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '3';
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing lat/lng' }, { status: 400 });
  }

  // Overpass API query for restaurants
  const query = `
    [out:json][timeout:25];
    node["amenity"="restaurant"](around:${parseInt(radius) * 1000},${lat},${lng});
    out body;
  `;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    });
    if (!res.ok) throw new Error('Overpass API error');
    const data = await res.json();
    // Map results to restaurant objects
    const restaurants = (data.elements || []).map((el: {
      id: string;
      lat: number;
      lon: number;
      tags: Record<string, string>;
    }) => ({
      id: el.id,
      name: el.tags.name || 'Unknown',
      cuisine: el.tags.cuisine ? el.tags.cuisine.split(';') : [],
      distance: 0, // To be calculated client-side
      amenities: Object.keys(el.tags).filter(k => k !== 'name' && k !== 'cuisine'),
      location: { lat: el.lat, lng: el.lon },
      accessibility: el.tags['wheelchair'] || undefined
    }));
    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}
