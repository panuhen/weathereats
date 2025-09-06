import { NextResponse } from "next/server";

// Simple in-memory rate limit: 1 request/2s
let lastCall = 0;
const MIN_INTERVAL_MS = 2000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type OverpassCenter = { lat: number; lon: number };
type OverpassTags = Record<string, string>;
type OverpassElementBase = { id: number; tags?: OverpassTags };
type OverpassNode = OverpassElementBase & { type: "node"; lat: number; lon: number };
type OverpassWayOrRelation = OverpassElementBase & { type: "way" | "relation"; center?: OverpassCenter };
type OverpassElement = OverpassNode | OverpassWayOrRelation;
type OverpassResponse = { elements?: OverpassElement[] };

type OutputItem = {
  id: string;
  name: string | null;
  cuisine: string | null;
  lat: number;
  lng: number;
  distanceKm: number;
  tags: OverpassTags | undefined;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const radiusKm = Number(url.searchParams.get("radiusKm") ?? 3);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "lat,lng required" }, { status: 400 });
  }
  const radiusMeters = Math.max(1, Math.min(10, radiusKm)) * 1000;

  // Rate limit
  const now = Date.now();
  const diff = now - lastCall;
  if (diff < MIN_INTERVAL_MS) {
    await sleep(MIN_INTERVAL_MS - diff);
  }
  lastCall = Date.now();

  const q = `[
    out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      relation["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
    );
    out center 60;
  `;

  const overpassUrl = "https://overpass-api.de/api/interpreter";
  try {
    const res = await fetch(overpassUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: q }),
    });
    if (!res.ok) return NextResponse.json({ error: `overpass ${res.status}` }, { status: 502 });
    const json = (await res.json()) as OverpassResponse;
    const elements: OverpassElement[] = Array.isArray(json?.elements) ? (json.elements as OverpassElement[]) : [];
    const items = elements
      .map((el): OutputItem | null => {
        const center: OverpassCenter | undefined =
          el.type === "node" ? { lat: (el as OverpassNode).lat, lon: (el as OverpassNode).lon } : (el as OverpassWayOrRelation).center;
        const latR = Number(center?.lat);
        const lonR = Number(center?.lon);
        if (!Number.isFinite(latR) || !Number.isFinite(lonR)) return null;
        const dist = haversineKm(lat, lng, latR, lonR);
        const tags = el.tags;
        const cuisine = typeof tags?.cuisine === "string" ? tags.cuisine : null;
        const name = typeof tags?.name === "string" ? tags.name : null;
        return {
          id: `${el.type}-${el.id}`,
          name,
          cuisine,
          lat: latR,
          lng: lonR,
          distanceKm: dist,
          tags,
        };
      })
      .filter((x): x is OutputItem => Boolean(x))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 60); // preliminary cap before ranking on client

    return NextResponse.json(items);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message || "overpass failed" }, { status: 500 });
  }
}
