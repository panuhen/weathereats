import { NextResponse } from "next/server";
import type { WeatherData } from "../../types";

// In-memory cache for weather per lat,lng
type CacheEntry = { ts: number; data: WeatherData };
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat,lng required" }, { status: 400 });
  }

  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    // graceful handling: return dummy minimal data so UI can continue
    const fallback: WeatherData = {
      temp: 12,
      condition: "Unknown",
      humidity: 70,
      precip: 0,
      windMps: 2,
    };
    weatherCache.set(cacheKey, { ts: now, data: fallback });
    return NextResponse.json(fallback);
  }

  const owUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  owUrl.searchParams.set("lat", String(lat));
  owUrl.searchParams.set("lon", String(lng));
  owUrl.searchParams.set("appid", apiKey);
  owUrl.searchParams.set("units", "metric");

  try {
    const res = await fetch(owUrl, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return NextResponse.json({ error: `weather ${res.status}` }, { status: 502 });
    }
    type OpenWeatherResponse = {
      main?: { temp?: number; humidity?: number };
      weather?: Array<{ main?: string }>;
      wind?: { speed?: number };
      rain?: { "1h"?: number; "3h"?: number };
      snow?: { "1h"?: number; "3h"?: number };
    };
    const json = (await res.json()) as OpenWeatherResponse;
    const precip =
      (json.rain?.["1h"] ?? json.rain?.["3h"] ?? 0) + (json.snow?.["1h"] ?? json.snow?.["3h"] ?? 0) || 0;
    const data: WeatherData = {
      temp: Number(json.main?.temp ?? 0),
      condition: String(json.weather?.[0]?.main ?? "Unknown"),
      humidity: Number(json.main?.humidity ?? 0),
      precip: Number(precip || 0),
      windMps: Number(json.wind?.speed ?? 0),
    };
    weatherCache.set(cacheKey, { ts: now, data });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || "weather fetch failed" }, { status: 500 });
  }
}
