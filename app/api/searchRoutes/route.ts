import { NextRequest, NextResponse } from "next/server";
import { searchRoutes } from "@/lib/routesDatabase";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const mode = searchParams.get("mode") || undefined;

    // Search using local database
    const results = searchRoutes(from, to, mode);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No routes found from ${from || "anywhere"} to ${to || "anywhere"}${mode ? ` by ${mode}` : ""}`,
        routes: []
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      routes: results,
      message: `Found ${results.length} route(s)`
    });

  } catch (error) {
    console.error("Route search error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to search routes",
      routes: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, mode } = body;

    // Search using local database
    const results = searchRoutes(from, to, mode);

    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No routes found from ${from || "anywhere"} to ${to || "anywhere"}${mode ? ` by ${mode}` : ""}`,
        routes: []
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      routes: results,
      message: `Found ${results.length} route(s)`
    });

  } catch (error) {
    console.error("Route search error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to search routes",
      routes: []
    }, { status: 500 });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
