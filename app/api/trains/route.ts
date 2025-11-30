import { NextRequest, NextResponse } from "next/server";

const RAIL_API_KEY = process.env.NEXT_PUBLIC_RAIL_API_KEY || "your_rail_api_key_here";
const RAIL_API_BASE_URL = "http://indianrailapi.com/api/v2";

interface TrainSearchParams {
  trainNumber?: string;
  from?: string;
  to?: string;
  date?: string;
  classCode?: string;
  quota?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainNumber, from, to, date, classCode = "SL", quota = "GN" }: TrainSearchParams = body;

    // Validate required fields
    if (!trainNumber && (!from || !to)) {
      return NextResponse.json({
        success: false,
        message: "Please provide either train number or both from and to stations",
        trains: []
      }, { status: 400 });
    }

    // Format date to yyyyMMdd
    const searchDate = date ? date.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');

    let trains: any[] = [];

    // If train number is provided, fetch live status
    if (trainNumber) {
      console.log(`🚂 Fetching live status for train ${trainNumber}...`);
      
      const liveStatusUrl = `${RAIL_API_BASE_URL}/livetrainstatus/apikey/${RAIL_API_KEY}/trainnumber/${trainNumber}/date/${searchDate}/`;
      
      const response = await fetch(liveStatusUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`IndianRailAPI error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error || data.ResponseCode !== "200") {
        console.error('IndianRailAPI error:', data);
        return NextResponse.json({
          success: false,
          message: data.error?.message || data.Message || "Failed to fetch train data",
          trains: []
        }, { status: 400 });
      }

      // Process live train status
      if (data.Train) {
        trains.push({
          trainNumber: data.Train.TrainNo || trainNumber,
          trainName: data.Train.TrainName || "Unknown Train",
          from: data.Train.Source?.StationName || from || "Unknown",
          to: data.Train.Destination?.StationName || to || "Unknown",
          fromCode: data.Train.Source?.StationCode || from || "",
          toCode: data.Train.Destination?.StationCode || to || "",
          departureTime: data.Train.Source?.DepartureTime || "N/A",
          arrivalTime: data.Train.Destination?.ArrivalTime || "N/A",
          currentStatus: data.Train.CurrentStatus || "On Time",
          currentLocation: data.Train.CurrentStation?.StationName || "Unknown",
          runningStatus: data.Train.RunningStatus || "Running",
          delay: data.Train.Delay || "0 min",
          date: searchDate,
          type: "live-status",
        });
      }
    }

    // If from/to are provided, fetch seat availability
    if (from && to && trainNumber) {
      console.log(`🚂 Fetching seat availability from ${from} to ${to}...`);
      
      const seatAvailUrl = `${RAIL_API_BASE_URL}/SeatAvailability/apikey/${RAIL_API_KEY}/TrainNumber/${trainNumber}/From/${from}/To/${to}/Date/${searchDate}/Quota/${quota}/Class/${classCode}`;
      
      const response = await fetch(seatAvailUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`IndianRailAPI Seat Availability error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error || data.ResponseCode !== "200") {
        console.error('IndianRailAPI Seat Availability error:', data);
        // Don't fail completely, just log
        console.log('Seat availability not found, continuing with live status only');
      } else if (data.Train) {
        // Update or add train with seat availability info
        const existingTrainIndex = trains.findIndex(t => t.trainNumber === trainNumber);
        
        const seatInfo = {
          trainNumber: data.Train.TrainNo || trainNumber,
          trainName: data.Train.TrainName || "Unknown Train",
          from: data.From?.StationName || from,
          to: data.To?.StationName || to,
          fromCode: data.From?.StationCode || from,
          toCode: data.To?.StationCode || to,
          departureTime: data.From?.DepartureTime || "N/A",
          arrivalTime: data.To?.ArrivalTime || "N/A",
          travelClass: classCode,
          quota: quota,
          availability: data.Availability || [],
          fare: data.Fare || "N/A",
          distance: data.Distance || "N/A",
          duration: data.Duration || "N/A",
          date: searchDate,
          type: "seat-availability",
        };

        if (existingTrainIndex >= 0) {
          // Merge with existing train data
          trains[existingTrainIndex] = { ...trains[existingTrainIndex], ...seatInfo };
        } else {
          trains.push(seatInfo);
        }
      }
    }

    if (trains.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No train data found for ${trainNumber ? `train ${trainNumber}` : `route ${from} to ${to}`}`,
        trains: []
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      count: trains.length,
      trains: trains,
      message: `Found ${trains.length} train(s)`
    });

  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to search trains",
      trains: []
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const trainNumber = searchParams.get("trainNumber");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const classCode = searchParams.get("class") || "SL";
    const quota = searchParams.get("quota") || "GN";

    // Validate required fields
    if (!trainNumber && (!from || !to)) {
      return NextResponse.json({
        success: false,
        message: "Please provide either train number or both from and to stations",
        trains: []
      }, { status: 400 });
    }

    // Format date to yyyyMMdd
    const searchDate = date ? date.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');

    let trains: any[] = [];

    // If train number is provided, fetch live status
    if (trainNumber) {
      console.log(`🚂 Fetching live status for train ${trainNumber}...`);
      
      const liveStatusUrl = `${RAIL_API_BASE_URL}/livetrainstatus/apikey/${RAIL_API_KEY}/trainnumber/${trainNumber}/date/${searchDate}/`;
      
      const response = await fetch(liveStatusUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`IndianRailAPI error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error || data.ResponseCode !== "200") {
        console.error('IndianRailAPI error:', data);
        return NextResponse.json({
          success: false,
          message: data.error?.message || data.Message || "Failed to fetch train data",
          trains: []
        }, { status: 400 });
      }

      // Process live train status
      if (data.Train) {
        trains.push({
          trainNumber: data.Train.TrainNo || trainNumber,
          trainName: data.Train.TrainName || "Unknown Train",
          from: data.Train.Source?.StationName || from || "Unknown",
          to: data.Train.Destination?.StationName || to || "Unknown",
          fromCode: data.Train.Source?.StationCode || from || "",
          toCode: data.Train.Destination?.StationCode || to || "",
          departureTime: data.Train.Source?.DepartureTime || "N/A",
          arrivalTime: data.Train.Destination?.ArrivalTime || "N/A",
          currentStatus: data.Train.CurrentStatus || "On Time",
          currentLocation: data.Train.CurrentStation?.StationName || "Unknown",
          runningStatus: data.Train.RunningStatus || "Running",
          delay: data.Train.Delay || "0 min",
          date: searchDate,
          type: "live-status",
        });
      }
    }

    // If from/to are provided, fetch seat availability
    if (from && to && trainNumber) {
      console.log(`🚂 Fetching seat availability from ${from} to ${to}...`);
      
      const seatAvailUrl = `${RAIL_API_BASE_URL}/SeatAvailability/apikey/${RAIL_API_KEY}/TrainNumber/${trainNumber}/From/${from}/To/${to}/Date/${searchDate}/Quota/${quota}/Class/${classCode}`;
      
      const response = await fetch(seatAvailUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`IndianRailAPI Seat Availability error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check for API errors
      if (data.error || data.ResponseCode !== "200") {
        console.error('IndianRailAPI Seat Availability error:', data);
        // Don't fail completely, just log
        console.log('Seat availability not found, continuing with live status only');
      } else if (data.Train) {
        // Update or add train with seat availability info
        const existingTrainIndex = trains.findIndex(t => t.trainNumber === trainNumber);
        
        const seatInfo = {
          trainNumber: data.Train.TrainNo || trainNumber,
          trainName: data.Train.TrainName || "Unknown Train",
          from: data.From?.StationName || from,
          to: data.To?.StationName || to,
          fromCode: data.From?.StationCode || from,
          toCode: data.To?.StationCode || to,
          departureTime: data.From?.DepartureTime || "N/A",
          arrivalTime: data.To?.ArrivalTime || "N/A",
          travelClass: classCode,
          quota: quota,
          availability: data.Availability || [],
          fare: data.Fare || "N/A",
          distance: data.Distance || "N/A",
          duration: data.Duration || "N/A",
          date: searchDate,
          type: "seat-availability",
        };

        if (existingTrainIndex >= 0) {
          // Merge with existing train data
          trains[existingTrainIndex] = { ...trains[existingTrainIndex], ...seatInfo };
        } else {
          trains.push(seatInfo);
        }
      }
    }

    if (trains.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No train data found for ${trainNumber ? `train ${trainNumber}` : `route ${from} to ${to}`}`,
        trains: []
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      count: trains.length,
      trains: trains,
      message: `Found ${trains.length} train(s)`
    });

  } catch (error) {
    console.error("Train search error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to search trains",
      trains: []
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
