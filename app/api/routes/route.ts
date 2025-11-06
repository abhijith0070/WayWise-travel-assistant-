import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/routes
 * Returns all available routes from the database
 */
export async function GET(request: NextRequest) {
  try {
    const routes = await prisma.route.findMany({
      include: {
        transportMode: true,
      },
      orderBy: [
        { source: 'asc' },
        { destination: 'asc' },
        { price: 'asc' },
      ],
    });

    // Parse amenities from JSON string to array
    const routesWithParsedAmenities = routes.map((route: any) => ({
      ...route,
      amenities: route.amenities ? JSON.parse(route.amenities) : [],
    }));

    return NextResponse.json({
      success: true,
      count: routes.length,
      routes: routesWithParsedAmenities,
    });

  } catch (error) {
    console.error('Error fetching routes:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch routes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
