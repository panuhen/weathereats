"use client";

import { useEffect, useState } from 'react';
import { City, Weather } from '../types';

interface WeatherPanelProps {
  city: City;
  onWeatherChange: (weather: Weather | null) => void;
}

export default function WeatherPanel({ city, onWeatherChange }: WeatherPanelProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/gemini/api/weather?lat=${city.lat}&lon=${city.lng}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
        onWeatherChange(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        onWeatherChange(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, onWeatherChange]);

  if (loading) {
    return <div>Loading weather...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl font-bold">Weather in {city.name}</h2>
      <p>Temperature: {weather.temp}°C</p>
      <p>Condition: {weather.condition}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Precipitation: {weather.precip} mm</p>
      <p>Wind: {weather.wind} m/s</p>
    </div>
  );
}
