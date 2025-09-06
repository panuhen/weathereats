"use client";

import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { useDebounce } from '../hooks/useDebounce';

interface RadiusSliderProps {
  defaultValue: number;
  min: number;
  max: number;
  onRadiusChange: (radius: number) => void;
}

export default function RadiusSlider({ defaultValue, min, max, onRadiusChange }: RadiusSliderProps) {
  const [radius, setRadius] = useState(defaultValue);
  const debouncedRadius = useDebounce(radius, 500);

  const handleValueChange = (value: number[]) => {
    setRadius(value[0]);
  };

  useEffect(() => {
    onRadiusChange(debouncedRadius);
  }, [debouncedRadius, onRadiusChange]);

  return (
    <div className="flex items-center space-x-4">
      <label htmlFor="radius-slider">Radius: {radius} km</label>
      <Slider
        id="radius-slider"
        defaultValue={[defaultValue]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleValueChange}
        className="w-64"
      />
    </div>
  );
}
