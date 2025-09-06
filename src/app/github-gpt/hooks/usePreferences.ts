// Hook for managing user preferences in localStorage
import { useState, useEffect } from 'react';
import { Preferences } from '../types/preferences';

const DEFAULT_PREFS: Preferences = {
  tempCutoffCold: 10,
  tempCutoffWarm: 22,
  rainPercent: 50,
  windSpeed: 8,
};

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);

  useEffect(() => {
    const stored = localStorage.getItem('weathereats-prefs');
    if (stored) setPrefs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('weathereats-prefs', JSON.stringify(prefs));
  }, [prefs]);

  return [prefs, setPrefs] as const;
}
