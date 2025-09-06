import { Restaurant, WeatherData, UserPreferences, WeatherConditions } from '../types';

export function determineWeatherConditions(weather: WeatherData, preferences: UserPreferences): WeatherConditions {
  return {
    isCold: weather.temp <= preferences.coldThreshold,
    isWarm: weather.temp >= preferences.warmThreshold,
    isRainy: weather.precip >= preferences.rainThreshold,
    isWindy: weather.wind ? weather.wind.speed >= preferences.windThreshold : false,
    temperature: weather.temp,
    precipitation: weather.precip,
    windSpeed: weather.wind?.speed || 0
  };
}

function getCuisineWeights(conditions: WeatherConditions): Record<string, number> {
  const weights: Record<string, number> = {};
  
  if (conditions.isCold) {
    // Cold weather favors warm, hearty foods
    weights['italian'] = 1.3;
    weights['chinese'] = 1.2;
    weights['indian'] = 1.2;
    weights['thai'] = 1.1;
    weights['japanese'] = 1.1;
    weights['soup'] = 1.4;
    weights['steak_house'] = 1.2;
    weights['pizza'] = 1.2;
    weights['cafe'] = 1.1;
    weights['ice_cream'] = 0.5;
  }
  
  if (conditions.isWarm) {
    // Warm weather favors light, fresh foods
    weights['mediterranean'] = 1.3;
    weights['greek'] = 1.2;
    weights['salad'] = 1.4;
    weights['seafood'] = 1.2;
    weights['ice_cream'] = 1.5;
    weights['cafe'] = 1.2;
    weights['juice'] = 1.3;
    weights['vegetarian'] = 1.1;
    weights['soup'] = 0.7;
    weights['steak_house'] = 0.8;
  }
  
  if (conditions.isRainy) {
    // Rainy weather favors comfort foods and indoor dining
    weights['cafe'] = 1.2;
    weights['comfort'] = 1.3;
    weights['soup'] = 1.4;
    weights['bakery'] = 1.2;
    weights['coffee'] = 1.3;
  }
  
  return weights;
}

function getSeatingWeights(conditions: WeatherConditions): { outdoor: number; indoor: number; weather_protection: number } {
  let outdoor = 1.0;
  let indoor = 1.0;
  let weather_protection = 1.0;
  
  if (conditions.isCold) {
    outdoor = 0.3;
    indoor = 1.3;
    weather_protection = 1.2;
  }
  
  if (conditions.isRainy) {
    outdoor = 0.2;
    indoor = 1.4;
    weather_protection = 1.5;
  }
  
  if (conditions.isWindy) {
    outdoor = 0.5;
    indoor = 1.2;
    weather_protection = 1.3;
  }
  
  if (conditions.isWarm && !conditions.isRainy && !conditions.isWindy) {
    outdoor = 1.4;
    indoor = 0.9;
  }
  
  return { outdoor, indoor, weather_protection };
}

function calculateRestaurantScore(
  restaurant: Restaurant,
  conditions: WeatherConditions,
  cuisineWeights: Record<string, number>,
  seatingWeights: { outdoor: number; indoor: number; weather_protection: number }
): number {
  let score = 1.0;
  
  // Base score starts higher for closer restaurants
  const distanceScore = Math.max(0.1, 2 - (restaurant.distance / 5)); // Closer = better
  score *= distanceScore;
  
  // Apply cuisine weighting
  const cuisine = restaurant.cuisine.toLowerCase();
  if (cuisineWeights[cuisine]) {
    score *= cuisineWeights[cuisine];
  }
  
  // Apply seating preferences
  if (restaurant.outdoor_seating) {
    score *= seatingWeights.outdoor;
  } else {
    score *= seatingWeights.indoor;
  }
  
  // Accessibility bonus (small but positive)
  if (restaurant.wheelchair) {
    score *= 1.05;
  }
  
  // Random factor to add some variety (small influence)
  const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95 to 1.05
  score *= randomFactor;
  
  return score;
}

export function rankRestaurants(
  restaurants: Restaurant[],
  weather: WeatherData,
  preferences: UserPreferences
): Restaurant[] {
  const conditions = determineWeatherConditions(weather, preferences);
  const cuisineWeights = getCuisineWeights(conditions);
  const seatingWeights = getSeatingWeights(conditions);
  
  // Calculate scores for all restaurants
  const scoredRestaurants = restaurants.map(restaurant => ({
    ...restaurant,
    score: calculateRestaurantScore(restaurant, conditions, cuisineWeights, seatingWeights)
  }));
  
  // Sort by score in descending order
  return scoredRestaurants.sort((a, b) => (b.score || 0) - (a.score || 0));
}

export function getWeatherSuitabilityText(
  restaurant: Restaurant,
  conditions: WeatherConditions
): string {
  const suitabilityFactors: string[] = [];
  
  if (conditions.isCold) {
    if (['italian', 'chinese', 'indian', 'soup', 'cafe'].includes(restaurant.cuisine.toLowerCase())) {
      suitabilityFactors.push('Warm food for cold weather');
    }
    if (!restaurant.outdoor_seating) {
      suitabilityFactors.push('Indoor seating');
    }
  }
  
  if (conditions.isWarm) {
    if (['mediterranean', 'greek', 'seafood', 'ice_cream', 'salad'].includes(restaurant.cuisine.toLowerCase())) {
      suitabilityFactors.push('Light food for warm weather');
    }
    if (restaurant.outdoor_seating) {
      suitabilityFactors.push('Outdoor seating available');
    }
  }
  
  if (conditions.isRainy) {
    if (!restaurant.outdoor_seating) {
      suitabilityFactors.push('Protected from rain');
    }
    if (['cafe', 'bakery', 'soup'].includes(restaurant.cuisine.toLowerCase())) {
      suitabilityFactors.push('Cozy for rainy weather');
    }
  }
  
  if (conditions.isWindy && !restaurant.outdoor_seating) {
    suitabilityFactors.push('Sheltered from wind');
  }
  
  if (suitabilityFactors.length === 0) {
    return 'Good choice for current weather';
  }
  
  return suitabilityFactors.join(' • ');
}