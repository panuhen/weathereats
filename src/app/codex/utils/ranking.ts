import type { Preferences, Restaurant, WeatherData } from "../types";

function normalizeCuisine(cuisine: string | null): string[] {
  if (!cuisine) return [];
  return cuisine
    .toLowerCase()
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function distanceScore(distanceKm: number) {
  // Closer is better. 0km => 1.0, 10km => ~0.09
  const s = 1 / (1 + distanceKm);
  return clamp(s);
}

function detectWeatherBuckets(weather: WeatherData | null, prefs: Preferences) {
  const cold = !!(weather && weather.temp <= prefs.tempColdMax);
  const warm = !!(weather && weather.temp >= prefs.tempWarmMin);
  const moderate = !!(weather && !cold && !warm);
  const rainy = !!(weather && weather.precip >= prefs.rainMmPerHr);
  const windy = !!(weather && weather.windMps >= prefs.windMps);
  return { cold, warm, moderate, rainy, windy };
}

function amenityScore(tags: Record<string, string> | undefined, buckets: ReturnType<typeof detectWeatherBuckets>) {
  if (!tags) return 0;
  const outdoor = tags["outdoor_seating"] === "yes";
  const covered = tags["covered"] === "yes" || tags["roof"] === "yes";
  const aircon = tags["air_conditioning"] === "yes";

  let score = 0;
  if (buckets.warm && outdoor) score += 0.25;
  if (buckets.rainy && covered) score += 0.2;
  if (buckets.cold && !outdoor) score += 0.1;
  if (buckets.warm && aircon) score += 0.1;
  return clamp(score);
}

function cuisineScore(cuisines: string[], buckets: ReturnType<typeof detectWeatherBuckets>) {
  let score = 0;
  // Heuristic matches
  const hotComfort = ["soup", "ramen", "noodle", "indian", "thai", "korean", "turkish", "lebanese"];
  const lightFresh = ["salad", "mediterranean", "seafood", "sushi", "greek", "vietnamese"];
  const sweetCold = ["ice_cream", "gelato", "dessert", "cafe"];

  if (buckets.cold) {
    if (cuisines.some((c) => hotComfort.includes(c))) score += 0.35;
    if (cuisines.includes("cafe")) score += 0.1;
  }
  if (buckets.warm) {
    if (cuisines.some((c) => lightFresh.includes(c))) score += 0.25;
    if (cuisines.some((c) => sweetCold.includes(c))) score += 0.25;
  }
  if (buckets.rainy) {
    if (cuisines.includes("soup")) score += 0.2;
    if (cuisines.includes("ramen")) score += 0.2;
  }
  if (buckets.moderate) {
    if (cuisines.includes("pizza") || cuisines.includes("italian")) score += 0.15;
  }
  return clamp(score, 0, 0.7);
}

function suitabilityLabel(score: number) {
  if (score >= 0.75) return "great" as const;
  if (score >= 0.55) return "good" as const;
  if (score >= 0.35) return "ok" as const;
  return "poor" as const;
}

export function rankRestaurants(input: Restaurant[], weather: WeatherData | null, prefs: Preferences): Restaurant[] {
  const buckets = detectWeatherBuckets(weather, prefs);
  const withScores = input.map((r) => {
    const cuisines = normalizeCuisine(r.cuisine);
    const sDist = distanceScore(r.distanceKm) * 0.4; // up to 0.4
    const sAmen = amenityScore(r.tags, buckets) * 0.3; // up to 0.3
    const sCui = cuisineScore(cuisines, buckets); // up to 0.7
    // Combine with weights, clamp to [0,1]
    const score = clamp(sDist + sAmen + sCui, 0, 1);
    return { ...r, score, suitability: suitabilityLabel(score) } as Restaurant;
  });
  // Deterministic: sort by score desc, then name asc, then id asc
  return withScores.sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    const na = (a.name || "").toLowerCase();
    const nb = (b.name || "").toLowerCase();
    if (na !== nb) return na < nb ? -1 : 1;
    return a.id < b.id ? -1 : 1;
  });
}

