
import { useState } from 'react';
import { usePreferences } from '../hooks/usePreferences';

export default function PreferencesModal() {
  const [prefs, setPrefs] = usePreferences();
  const [open, setOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: Number(value) }));
  }

  return (
    <div className="mb-4">
      <button onClick={() => setOpen(o => !o)} className="px-3 py-1 bg-blue-500 text-white rounded">
        Preferences
      </button>
      {open && (
        <div className="mt-2 p-4 bg-white rounded shadow">
          <div className="font-semibold mb-2">Weather Preferences</div>
          <label className="block mb-2">
            Cold Temp Cutoff (°C):
            <input type="number" name="tempCutoffCold" value={prefs.tempCutoffCold} onChange={handleChange} className="ml-2 p-1 border rounded w-16" />
          </label>
          <label className="block mb-2">
            Warm Temp Cutoff (°C):
            <input type="number" name="tempCutoffWarm" value={prefs.tempCutoffWarm} onChange={handleChange} className="ml-2 p-1 border rounded w-16" />
          </label>
          <label className="block mb-2">
            Rain % Threshold:
            <input type="number" name="rainPercent" value={prefs.rainPercent} onChange={handleChange} className="ml-2 p-1 border rounded w-16" />
          </label>
          <label className="block mb-2">
            Wind Speed (m/s):
            <input type="number" name="windSpeed" value={prefs.windSpeed} onChange={handleChange} className="ml-2 p-1 border rounded w-16" />
          </label>
          <button onClick={() => setOpen(false)} className="mt-2 px-3 py-1 bg-gray-300 rounded">Close</button>
        </div>
      )}
    </div>
  );
}
