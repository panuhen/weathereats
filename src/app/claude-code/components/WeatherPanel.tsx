'use client';

import Image from 'next/image';
import { WeatherData, City } from '../types';

interface WeatherPanelProps {
  weather: WeatherData | null;
  city: City;
  loading: boolean;
  error: string | null;
}

export function WeatherPanel({ weather, city, loading, error }: WeatherPanelProps) {
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="h-16 w-16 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Weather Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800">No weather data</h3>
        <p className="text-gray-600">Unable to load weather information</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-900">
            {city.name}, {city.country}
          </h3>
          <p className="text-blue-700 capitalize">{weather.description}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-900">{weather.temp}°C</div>
          {weather.icon && (
            <Image
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              width={64}
              height={64}
              className="w-16 h-16 mx-auto"
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-blue-600 font-medium">Humidity</div>
          <div className="text-blue-900">{weather.humidity}%</div>
        </div>
        <div className="text-center">
          <div className="text-blue-600 font-medium">Precipitation</div>
          <div className="text-blue-900">{weather.precip.toFixed(1)}mm</div>
        </div>
        {weather.wind && (
          <div className="text-center">
            <div className="text-blue-600 font-medium">Wind</div>
            <div className="text-blue-900">{weather.wind.speed.toFixed(1)} m/s</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-blue-600 font-medium">Condition</div>
          <div className="text-blue-900">{weather.condition}</div>
        </div>
      </div>
    </div>
  );
}