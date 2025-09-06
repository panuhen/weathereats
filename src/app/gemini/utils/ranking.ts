
import { Restaurant, Weather } from '../types';

export function rankRestaurants(restaurants: Restaurant[], weather: Weather, preferences: Record<string, number>): Restaurant[] {
  return restaurants.map(restaurant => {
    let score = 0;

    // Temperature
    if (weather.temp < preferences.cold) {
      if (restaurant.cuisine.toLowerCase().includes('soup') || restaurant.cuisine.toLowerCase().includes('ramen')) {
        score += 10;
      }
    } else if (weather.temp > preferences.warm) {
      if (restaurant.cuisine.toLowerCase().includes('ice cream') || restaurant.cuisine.toLowerCase().includes('salad')) {
        score += 10;
      }
    }

    // Rain
    if (weather.precip > 0 && weather.precip * 100 > preferences.rain) {
      // No specific scoring for rain yet
    }

    // Wind
    if (weather.wind > preferences.wind) {
      // No specific scoring for wind yet
    }

    return { ...restaurant, suitability: score };
  }).sort((a, b) => b.suitability - a.suitability);
}
