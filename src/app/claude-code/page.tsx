'use client';

import { useState, useEffect } from 'react';
import { City, WeatherData, Restaurant, UserPreferences, EUROPEAN_CITIES, DEFAULT_PREFERENCES } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { rankRestaurants, determineWeatherConditions } from './utils/ranking';
import { CitySelector } from './components/CitySelector';
import { WeatherPanel } from './components/WeatherPanel';
import { RadiusSlider } from './components/RadiusSlider';
import { RestaurantList } from './components/RestaurantList';
import { PreferencesModal } from './components/PreferencesModal';

export default function WeatherEatsPage() {
  const [selectedCity, setSelectedCity] = useState<City>(EUROPEAN_CITIES[0]); // Helsinki as default
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [radius, setRadius] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('weathereats-preferences', DEFAULT_PREFERENCES);
  
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const debouncedRadius = useDebounce(radius, 500);

  // Fetch weather when city changes
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      
      try {
        const response = await fetch(
          `/claude-code/api/weather?lat=${selectedCity.lat}&lng=${selectedCity.lng}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await response.json();
        setWeather(weatherData);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeatherError('Failed to load weather data');
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  // Fetch restaurants when city or radius changes
  useEffect(() => {
    const fetchRestaurants = async () => {
      setRestaurantsLoading(true);
      setRestaurantsError(null);
      setCurrentPage(0);
      
      try {
        const response = await fetch(
          `/claude-code/api/restaurants?lat=${selectedCity.lat}&lng=${selectedCity.lng}&radius=${debouncedRadius}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }
        
        const restaurantData = await response.json();
        setRestaurants(restaurantData);
      } catch (error) {
        console.error('Restaurant fetch error:', error);
        setRestaurantsError('Failed to load restaurants');
        setRestaurants([]);
      } finally {
        setRestaurantsLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCity, debouncedRadius]);

  // Rank restaurants when weather, restaurants, or preferences change
  const rankedRestaurants = weather && restaurants.length > 0 
    ? rankRestaurants(restaurants, weather, preferences)
    : restaurants;

  // Limit to 30 restaurants max as per requirements
  const limitedRestaurants = rankedRestaurants.slice(0, 30);

  const weatherConditions = weather ? determineWeatherConditions(weather, preferences) : undefined;

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
  };

  const handlePreferencesSave = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            WeatherEats
          </h1>
          <p className="text-gray-600">
            Discover weather-appropriate restaurants in European cities
          </p>
        </div>

        {/* Controls */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
          
          <RadiusSlider
            radius={radius}
            onRadiusChange={setRadius}
            min={1}
            max={10}
          />
          
          <div className="flex items-end">
            <button
              onClick={() => setPreferencesOpen(true)}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Weather Preferences
            </button>
          </div>
        </div>

        {/* Weather Panel */}
        <div className="mb-8">
          <WeatherPanel
            weather={weather}
            city={selectedCity}
            loading={weatherLoading}
            error={weatherError}
          />
        </div>

        {/* Restaurant List */}
        <RestaurantList
          restaurants={limitedRestaurants}
          conditions={weatherConditions}
          loading={restaurantsLoading}
          error={restaurantsError}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
        />

        {/* Preferences Modal */}
        <PreferencesModal
          preferences={preferences}
          onSave={handlePreferencesSave}
          isOpen={preferencesOpen}
          onClose={() => setPreferencesOpen(false)}
        />
      </div>
    </div>
  );
}