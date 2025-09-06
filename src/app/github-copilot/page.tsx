import WeatherPanel from './components/WeatherPanel';
import RestaurantList from './components/RestaurantList';
import RadiusSlider from './components/RadiusSlider';

export default function Codex() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-foreground">Github Copilot</h1>
      <WeatherPanel />
      <RadiusSlider />
      <RestaurantList />
    </div>
  );
}