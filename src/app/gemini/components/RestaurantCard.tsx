import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-xl font-bold">{restaurant.name}</h3>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Distance: {restaurant.distance.toFixed(2)} km</p>
    </div>
  );
}
