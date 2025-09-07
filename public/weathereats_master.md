# WeatherEats - Master Requirements & Evaluation

This document contains the complete specification for building the **WeatherEats** app and the rules for evaluation.
Each AI model must read this file and implement their solution inside their own folder.

---

## 1. Project Overview

WeatherEats is a React/Next.js application that helps users discover restaurants in European cities based on **current weather conditions**.
Users select a city, view the weather, and get **weather-appropriate restaurant recommendations**.

---

## 2. Technical Stack Requirements

* **Framework**: Next.js (App Router, TypeScript)
* **Styling**: Tailwind v3 and shadcn/ui components
* **Deployment**: Must build and run on Vercel free tier

---

## 3. Isolation Rules

Each model works **only in its own folder** under `/src/app`:

* `/claude-code`
* `/codex`
* `/gemini`
* `/github-gpt`

You will be told your model name (e.g., `gemini`). Work **exclusively** in `/src/app/<model>` and expose your route at `/<model>`.


You may add components, hooks, utils, types, styles, and API handlers **inside your folder only**.
❌ Do not edit shared files (`layout.tsx`, landing page, configs, etc.).
✅ You may install npm dependencies in the shared `package.json`.

---

## 4. Secrets & Environment Variables

* Place secrets in **`.env.local`** during development (never commit this file).
* In production, set environment variables in **Vercel Project Settings**.
* Keys must never be exposed:

  * Do **not** use `NEXT_PUBLIC_*` for API keys.
  * Do **not** hardcode keys in code or logs.
* All key-bearing requests must be **server-side only** (Route Handlers or Server Components).
* **Security is an evaluation criterion**. Exposing secrets = automatic fail.

Example `.env.local`:

```env
OPENWEATHERMAP_API_KEY=your_key_here
```

---

## 5. Required API Integrations

### 1. Weather API (OpenWeatherMap)

* **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
* **Authentication**: via `OPENWEATHERMAP_API_KEY`
* **Rate Limit**: 1000 calls/day (free tier)
**Data Needed**: Temperature, condition, humidity, **precipitation (rain/snow volume 1h/3h)**

### 2. Restaurant API (OpenStreetMap Overpass)

* **Endpoint**: `https://overpass-api.de/api/interpreter`
* **Authentication**: None (free, open API)
* **Rate Limit**: Be respectful; throttle requests
* **Data Needed**: Restaurant name, cuisine, amenity details, location, distance, accessibility info

---

## 6. Application Flow

1. User selects **one city** from dropdown (25 provided cities).
2. Show **current weather** for selected city.
3. Fetch restaurants within radius using Overpass API.
4. Apply **weather-based filtering and ranking**.
5. Show ranked restaurant list with weather-appropriate recommendations.

---

## 7. European Cities

```javascript
const EUROPEAN_CITIES = [
  { name: "Helsinki", country: "Finland", lat: 60.1699, lng: 24.9384 },
  { name: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { name: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { name: "Dublin", country: "Ireland", lat: 53.3498, lng: -6.2603 },
  { name: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lng: -3.7038 },
  { name: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { name: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { name: "Prague", country: "Czech Republic", lat: 50.0755, lng: 14.4378 },
  { name: "Warsaw", country: "Poland", lat: 52.2297, lng: 21.0122 },
  { name: "Budapest", country: "Hungary", lat: 47.4979, lng: 19.0402 },
  { name: "Bratislava", country: "Slovakia", lat: 48.1486, lng: 17.1077 },
  { name: "Ljubljana", country: "Slovenia", lat: 46.0569, lng: 14.5058 },
  { name: "Zagreb", country: "Croatia", lat: 45.815, lng: 15.9819 },
  { name: "Belgrade", country: "Serbia", lat: 44.7866, lng: 20.4489 },
  { name: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025 },
  { name: "Sofia", country: "Bulgaria", lat: 42.6977, lng: 23.3219 },
  { name: "Athens", country: "Greece", lat: 37.9838, lng: 23.7275 }
];
```

---

## 8. Core Features

### Restaurant Discovery
- Fetch restaurants from Overpass within the radius.
- Render a list (10 per page, max 30). **No map view required (list only).**
- Each card shows: name, cuisine, distance, suitability indicator.

### 8a. Weather-Based Ranking Algorithm (Critical)

Implement a **deterministic ranking function** that reorders restaurant results based on both:
- Current weather data (temperature, precipitation, wind)
- User preference thresholds (from settings modal)

Rules:
- For each weather category (cold, moderate, warm, rainy, windy), apply weighting factors to cuisine type, seating options, and amenities.
- Combine these weights into a **single numeric score** per restaurant.
- Sort restaurants by descending score before rendering.

**Important:**
- Restaurants must always be returned in a **ranked order**, not just filtered.
- The ranking algorithm must be implemented as a **separate utility function** inside your folder (e.g. `/utils/ranking.ts`).
- Code should be structured and testable, not hardcoded conditionals in the UI.

### User Preferences
- Settings modal for thresholds (**temperature cutoffs, rain %, wind speed**).
- Save to `localStorage`.
- Apply preferences in ranking.

---

## 9. UI / UX Requirements

* Mobile-first, responsive design
* Professional appearance with Tailwind spacing & shadcn/ui
* Components:

  * City selector
  * Weather panel
  * Radius slider
  * Restaurant grid/cards
  * Preferences modal
  * Skeleton loading states
  * Error messages with retry

---

## 10. Technical Requirements

* Respectful API usage (rate limit, debounce, cache weather ≤30 min).
* Handle offline gracefully.
* Proper state management.
* Must deploy and run on Vercel.

---

## 11. Evaluation Criteria (100 points total)

### Code Architecture (25 points)

* TypeScript implementation and type definitions (8)
* Component structure and modularity (7) 
* Custom hooks and utilities organization (5)
* Clean separation of concerns (5)

### Required Components (25 points)

* City Selector with 25 cities, default Helsinki (5)
* Weather Panel with complete data display (5)
* Radius Slider (1-10km range, debounced) (5)
* Restaurant List with proper data formatting (5)
* Preferences Modal with persistent settings (3)
* Loading States and skeleton UI (2)

### Functionality (30 points)

* Weather API (OpenWeatherMap) integration (10)
* Restaurant API (Overpass) integration (8)
* Weather-based ranking algorithm implementation (7)
* State management and data caching (3)
* Mobile responsive design (2)

### Technical Quality (15 points)

* TypeScript usage and comprehensive types (5)
* Performance optimizations (debouncing, caching) (4)
* Code quality and maintainability (3)
* Error handling and graceful recovery (3)

### Security (5 points)

* API key protection (server-side only) (3)
* No secrets exposed in client code (2)

---

## 12. Selfcheck & Security Outputs (Required)

Each model must implement:

### 1. Selfcheck Endpoint

Add an API route:

```
/src/app/[model]/api/selfcheck/route.ts
```
- The selfcheck route must not call external APIs or read secrets; it should return static booleans/numbers describing implementation status.
- The "model" field must equal your folder name (e.g., "claude-code").

It must return JSON in this format (all fields present):

```json
{
  "model": "YOUR MODEL NAME (SAME AS DIRECTORY)",
  "functionality": {
    "citySelectorHas25": true,
    "defaultCityIsHelsinki": true,
    "weatherApiIntegrated": true,
    "overpassIntegrated": true,
    "radiusRangeKm": { "min": 1, "max": 10, "default": 3 },
    "pagination": { "pageSize": 10, "maxResults": 30, "works": true },
    "prefsPersisted": true
  },
  "weatherLogic": {
    "coldHandled": true,
    "moderateHandled": true,
    "warmHandled": true,
    "rainHandled": true,
    "windHandled": true
  },
  "dataAccuracy": {
    "restaurantFields": ["name","cuisine","distance"],
    "weatherFields": ["temp","condition","humidity","precip"],
    "distanceIsNumericKm": true
  },
  "codeQuality": {
    "usesTypescript": true,
    "separationApiUiLogic": true,
    "componentsHooksUtilsSplit": true,
    "noDuplicateCodeNoticed": true
  },
  "ux": {
    "responsiveMobileFirst": true,
    "loadingSkeletons": true,
    "errorMessages": true,
    "keyboardNavigable": true
  },
  "performance": {
    "weatherCachedMinutes": 30,
    "radiusDebounced": true,
    "overpassRateLimited": true,
    "noRedundantCallsObserved": true
  }
}
```

### 2. Security Check

Create `/src/app/[model]/security_check.txt` (inside your model folder). Do **not** modify files outside your folder.
It must contain exactly one line:

* `SECRETS_OK` → if no keys are exposed and all API calls are server-side.
* `SECRETS_FAIL` → otherwise.

---

## 13. Collection & Scoring

Evaluator will run:

```bash
BASE_URL=http://localhost:3000 npm run judge
```

This saves all `selfcheck-<model>.json` files into `artifacts/`.
The LLM judge will score them strictly against the rubric above.

---

## 14. Important Notes

* Use only the provided 25 European cities.
* Single-city view only.
* Weather integration is the **core value**.
* Production ready: error handling, loading states, responsive design, secrets safe.

---

**End of Master Requirements**
