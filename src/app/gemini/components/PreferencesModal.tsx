"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PreferencesModalProps {
  onPreferencesChange: (prefs: Record<string, number>) => void;
}

export default function PreferencesModal({ onPreferencesChange }: PreferencesModalProps) {
  const [cold, setCold] = useLocalStorage('pref_cold', 10);
  const [warm, setWarm] = useLocalStorage('pref_warm', 20);
  const [rain, setRain] = useLocalStorage('pref_rain', 50);
  const [wind, setWind] = useLocalStorage('pref_wind', 10);

  const handleSave = () => {
    const prefs = { cold, warm, rain, wind };
    onPreferencesChange(prefs);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Preferences</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="cold-temp" className="text-right">
              Cold Temp (°C)
            </label>
            <Input
              id="cold-temp"
              type="number"
              value={cold}
              onChange={(e) => setCold(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="warm-temp" className="text-right">
              Warm Temp (°C)
            </label>
            <Input
              id="warm-temp"
              type="number"
              value={warm}
              onChange={(e) => setWarm(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="rain-prob" className="text-right">
              Rain (%)
            </label>
            <Input
              id="rain-prob"
              type="number"
              value={rain}
              onChange={(e) => setRain(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="wind-speed" className="text-right">
              Wind (m/s)
            </label>
            <Input
              id="wind-speed"
              type="number"
              value={wind}
              onChange={(e) => setWind(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
