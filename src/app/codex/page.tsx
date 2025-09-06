"use client";

import { useEffect, useMemo, useState } from "react";
import { EUROPEAN_CITIES } from "./data/cities";
import type { City, Preferences, Restaurant, WeatherData } from "./types";
import { rankRestaurants } from "./utils/ranking";
import { useLocalStorage } from "./utils/useLocalStorage";

const DEFAULT_RADIUS_KM = 3;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useOnline() {
  const [online, setOnline] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

export default function Codex() {
  const [city, setCity] = useState<City>(EUROPEAN_CITIES[0]);
  const [radiusKm, setRadiusKm] = useState<number>(DEFAULT_RADIUS_KM);
  const debouncedRadiusKm = useDebouncedValue(radiusKm, 400);
  const online = useOnline();

  // Preferences persisted
  const [prefs, setPrefs] = useLocalStorage<Preferences>("codex-prefs", {
    tempColdMax: 5,
    tempWarmMin: 22,
    rainMmPerHr: 0.5,
    windMps: 8,
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // pagination
  const pageSize = 10;
  const maxResults = 30;

  // Fetch weather when city changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingWeather(true);
      setError(null);
      try {
        const u = new URL(`/codex/api/weather`, window.location.origin);
        u.searchParams.set("lat", String(city.lat));
        u.searchParams.set("lng", String(city.lng));
        const res = await fetch(u.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(`Weather error ${res.status}`);
        const data = (await res.json()) as WeatherData;
        if (!cancelled) setWeather(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(msg || "Failed to load weather");
      } finally {
        if (!cancelled) setLoadingWeather(false);
      }
    }
    if (online) load();
    return () => {
      cancelled = true;
    };
  }, [city, online]);

  // Fetch restaurants when city or radius changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoadingRestaurants(true);
      setError(null);
      try {
        const u = new URL(`/codex/api/restaurants`, window.location.origin);
        u.searchParams.set("lat", String(city.lat));
        u.searchParams.set("lng", String(city.lng));
        u.searchParams.set("radiusKm", String(debouncedRadiusKm));
        const res = await fetch(u.toString(), { cache: "no-store" });
        if (!res.ok) throw new Error(`Restaurants error ${res.status}`);
        const data = (await res.json()) as Restaurant[];
        if (!cancelled) setRestaurants(data || []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(msg || "Failed to load restaurants");
      } finally {
        if (!cancelled) setLoadingRestaurants(false);
      }
    }
    if (online) load();
    return () => {
      cancelled = true;
    };
  }, [city, debouncedRadiusKm, online]);

  // Ranked and paginated
  const ranked = useMemo(() => {
    const list = rankRestaurants(restaurants, weather, prefs);
    return list.slice(0, maxResults);
  }, [restaurants, weather, prefs]);

  useEffect(() => {
    // reset page on inputs change
    setPage(1);
  }, [city, debouncedRadiusKm]);

  const totalPages = Math.max(1, Math.ceil(ranked.length / pageSize));
  const pageItems = ranked.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">WeatherEats – Codex</h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City
          </label>
          <select
            id="city"
            className="w-full rounded border bg-white text-gray-900 p-2"
            value={`${city.lat},${city.lng}`}
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(",").map(Number);
              const found = EUROPEAN_CITIES.find((c) => c.lat === lat && c.lng === lng);
              if (found) setCity(found);
            }}
          >
            {EUROPEAN_CITIES.map((c) => (
              <option key={`${c.name}-${c.lat}`} value={`${c.lat},${c.lng}`}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="radius" className="block text-sm font-medium mb-1">
            Radius: {radiusKm} km
          </label>
          <input
            id="radius"
            type="range"
            min={1}
            max={10}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full"
            aria-label="Search radius in kilometers"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            className="rounded bg-blue-600 text-white px-3 py-2 border border-blue-600"
            onClick={() => (document.getElementById("prefs-modal") as HTMLDialogElement)?.showModal()}
          >
            Preferences
          </button>
          <a
            className="rounded border px-3 py-2"
            href="/codex/api/selfcheck"
            target="_blank"
            rel="noopener noreferrer"
          >
            Selfcheck JSON
          </a>
        </div>
      </div>

      {/* Weather Panel */}
      <div className="mb-4">
        {loadingWeather ? (
          <div className="animate-pulse p-4 border rounded">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ) : weather ? (
          <div className="p-4 border rounded">
            <div className="font-semibold">Weather in {city.name}</div>
            <div className="text-sm text-gray-600">
              {weather.condition} • {Math.round(weather.temp)}°C • Humidity {weather.humidity}% • Precip {weather.precip.toFixed(1)} mm/h • Wind {weather.windMps.toFixed(1)} m/s
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded text-sm">Weather unavailable.</div>
        )}
      </div>

      {/* Errors / Offline */}
      {!online && (
        <div className="mb-4 p-3 border rounded bg-yellow-50 text-yellow-800">
          You appear to be offline. Results may be outdated.
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 border rounded bg-red-50 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            className="ml-4 rounded border px-2 py-1"
            onClick={() => {
              // simple retry by resetting triggers
              setCity({ ...city });
              setRadiusKm((v) => v);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Restaurant List */}
      <div>
        {loadingRestaurants ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageItems.map((r) => (
                <div key={r.id} className="p-4 border rounded focus-within:ring-2 focus-within:ring-blue-500" tabIndex={0}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold mr-2">{r.name || "Unnamed"}</div>
                    <span className={classNames(
                      "text-xs px-2 py-1 rounded border",
                      r.suitability === "great" && "bg-green-50 text-green-700 border-green-200",
                      r.suitability === "good" && "bg-blue-50 text-blue-700 border-blue-200",
                      r.suitability === "ok" && "bg-gray-50 text-gray-700 border-gray-200",
                      r.suitability === "poor" && "bg-yellow-50 text-yellow-800 border-yellow-200"
                    )}>
                      {r.suitability?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{r.cuisine || "Various cuisines"}</div>
                  <div className="text-sm">{r.distanceKm.toFixed(2)} km away</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, ranked.length)} of {ranked.length}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="text-sm">Page {page} / {totalPages}</span>
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Preferences modal */}
      <dialog id="prefs-modal" className="rounded-lg p-0 backdrop:bg-black/40">
        <form method="dialog" className="w-[min(90vw,520px)]">
          <div className="p-4 border-b font-semibold">Preferences</div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cold max (°C)</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={prefs.tempColdMax}
                onChange={(e) => setPrefs({ ...prefs, tempColdMax: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warm min (°C)</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={prefs.tempWarmMin}
                onChange={(e) => setPrefs({ ...prefs, tempWarmMin: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rain threshold (mm/h)</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={prefs.rainMmPerHr}
                onChange={(e) => setPrefs({ ...prefs, rainMmPerHr: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Wind threshold (m/s)</label>
              <input
                type="number"
                className="w-full rounded border p-2"
                value={prefs.windMps}
                onChange={(e) => setPrefs({ ...prefs, windMps: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 p-3 border-t">
            <button className="rounded border px-3 py-1">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
