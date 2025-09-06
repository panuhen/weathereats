"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EUROPEAN_CITIES } from "../utils/cities";
import { City } from "../types";

interface CitySelectorProps {
  onCityChange: (city: City) => void;
  defaultCity: City;
}

export default function CitySelector({ onCityChange, defaultCity }: CitySelectorProps) {
  const [, setSelectedCity] = React.useState(defaultCity.name);

  const handleValueChange = (value: string) => {
    const city = EUROPEAN_CITIES.find((c) => c.name === value);
    if (city) {
      setSelectedCity(city.name);
      onCityChange(city);
    }
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={defaultCity.name}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>European Cities</SelectLabel>
          {EUROPEAN_CITIES.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}, {city.country}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
