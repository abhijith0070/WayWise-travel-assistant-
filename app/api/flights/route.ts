import { NextRequest, NextResponse } from "next/server";

const AVIATIONSTACK_API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_KEY || "f2c891c5ca617bd5e65557e33324ecfd";
const AVIATIONSTACK_BASE_URL = "https://api.aviationstack.com/v1/flights";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, to } = body;

    if (!from || !to) {
      return NextResponse.json({
        success: false,
        message: "Please provide both 'from' and 'to' parameters",
        flights: []
      }, { status: 400 });
    }

    // Fetch flights from AviationStack API
    const url = `${AVIATIONSTACK_BASE_URL}?access_key=${AVIATIONSTACK_API_KEY}&dep_iata=${from}&arr_iata=${to}&limit=50`;
    
    console.log(`🛫 Fetching flights from ${from} to ${to}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`AviationStack API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('AviationStack API error:', data.error);
      return NextResponse.json({
        success: false,
        message: data.error.message || "Failed to fetch flight data",
        flights: []
      }, { status: 400 });
    }

    // Process flight data
    const flights = data.data || [];

    if (flights.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No flights found from ${from} to ${to}`,
        flights: []
      }, { status: 404 });
    }

    // Format flight data for frontend
    const formattedFlights = flights.map((flight: any) => ({
      airline: flight.airline?.name || "Unknown Airline",
      flightNumber: flight.flight?.number || flight.flight?.iata || "N/A",
      flightIata: flight.flight?.iata || "N/A",
      flightIcao: flight.flight?.icao || "N/A",
      departure: {
        airport: flight.departure?.airport || "Unknown Airport",
        iata: flight.departure?.iata || from,
        timezone: flight.departure?.timezone || "UTC",
        scheduledTime: flight.departure?.scheduled || "N/A",
        estimatedTime: flight.departure?.estimated || flight.departure?.scheduled || "N/A",
        actualTime: flight.departure?.actual || null,
        terminal: flight.departure?.terminal || null,
        gate: flight.departure?.gate || null,
      },
      arrival: {
        airport: flight.arrival?.airport || "Unknown Airport",
        iata: flight.arrival?.iata || to,
        timezone: flight.arrival?.timezone || "UTC",
        scheduledTime: flight.arrival?.scheduled || "N/A",
        estimatedTime: flight.arrival?.estimated || flight.arrival?.scheduled || "N/A",
        actualTime: flight.arrival?.actual || null,
        terminal: flight.arrival?.terminal || null,
        gate: flight.arrival?.gate || null,
      },
      flightStatus: flight.flight_status || "scheduled",
      flightDate: flight.flight_date || "N/A",
      aircraftType: flight.aircraft?.registration || flight.aircraft?.iata || null,
    }));

    return NextResponse.json({
      success: true,
      count: formattedFlights.length,
      flights: formattedFlights,
      message: `Found ${formattedFlights.length} flight(s) from ${from} to ${to}`
    });

  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to search flights",
      flights: []
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) {
      return NextResponse.json({
        success: false,
        message: "Please provide both 'from' and 'to' parameters",
        flights: []
      }, { status: 400 });
    }

    // Fetch flights from AviationStack API
    const url = `${AVIATIONSTACK_BASE_URL}?access_key=${AVIATIONSTACK_API_KEY}&dep_iata=${from}&arr_iata=${to}&limit=50`;
    
    console.log(`🛫 Fetching flights from ${from} to ${to}...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`AviationStack API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('AviationStack API error:', data.error);
      return NextResponse.json({
        success: false,
        message: data.error.message || "Failed to fetch flight data",
        flights: []
      }, { status: 400 });
    }

    // Process flight data
    const flights = data.data || [];

    if (flights.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No flights found from ${from} to ${to}`,
        flights: []
      }, { status: 404 });
    }

    // Format flight data for frontend
    const formattedFlights = flights.map((flight: any) => ({
      airline: flight.airline?.name || "Unknown Airline",
      flightNumber: flight.flight?.number || flight.flight?.iata || "N/A",
      flightIata: flight.flight?.iata || "N/A",
      flightIcao: flight.flight?.icao || "N/A",
      departure: {
        airport: flight.departure?.airport || "Unknown Airport",
        iata: flight.departure?.iata || from,
        timezone: flight.departure?.timezone || "UTC",
        scheduledTime: flight.departure?.scheduled || "N/A",
        estimatedTime: flight.departure?.estimated || flight.departure?.scheduled || "N/A",
        actualTime: flight.departure?.actual || null,
        terminal: flight.departure?.terminal || null,
        gate: flight.departure?.gate || null,
      },
      arrival: {
        airport: flight.arrival?.airport || "Unknown Airport",
        iata: flight.arrival?.iata || to,
        timezone: flight.arrival?.timezone || "UTC",
        scheduledTime: flight.arrival?.scheduled || "N/A",
        estimatedTime: flight.arrival?.estimated || flight.arrival?.scheduled || "N/A",
        actualTime: flight.arrival?.actual || null,
        terminal: flight.arrival?.terminal || null,
        gate: flight.arrival?.gate || null,
      },
      flightStatus: flight.flight_status || "scheduled",
      flightDate: flight.flight_date || "N/A",
      aircraftType: flight.aircraft?.registration || flight.aircraft?.iata || null,
    }));

    return NextResponse.json({
      success: true,
      count: formattedFlights.length,
      flights: formattedFlights,
      message: `Found ${formattedFlights.length} flight(s) from ${from} to ${to}`
    });

  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to search flights",
      flights: []
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
