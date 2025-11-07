import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/routes
 * 
 * Gets route information from Google Maps Directions API
 * 
 * Request body:
 * {
 *   "from": "Kochi",
 *   "to": "Goa",
 *   "mode": "driving" | "transit" | "walking" | "bicycling" (optional)
 * }
 */

interface RouteResult {
  mode: string;
  duration: string;
  price: string;
  operator?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, mode } = body;

    if (!from || !to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: 'Both "from" and "to" parameters are required',
        },
        { status: 400 }
      );
    }

    // Get API key from environment
    console.log("🧩 Environment Key Check:", process.env.GOOGLE_MAPS_API_KEY ? "✅ Key Loaded" : "❌ Key Missing");

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

    // Normalize the travel mode for Google Maps API
    const travelMode = normalizeGoogleMode(mode || 'driving');

    // Build Google Maps Directions API URL
    const encodedFrom = encodeURIComponent(from);
    const encodedTo = encodeURIComponent(to);
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodedFrom}&destination=${encodedTo}&mode=${travelMode}&alternatives=true&key=${apiKey}`;

    console.log(`🔍 Fetching routes from Google Maps API...`);

    // Fetch routes from Google Maps API
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    const routes: RouteResult[] = [];

    if (response.data.status === 'OK' && response.data.routes.length > 0) {
      // Process each route from the response
      response.data.routes.forEach((route: any) => {
        if (route.legs?.[0]) {
          const leg = route.legs[0];
          routes.push({
            mode: normalizeMode(travelMode),
            duration: leg.duration.text,
            price: 'Price varies',
            operator: 'Various providers'
          });
        }
      });
    }

    console.log(`✅ Found ${routes.length} routes from Google Maps`);

    return NextResponse.json({
      success: true,
      count: routes.length,
      routes: routes,
      source: 'google_maps',
      url: url
    });

  } catch (error: any) {
    console.error('❌ API Error:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch routes',
        details: error.message || 'Unable to fetch data from Google Maps API',
      },
      { status: 500 }
    );
  }
}

// Helper function to normalize transport mode names for display
function normalizeMode(mode: string): string {
  mode = mode.toLowerCase().trim();
  
  switch (mode) {
    case 'driving': return 'Car';
    case 'transit': return 'Public Transit';
    case 'walking': return 'Walking';
    case 'bicycling': return 'Bicycle';
    default: return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

// Helper function to normalize mode for Google Maps API
function normalizeGoogleMode(mode: string): string {
  mode = mode.toLowerCase().trim();
  
  switch (mode) {
    case 'car':
    case 'driving':
    case 'auto':
      return 'driving';
    case 'transit':
    case 'bus':
    case 'train':
      return 'transit';
    case 'walk':
    case 'walking':
      return 'walking';
    case 'bike':
    case 'bicycle':
    case 'cycling':
      return 'bicycling';
    default:
      return 'driving';
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
