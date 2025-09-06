import { NextRequest, NextResponse } from 'next/server';
import { Restaurant } from '../../types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

let lastRequestTime = 0;

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function extractCuisine(tags: Record<string, string>): string {
  if (tags.cuisine) return tags.cuisine;
  if (tags.amenity === 'fast_food') return 'fast_food';
  if (tags.amenity === 'cafe') return 'cafe';
  if (tags.amenity === 'bar') return 'bar';
  if (tags.amenity === 'pub') return 'pub';
  return 'restaurant';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '3');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Apply rate limiting
    await rateLimit();

    // Overpass query to find restaurants, cafes, bars, and fast food places
    const query = `[out:json][timeout:25];
(
  node["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"](around:${radius * 1000},${lat},${lng});
  way["amenity"~"^(restaurant|cafe|fast_food|bar|pub)$"](around:${radius * 1000},${lat},${lng});
);
out center meta;`;

    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    const restaurants: Restaurant[] = data.elements
      .map((element: {
        type: string;
        id: string;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }) => {
        const elementLat = element.lat || element.center?.lat;
        const elementLng = element.lon || element.center?.lon;
        
        if (!elementLat || !elementLng || !element.tags?.name) {
          return null;
        }

        const distance = calculateDistance(lat, lng, elementLat, elementLng);
        
        return {
          id: `${element.type}_${element.id}`,
          name: element.tags.name,
          cuisine: extractCuisine(element.tags),
          distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
          lat: elementLat,
          lng: elementLng,
          outdoor_seating: element.tags.outdoor_seating === 'yes',
          wheelchair: element.tags.wheelchair === 'yes',
          address: element.tags['addr:full'] || 
                  `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street'] || ''}`.trim() ||
                  undefined,
          amenities: []
        };
      })
      .filter((restaurant: Restaurant | null) => restaurant !== null)
      .sort((a: Restaurant, b: Restaurant) => a.distance - b.distance)
      .slice(0, 100); // Limit to 100 restaurants to manage data size

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Restaurant API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant data' },
      { status: 500 }
    );
  }
}