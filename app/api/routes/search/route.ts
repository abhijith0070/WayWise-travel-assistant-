import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/routes/search
 * 
 * Search for routes based on source, destination, date, and mode
 * 
 * Request body:
 * {
 *   "from": "Kochi",
 *   "to": "Trivandrum",
 *   "date": "2025-11-10" (optional),
 *   "mode": "Bus" (optional)
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "count": 3,
 *   "routes": [...]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Extract Authorization header if needed for external API calls
    // const authHeader = request.headers.get('Authorization');
    
    const body = await request.json();
    const { from, to, date, mode } = body;

    // Validate required fields
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

    // Build search query with case-insensitive partial matching
    // SQLite doesn't support 'insensitive' mode directly, so we use case-insensitive matching
    const fromSearch = from.trim().toLowerCase();
    const toSearch = to.trim().toLowerCase();
    
    const whereClause: any = {
      AND: [
        {
          source: {
            contains: from.trim(),
          },
        },
        {
          destination: {
            contains: to.trim(),
          },
        },
        {
          available: true,
        },
      ],
    };

    // Add mode filter if provided
    if (mode && typeof mode === 'string' && mode.trim() !== '') {
      const modeSearch = mode.trim();
      whereClause.AND.push({
        mode: {
          contains: modeSearch,
        },
      });
    }

    // Query the database
    // Note: Using include for transportMode, but handling case where it might be null
    const routes = await prisma.route.findMany({
      where: whereClause,
      include: {
        transportMode: true, // Optional relation - will be null if not found
      },
      orderBy: [
        { price: 'asc' }, // Sort by price (cheapest first)
        { duration: 'asc' }, // Then by duration
      ],
    });
    
    // Filter results case-insensitively (since SQLite contains is case-sensitive)
    const filteredRoutes = routes.filter((route: any) => {
      const sourceMatch = route.source.toLowerCase().includes(fromSearch);
      const destMatch = route.destination.toLowerCase().includes(toSearch);
      let modeMatch = true;
      
      if (mode && typeof mode === 'string' && mode.trim() !== '') {
        modeMatch = route.mode.toLowerCase().includes(mode.trim().toLowerCase());
      }
      
      return sourceMatch && destMatch && modeMatch;
    });

    // Check if no routes found
    if (filteredRoutes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No routes found',
          details: `No routes available from "${from}" to "${to}"${mode ? ` by ${mode}` : ''}.`,
          count: 0,
          routes: [],
        },
        { status: 404 }
      );
    }

    // Parse amenities from JSON string to array (with error handling)
    const routesWithParsedAmenities = filteredRoutes.map((route: any) => {
      let amenities = [];
      try {
        if (route.amenities) {
          // Handle both string and already parsed JSON
          if (typeof route.amenities === 'string') {
            amenities = JSON.parse(route.amenities);
          } else if (Array.isArray(route.amenities)) {
            amenities = route.amenities;
          }
        }
      } catch (parseError) {
        console.warn(`Failed to parse amenities for route ${route.id}:`, parseError);
        amenities = [];
      }

      return {
        id: route.id,
        source: route.source,
        destination: route.destination,
        mode: route.mode,
        distance: route.distance,
        duration: route.duration,
        price: route.price,
        operatorName: route.operatorName,
        departureTime: route.departureTime,
        arrivalTime: route.arrivalTime,
        frequency: route.frequency,
        amenities,
        available: route.available,
        transportMode: route.transportMode || null,
      };
    });

    console.log(`Found ${filteredRoutes.length} routes from "${from}" to "${to}"`);

    return NextResponse.json({
      success: true,
      count: filteredRoutes.length,
      searchParams: {
        from,
        to,
        mode: mode || 'all',
        date: date || 'any',
      },
      routes: routesWithParsedAmenities,
    });

  } catch (error) {
    console.error('Route search error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for common database errors
      if (error.message.includes('PrismaClient')) {
        errorMessage = 'Database connection error. Please check your database configuration.';
      } else if (error.message.includes('relation') || error.message.includes('table')) {
        errorMessage = 'Database schema error. Please run migrations.';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        details: errorMessage,
        // Include full error in development
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
