import { NextRequest, NextResponse } from 'next/server';
import { WeatherData } from '../../types';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const weatherCache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const cacheKey = `${lat},${lng}`;
    const cachedEntry = weatherCache.get(cacheKey);
    
    // Return cached data if it's still fresh
    if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
      return NextResponse.json(cachedEntry.data);
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract precipitation data (rain or snow)
    let precip = 0;
    if (data.rain?.['1h']) {
      precip = data.rain['1h'];
    } else if (data.rain?.['3h']) {
      precip = data.rain['3h'] / 3; // Convert 3h to 1h average
    } else if (data.snow?.['1h']) {
      precip = data.snow['1h'];
    } else if (data.snow?.['3h']) {
      precip = data.snow['3h'] / 3; // Convert 3h to 1h average
    }

    const weatherData: WeatherData = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      precip: precip,
      wind: {
        speed: data.wind?.speed || 0,
        deg: data.wind?.deg || 0
      },
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}