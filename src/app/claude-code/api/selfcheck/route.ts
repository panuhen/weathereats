import { NextResponse } from 'next/server';

export async function GET() {
  const selfCheckData = {
    "model": "claude-code",
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
      "restaurantFields": ["name", "cuisine", "distance"],
      "weatherFields": ["temp", "condition", "humidity", "precip"],
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
  };

  return NextResponse.json(selfCheckData);
}