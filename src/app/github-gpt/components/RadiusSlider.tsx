"use client"; // Uncomment this line if using React Server Components and need to opt-in to client rendering
// RadiusSlider component for WeatherEats
import { useRadius } from '../hooks/useRadius';

export default function RadiusSlider() {
  const [radius, setRadius] = useRadius();
  return (
    <div className="mb-4">
      <label htmlFor="radius-slider" className="block text-sm font-medium mb-1">Search Radius: {radius} km</label>
      <input
        id="radius-slider"
        type="range"
        min={1}
        max={10}
        value={radius}
        onChange={e => setRadius(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
