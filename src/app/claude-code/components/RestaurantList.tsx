'use client';

import { Restaurant, WeatherConditions } from '../types';
import { RestaurantCard } from './RestaurantCard';

interface RestaurantListProps {
  restaurants: Restaurant[];
  conditions?: WeatherConditions;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function RestaurantList({
  restaurants,
  conditions,
  loading,
  error,
  currentPage,
  pageSize,
  onPageChange
}: RestaurantListProps) {
  const totalPages = Math.ceil(restaurants.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRestaurants = restaurants.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Finding restaurants...</h2>
        <div className="grid gap-4">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Restaurants</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Restaurants Found</h2>
        <p className="text-gray-600">
          Try expanding your search radius or selecting a different city.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Recommended Restaurants ({restaurants.length})
        </h2>
        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {currentRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            conditions={conditions}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index)}
                className={`px-3 py-1 text-sm border rounded ${
                  index === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}