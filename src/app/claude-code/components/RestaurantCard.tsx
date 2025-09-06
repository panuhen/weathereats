'use client';

import { Restaurant, WeatherConditions } from '../types';
import { getWeatherSuitabilityText } from '../utils/ranking';

interface RestaurantCardProps {
  restaurant: Restaurant;
  conditions?: WeatherConditions;
}

export function RestaurantCard({ restaurant, conditions }: RestaurantCardProps) {
  const suitabilityText = conditions ? getWeatherSuitabilityText(restaurant, conditions) : '';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
          {restaurant.name}
        </h3>
        <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
          {restaurant.distance} km
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {restaurant.cuisine}
        </span>
        {restaurant.outdoor_seating && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Outdoor
          </span>
        )}
        {restaurant.wheelchair && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            ♿
          </span>
        )}
      </div>

      {restaurant.address && (
        <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
      )}

      {suitabilityText && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            <span className="font-medium">Weather suitable:</span> {suitabilityText}
          </p>
        </div>
      )}

      {restaurant.score && (
        <div className="mt-2 text-xs text-gray-500">
          Suitability score: {restaurant.score.toFixed(2)}
        </div>
      )}
    </div>
  );
}