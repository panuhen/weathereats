// Restaurant types for WeatherEats
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string[];
  distance: number; // in km
  amenities?: string[];
  location: { lat: number; lng: number };
  accessibility?: string;
  suitabilityScore?: number;
};
