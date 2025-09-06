
export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  precip: number;
  wind: number;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  distance: number;
  suitability: number;
}
