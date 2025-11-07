import { NextRequest, NextResponse } from 'next/server';

// OpenRouteService API endpoints
const ORS_GEOCODING_URL = 'https://api.openrouteservice.org/geocode/search';
const ORS_DIRECTIONS_URL = 'https://api.openrouteservice.org/v2/directions';

// Map travel modes to ORS profile names
const TRAVEL_MODE_MAP: Record<string, string> = {
  car: 'driving-car',
  bike: 'cycling-regular',
  walk: 'foot-walking',
  driving: 'driving-car',
  cycling: 'cycling-regular',
  walking: 'foot-walking',
};

interface GeocodingResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [lng, lat]
    };
    properties: {
      label: string;
    };
  }>;
}

interface DirectionsResponse {
  routes: Array<{
    summary: {
      distance: number; // in meters
      duration: number; // in seconds
    };
    geometry: {
      coordinates: Array<[number, number]>; // [[lng, lat], ...]
    };
  }>;
}

/**
 * Convert city name to coordinates using OpenRouteService Geocoding API
 */
async function geocodeCity(cityName: string, apiKey: string): Promise<{ lat: number; lng: number; label: string }> {
  const url = `${ORS_GEOCODING_URL}?api_key=${apiKey}&text=${encodeURIComponent(cityName)}&size=1`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Geocoding failed for "${cityName}": ${response.statusText} - ${errorText}`);
  }

  const data: GeocodingResponse = await response.json();

  if (!data.features || data.features.length === 0) {
    throw new Error(`Location not found for "${cityName}". Please check the city name and try again.`);
  }

  const feature = data.features[0];
  const [lng, lat] = feature.geometry.coordinates;

  return {
    lat,
    lng,
    label: feature.properties.label,
  };
}

/**
 * Get route between two coordinates using OpenRouteService Directions API
 */
async function getRoute(
  fromCoords: { lat: number; lng: number },
  toCoords: { lat: number; lng: number },
  mode: string,
  apiKey: string
): Promise<{ distance_km: number; duration_hr: number; coordinates: Array<[number, number]> }> {
  const profile = TRAVEL_MODE_MAP[mode.toLowerCase()] || 'driving-car';
  const url = `${ORS_DIRECTIONS_URL}/${profile}`;

  const requestBody = {
    coordinates: [
      [fromCoords.lng, fromCoords.lat],
      [toCoords.lng, toCoords.lat],
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Route planning failed: ${response.statusText} - ${errorText}`);
  }

  const data: DirectionsResponse = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found between the specified locations.');
  }

  const route = data.routes[0];
  const distance_km = parseFloat((route.summary.distance / 1000).toFixed(2)); // Convert meters to km
  const duration_hr = parseFloat((route.summary.duration / 3600).toFixed(2)); // Convert seconds to hours

  // Convert coordinates from [lng, lat] to [lat, lng] for easier map integration
  const coordinates: Array<[number, number]> = route.geometry.coordinates.map(
    ([lng, lat]) => [lat, lng]
  );

  return {
    distance_km,
    duration_hr,
    coordinates,
  };
}

/**
 * POST /api/route-planner
 * 
 * Request body:
 * {
 *   "from": "Mumbai",
 *   "to": "Pune", 
 *   "mode": "car" | "bike" | "walk"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "from": { "city": "Mumbai", "lat": ..., "lng": ... },
 *     "to": { "city": "Pune", "lat": ..., "lng": ... },
 *     "distance_km": 150.5,
 *     "duration_hr": 2.5,
 *     "coordinates": [[lat, lng], ...]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.ORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenRouteService API key not configured',
          details: 'Please set ORS_API_KEY in your environment variables',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { from, to, mode } = body;

    // Validate input
    if (!from || typeof from !== 'string' || from.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: 'Please provide a valid "from" city name',
        },
        { status: 400 }
      );
    }

    if (!to || typeof to !== 'string' || to.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: 'Please provide a valid "to" city name',
        },
        { status: 400 }
      );
    }

    if (!mode || typeof mode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: 'Please provide a valid travel mode (car, bike, or walk)',
        },
        { status: 400 }
      );
    }

    // Validate travel mode
    const normalizedMode = mode.toLowerCase();
    if (!TRAVEL_MODE_MAP[normalizedMode]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid travel mode',
          details: `Travel mode must be one of: ${Object.keys(TRAVEL_MODE_MAP).join(', ')}`,
        },
        { status: 400 }
      );
    }

    console.log(`Planning route from "${from}" to "${to}" via ${normalizedMode}...`);

    // Step 1: Geocode "from" city
    const fromLocation = await geocodeCity(from, apiKey);
    console.log(`From: ${fromLocation.label} (${fromLocation.lat}, ${fromLocation.lng})`);

    // Step 2: Geocode "to" city
    const toLocation = await geocodeCity(to, apiKey);
    console.log(`To: ${toLocation.label} (${toLocation.lat}, ${toLocation.lng})`);

    // Step 3: Get route
    const routeData = await getRoute(fromLocation, toLocation, normalizedMode, apiKey);
    console.log(`Route found: ${routeData.distance_km} km, ${routeData.duration_hr} hours`);

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        from: {
          city: from,
          label: fromLocation.label,
          lat: fromLocation.lat,
          lng: fromLocation.lng,
        },
        to: {
          city: to,
          label: toLocation.label,
          lat: toLocation.lat,
          lng: toLocation.lng,
        },
        mode: normalizedMode,
        profile: TRAVEL_MODE_MAP[normalizedMode],
        distance_km: routeData.distance_km,
        duration_hr: routeData.duration_hr,
        coordinates: routeData.coordinates,
      },
    });

  } catch (error: any) {
    console.error('Route planning error:', error);

    // Handle specific error types
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Location not found',
          details: error.message,
        },
        { status: 404 }
      );
    }

    if (error.message?.includes('Geocoding failed') || error.message?.includes('Route planning failed')) {
      return NextResponse.json(
        {
          success: false,
          error: 'External API error',
          details: error.message,
        },
        { status: 502 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Route planning failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
