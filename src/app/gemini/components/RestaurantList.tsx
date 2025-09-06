"use client";

import { useEffect, useState } from 'react';
import { City, Restaurant, Weather } from '../types';
import RestaurantCard from './RestaurantCard';
import { rankRestaurants } from '../utils/ranking';

interface RestaurantListProps {
  city: City;
  radius: number;
  weather: Weather | null;
  preferences: Record<string, number>;
}

export default function RestaurantList({ city, radius, weather, preferences }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [rankedRestaurants, setRankedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!city) return;

    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/gemini/api/restaurants?lat=${city.lat}&lon=${city.lng}&radius=${radius}`);
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant data');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurant data');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [city, radius]);

  useEffect(() => {
    if (restaurants.length > 0 && weather) {
      const ranked = rankRestaurants(restaurants, weather, preferences);
      setRankedRestaurants(ranked);
    }
  }, [restaurants, weather, preferences]);

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const pageSize = 10;
  const maxResults = 30;
  const paginatedRestaurants = rankedRestaurants.slice((page - 1) * pageSize, page * pageSize).slice(0, maxResults);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mr-2 bg-gray-200 rounded-lg"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= maxResults || paginatedRestaurants.length < pageSize}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
