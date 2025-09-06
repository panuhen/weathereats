"use client";

import { useEffect, useState } from 'react';
import { useCity } from '../hooks/useCity';
import { Weather } from '../types/weather';

export default function WeatherPanel() {
  const [city] = useCity();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/github-copilot/api/weather?lat=${city.lat}&lng=${city.lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setWeather(data);
      })
      .catch(() => setError('Failed to load weather'))
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return <div className="mb-4 animate-pulse">Loading weather...</div>;
  if (error) return <div className="mb-4 text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <div className="mb-4 p-4 bg-white rounded shadow">
      <div className="font-semibold">Weather in {city.name}</div>
      <div>Temperature: {weather.temp}°C</div>
      <div>Condition: {weather.condition}</div>
      <div>Humidity: {weather.humidity}%</div>
      <div>Precipitation: {weather.precip} mm</div>
      <div>Wind: {weather.wind} m/s</div>
    </div>
  );
}
