"use client";

import { useState, useCallback } from 'react';
import CitySelector from './components/CitySelector';
import PreferencesModal from './components/PreferencesModal';
import RadiusSlider from './components/RadiusSlider';
import RestaurantList from './components/RestaurantList';
import WeatherPanel from './components/WeatherPanel';
import { EUROPEAN_CITIES } from './utils/cities';
import { City, Weather } from './types';

export default function GeminiPage() {
  const [selectedCity, setSelectedCity] = useState<City>(EUROPEAN_CITIES[0]);
  const [radius, setRadius] = useState(3);
  const [preferences, setPreferences] = useState({});
  const [weather, setWeather] = useState<Weather | null>(null);

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
  };

  const handleRadiusChange = (radius: number) => {
    setRadius(radius);
  };

  const handlePreferencesChange = (prefs: Record<string, number>) => {
    setPreferences(prefs);
  };

  const handleWeatherChange = useCallback((weather: Weather | null) => {
    setWeather(weather);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">WeatherEats</h1>
      <CitySelector onCityChange={handleCityChange} defaultCity={selectedCity} />
      <WeatherPanel city={selectedCity} onWeatherChange={handleWeatherChange} />
      <RadiusSlider defaultValue={radius} min={1} max={10} onRadiusChange={handleRadiusChange} />
      <PreferencesModal onPreferencesChange={handlePreferencesChange} />
      <RestaurantList city={selectedCity} radius={radius} weather={weather} preferences={preferences} />
    </div>
  );
}
