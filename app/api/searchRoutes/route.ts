import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/searchRoutes
 * 
 * Google Maps Directions API integration for route search
 * 
 * Request body:
 * {
 *   "from": "Kochi",
 *   "to": "Goa",
 *   "mode": "AUTO" | "BUS" | "TRAIN" | "WALK" | "FLIGHT"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "routes": [{
 *     "distance": "150 km",
 *     "duration": "3 hours 30 mins",
 *     "steps": [...],
 *     "transitSegments": [...] (if mode is BUS or TRAIN)
 *   }]
 * }
 */

interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
}

interface TransitSegment {
  mode: string;
  line: string;
  departure: string;
  arrival: string;
  numStops: number;
}

interface RouteResult {
  distance: string;
  duration: string;
  steps: RouteStep[];
  transitSegments?: TransitSegment[];
}

// Map user modes to Google Maps Directions API modes
function mapModeToGoogleMaps(mode: string): { mode: string; transitMode?: string } {
  const modeUpper = mode.toUpperCase();
  
  switch (modeUpper) {
    case 'AUTO':
      return { mode: 'driving' };
    case 'BUS':
      return { mode: 'transit', transitMode: 'bus' };
    case 'TRAIN':
      return { mode: 'transit', transitMode: 'rail' };
    case 'WALK':
      return { mode: 'walking' };
    case 'FLIGHT':
      // Google Maps doesn't support flights directly, use driving as fallback
      // In a real implementation, you'd call a flight API
      return { mode: 'driving' };
    default:
      return { mode: 'driving' };
  }
}

// Format distance from meters to readable string
function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

// Format duration from seconds to readable string
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google Maps API key not configured',
          details: 'Please set GOOGLE_MAPS_API_KEY in your environment variables',
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
          details: 'Please provide a valid "from" location',
        },
        { status: 400 }
      );
    }

    if (!to || typeof to !== 'string' || to.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: 'Please provide a valid "to" location',
        },
        { status: 400 }
      );
    }

    if (!mode || typeof mode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: 'Please provide a valid travel mode (AUTO, BUS, TRAIN, WALK, or FLIGHT)',
        },
        { status: 400 }
      );
    }

    // Map user mode to Google Maps mode
    const { mode: googleMode, transitMode } = mapModeToGoogleMaps(mode);

    // Build Google Maps Directions API URL
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(from.trim())}&destination=${encodeURIComponent(to.trim())}&mode=${googleMode}&key=AIzaSyCXS4fWUqD3BuH10h45EAcNwSHAxBuvp2g`;
    
    // Add transit mode if specified
    if (googleMode === 'transit' && transitMode) {
      url += `&transit_mode=${transitMode}`;
    }

    // Add alternatives to get multiple routes
    url += '&alternatives=true';

    // Call Google Maps Directions API
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data);
      return NextResponse.json(
        {
          success: false,
          error: 'Route search failed',
          details: data.error_message || `Google Maps API returned status: ${data.status}`,
        },
        { status: 400 }
      );
    }

    if (!data.routes || data.routes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No routes found',
          details: `No routes available from "${from}" to "${to}" using ${mode} mode`,
          routes: [],
        },
        { status: 404 }
      );
    }

    // Process routes
    const routes: RouteResult[] = data.routes.map((route: any) => {
      // Get total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;

      // Process legs to get steps and transit segments
      const steps: RouteStep[] = [];
      const transitSegments: TransitSegment[] = [];

      route.legs.forEach((leg: any) => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;

        // Process steps
        if (leg.steps) {
          leg.steps.forEach((step: any) => {
            steps.push({
              instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
              distance: formatDistance(step.distance.value),
              duration: formatDuration(step.duration.value),
            });

            // Extract transit information if available
            if (step.transit_details) {
              const transit = step.transit_details;
              transitSegments.push({
                mode: transit.line?.vehicle?.type || 'transit',
                line: transit.line?.short_name || transit.line?.name || 'Unknown',
                departure: transit.departure_time?.text || 'N/A',
                arrival: transit.arrival_time?.text || 'N/A',
                numStops: transit.num_stops || 0,
              });
            }
          });
        }
      });

      return {
        distance: formatDistance(totalDistance),
        duration: formatDuration(totalDuration),
        steps,
        ...(transitSegments.length > 0 && { transitSegments }),
      };
    });

    return NextResponse.json({
      success: true,
      count: routes.length,
      routes,
    });

  } catch (error) {
    console.error('Route search error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
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

