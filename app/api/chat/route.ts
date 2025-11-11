import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    const systemPrompt = `
      You are Sundaran AI — an intelligent travel assistant for WayWise, built to answer travel questions,
      suggest destinations, and provide information about travel planning.
      
      WayWise offers:
      - AI-powered trip planning with personalized itineraries
      - Route search (bus, train, flight options)
      - Hotel booking assistance
      - Attraction recommendations
      - Fuel station locations
      - Ticket booking services
      
      Be concise, warm, friendly, and informative. Keep responses under 100 words.
      Use emojis occasionally to make it friendly. If asked about specific routes or bookings,
      guide them to use the Manual Search or AI Trip Planner features on the homepage.
      
      Always introduce yourself as "Sundaran AI" when greeting users.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}`);

    const reply = result.response.text();
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
