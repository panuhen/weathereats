'use client';

interface RadiusSliderProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function RadiusSlider({ 
  radius, 
  onRadiusChange, 
  min = 1, 
  max = 10, 
  step = 0.5 
}: RadiusSliderProps) {
  return (
    <div className="w-full max-w-md">
      <label htmlFor="radius-slider" className="block text-sm font-medium text-gray-700 mb-2">
        Search Radius: {radius} km
      </label>
      <input
        id="radius-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={radius}
        onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min} km</span>
        <span>{max} km</span>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}