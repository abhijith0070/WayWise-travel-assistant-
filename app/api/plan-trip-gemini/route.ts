import { NextRequest, NextResponse } from 'next/server';

// Google Gemini API alternative
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a valid travel query.' },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are WayWise AI, an expert travel planner. Generate a detailed travel itinerary for: "${prompt}". 

Return a JSON object with: destination, from, duration, budget (in ₹), overview, daily itinerary with activities/meals/accommodation, transportation details, budget breakdown, packing list, local tips, must-try foods, and must-visit places.

Be specific, include realistic costs in Indian Rupees, and provide cultural insights.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3000,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text;

    if (!aiText) {
      throw new Error('No response from Gemini API');
    }

    // Try to parse JSON from response
    let tripPlan;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      tripPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : { rawText: aiText };
    } catch {
      tripPlan = { rawText: aiText };
    }

    return NextResponse.json({
      success: true,
      data: tripPlan,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Gemini Trip Planning Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate trip plan. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
