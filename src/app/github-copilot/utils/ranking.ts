
import { Restaurant } from '../types/restaurant';
import { Weather } from '../types/weather';
import { Preferences } from '../types/preferences';
import { City } from '../types/cities';

// Helper: Haversine distance in km
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Weather categories
function getWeatherCategory(weather: Weather, prefs: Preferences) {
  if (weather.temp <= prefs.tempCutoffCold) return 'cold';
  if (weather.temp >= prefs.tempCutoffWarm) return 'warm';
  if (weather.precip >= prefs.rainPercent) return 'rainy';
  if (weather.wind >= prefs.windSpeed) return 'windy';
  return 'moderate';
}

// Weighting factors by category
const WEIGHTS = {
  cold:    { distance: 1, indoor: 2, hotFood: 2 },
  warm:    { distance: 1, outdoor: 2, coldFood: 2 },
  rainy:   { distance: 1, indoor: 2, covered: 2 },
  windy:   { distance: 1, sheltered: 2 },
  moderate:{ distance: 1, balanced: 1 }
} as const;

// Cuisine mapping
const HOT_CUISINES = ['soup', 'bbq', 'indian', 'italian', 'turkish', 'chinese'];
const COLD_CUISINES = ['salad', 'sushi', 'cafe', 'ice_cream', 'greek'];

export function rankRestaurants(restaurants: Restaurant[], weather: Weather, prefs: Preferences, city?: City): Restaurant[] {
  const category = getWeatherCategory(weather, prefs);
  return restaurants
    .map(r => {
      // Calculate distance
      let dist = r.distance;
      if (city) {
        dist = getDistanceKm(city.lat, city.lng, r.location.lat, r.location.lng);
      }
      // Score calculation
      let score = 0;
      // Weather category-specific scoring
      if (category === 'cold') {
        const weights = WEIGHTS.cold;
        if (r.amenities?.includes('indoor')) score += weights.indoor;
        if (r.cuisine.some(c => HOT_CUISINES.includes(c))) score += weights.hotFood;
        score -= dist * weights.distance;
      } else if (category === 'warm') {
        const weights = WEIGHTS.warm;
        if (r.amenities?.includes('outdoor')) score += weights.outdoor;
        if (r.cuisine.some(c => COLD_CUISINES.includes(c))) score += weights.coldFood;
        score -= dist * weights.distance;
      } else if (category === 'rainy') {
        const weights = WEIGHTS.rainy;
        if (r.amenities?.includes('indoor')) score += weights.indoor;
        if (r.amenities?.includes('covered')) score += weights.covered;
        score -= dist * weights.distance;
      } else if (category === 'windy') {
        const weights = WEIGHTS.windy;
        if (r.amenities?.includes('sheltered')) score += weights.sheltered;
        score -= dist * weights.distance;
      } else if (category === 'moderate') {
        const weights = WEIGHTS.moderate;
        score += weights.balanced;
        score -= dist * weights.distance;
      }
      return { ...r, suitabilityScore: score, distance: dist };
    })
    .sort((a, b) => (b.suitabilityScore ?? 0) - (a.suitabilityScore ?? 0));
}
