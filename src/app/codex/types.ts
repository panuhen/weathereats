export type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
};

export type WeatherData = {
  temp: number; // Celsius
  condition: string; // e.g., Clear, Clouds, Rain
  humidity: number; // %
  precip: number; // mm/h derived from rain/snow
  windMps: number; // meters per second
};

export type Restaurant = {
  id: string;
  name: string | null;
  cuisine: string | null;
  lat: number;
  lng: number;
  distanceKm: number; // numeric km
  tags?: Record<string, string>;
  suitability?: "great" | "good" | "ok" | "poor";
  score?: number;
};

export type Preferences = {
  tempColdMax: number; // <= cold
  tempWarmMin: number; // >= warm
  rainMmPerHr: number; // threshold considered rainy
  windMps: number; // threshold considered windy
};

