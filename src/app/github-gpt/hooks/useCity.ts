// Hook for managing selected city
import { useState } from 'react';
import { City, EUROPEAN_CITIES } from '../types/cities';

export function useCity() {
  const [city, setCity] = useState<City>(EUROPEAN_CITIES[0]); // Default Helsinki
  return [city, setCity] as const;
}
