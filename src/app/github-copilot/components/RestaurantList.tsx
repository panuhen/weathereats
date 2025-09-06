"use client";

import { useEffect, useState } from 'react';
import { useCity } from '../hooks/useCity';
import { useRadius } from '../hooks/useRadius';
import { usePagination } from '../hooks/usePagination';
import { usePreferences } from '../hooks/usePreferences';
import { Restaurant } from '../types/restaurant';
import { Weather } from '../types/weather';
import { rankRestaurants } from '../utils/ranking';

export default function RestaurantList() {
  const [city] = useCity();
  const [radius] = useRadius();
  const { page, setPage, pageSize, maxResults } = usePagination();
  const [prefs] = usePreferences();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather for ranking
  useEffect(() => {
    fetch(`/github-gpt/api/weather?lat=${city.lat}&lng=${city.lng}`)
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => setWeather(null));
  }, [city]);

  // Fetch restaurants
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/github-gpt/api/restaurants?lat=${city.lat}&lng=${city.lng}&radius=${radius}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setRestaurants(data);
      })
      .catch(() => setError('Failed to load restaurants'))
      .finally(() => setLoading(false));
  }, [city, radius]);

  // Apply ranking
  const ranked = weather ? rankRestaurants(restaurants, weather, prefs) : restaurants;
  // Pagination
  const paged = ranked.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div className="mb-4 animate-pulse">Loading restaurants...</div>;
  if (error) return <div className="mb-4 text-red-500">{error}</div>;
  if (!restaurants.length) return <div className="mb-4">No restaurants found.</div>;

  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">Restaurants ({ranked.length} found)</div>
      <div className="grid gap-2">
        {paged.map(r => (
          <div key={r.id} className="p-3 bg-white rounded shadow flex flex-col">
            <div className="font-bold">{r.name}</div>
            <div className="text-sm">Cuisine: {r.cuisine.join(', ') || 'Unknown'}</div>
            <div className="text-sm">Distance: {r.distance?.toFixed(2) || '?'} km</div>
            <div className="text-xs">Suitability: {r.suitabilityScore?.toFixed(2) || 'N/A'}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 bg-gray-200 rounded">Prev</button>
        <span>Page {page}</span>
        <button disabled={page * pageSize >= Math.min(ranked.length, maxResults)} onClick={() => setPage(page + 1)} className="px-2 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
}
