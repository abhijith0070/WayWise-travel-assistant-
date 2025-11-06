export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt. Please provide a valid travel query." },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log("Gemini key loaded:", !!GEMINI_API_KEY);

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // ✅ Working endpoint for Gemini 1.5 Flash (v1beta)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const promptText = `You are WayWise AI, an expert travel planner. Generate a complete travel itinerary based on the user's input: "${prompt}".

Output format:
Return a single valid JSON object (no extra text or markdown) with the following keys:
{
  "title": "Short descriptive name for the trip",
  "description": "Brief paragraph describing the trip theme and highlights",
  "from": "Starting location",
  "destination": "Main travel destination(s)",
  "duration": "Total days or date range",
  "estimatedBudget": "Estimated total cost in ₹",
  "bestFor": "Solo/Couple/Family/Friends",
  "season": "Best time to visit",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Brief day description (optional)",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "Activity details",
          "location": "Specific location",
          "estimatedCost": "₹500"
        }
      ]
    }
  ],
  "tips": ["List of travel tips and recommendations"]
}

Rules:
- Output must be pure JSON (no markdown, backticks, or explanations).
- Use Indian Rupees (₹) for all costs.
- Keep details realistic and India-specific when relevant.
- Include interesting local recommendations and authentic cultural details.`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: promptText,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, response.statusText);
      console.error("Error body:", errorText);
      
      // Handle rate limiting specifically
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: "API quota exceeded. Please try again later.",
            details: "Gemini API rate limit reached. Please wait a moment before trying again.",
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        {
          error: "Failed to generate trip plan. Please try again.",
          details: `Gemini API error: ${response.statusText} - ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText || typeof aiText !== "string") {
      return NextResponse.json(
        { error: "No response text from Gemini API" },
        { status: 500 }
      );
    }

    let tripPlan: any;
    let cleanJson = aiText.trim();
    try {
      cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      const start = cleanJson.indexOf("{");
      const end = cleanJson.lastIndexOf("}");
      if (start === -1 || end === -1 || end <= start) {
        throw new Error("No valid JSON object found in AI text");
      }
      const jsonString = cleanJson.slice(start, end + 1);
      tripPlan = JSON.parse(jsonString);
    } catch (e: any) {
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          details: e?.message || "Unknown parsing error",
          rawText: aiText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, tripPlan, timestamp: new Date().toISOString() },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini Trip Planning Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate trip plan. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
