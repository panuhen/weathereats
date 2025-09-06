// Simple weather cache utility (≤30 min)
const CACHE_KEY = 'weathereats-weather-cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 min in ms

export function getCachedWeather(city: string) {
  const cached = localStorage.getItem(CACHE_KEY + city);
  if (!cached) return null;
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) return null;
  return data;
}

export function setCachedWeather(city: string, data: Record<string, unknown>) {
  localStorage.setItem(CACHE_KEY + city, JSON.stringify({ data, timestamp: Date.now() }));
}
