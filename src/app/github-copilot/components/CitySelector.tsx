
import { EUROPEAN_CITIES } from '../types/cities';
import { useCity } from '../hooks/useCity';

export default function CitySelector() {
  const [city, setCity] = useCity();
  return (
    <div className="mb-4">
      <label htmlFor="city-select" className="block text-sm font-medium mb-1">Select City</label>
      <select
        id="city-select"
        className="w-full p-2 border rounded"
        value={city.name}
        onChange={e => {
          const selected = EUROPEAN_CITIES.find(c => c.name === e.target.value);
          if (selected) setCity(selected);
        }}
      >
        {EUROPEAN_CITIES.map(c => (
          <option key={c.name} value={c.name}>
            {c.name}, {c.country}
          </option>
        ))}
      </select>
    </div>
  );
}
