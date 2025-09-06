'use client';

import { City, EUROPEAN_CITIES } from '../types';

interface CitySelectorProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export function CitySelector({ selectedCity, onCityChange }: CitySelectorProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select City
      </label>
      <select
        id="city-select"
        value={`${selectedCity.name}, ${selectedCity.country}`}
        onChange={(e) => {
          const selected = EUROPEAN_CITIES.find(
            city => `${city.name}, ${city.country}` === e.target.value
          );
          if (selected) {
            onCityChange(selected);
          }
        }}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {EUROPEAN_CITIES.map((city) => (
          <option key={`${city.name}-${city.country}`} value={`${city.name}, ${city.country}`}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
    </div>
  );
}