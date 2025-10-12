import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a valid travel query.' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create structured prompt for AI
    const systemPrompt = `You are WayWise AI, an expert travel planner. Generate detailed, personalized travel itineraries based on user requests.

Your response MUST be a valid JSON object with this exact structure:
{
  "destination": "Primary destination city/region",
  "from": "Starting location",
  "duration": "Number of days",
  "budget": "Estimated budget range in INR",
  "bestTimeToVisit": "Recommended months/season",
  "overview": "Brief 2-3 sentence trip overview",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "Morning/Afternoon/Evening",
          "activity": "Activity name",
          "description": "Detailed description",
          "cost": "Estimated cost"
        }
      ],
      "meals": {
        "breakfast": "Recommendation with cost",
        "lunch": "Recommendation with cost",
        "dinner": "Recommendation with cost"
      },
      "accommodation": "Hotel/Stay suggestion with cost"
    }
  ],
  "transportation": {
    "toDestination": "How to reach with options and costs",
    "local": "Local transport recommendations"
  },
  "budgetBreakdown": {
    "transport": "Cost estimate",
    "accommodation": "Cost estimate",
    "food": "Cost estimate",
    "activities": "Cost estimate",
    "miscellaneous": "Cost estimate",
    "total": "Total estimated cost"
  },
  "packingList": ["item1", "item2", ...],
  "localTips": ["tip1", "tip2", ...],
  "mustTryFoods": ["food1", "food2", ...],
  "mustVisitPlaces": ["place1", "place2", ...]
}

Be specific with Indian currency (₹), provide realistic costs, and include cultural insights.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse and validate JSON response
    const tripPlan = JSON.parse(aiResponse);

    // Return formatted response
    return NextResponse.json({
      success: true,
      data: tripPlan,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('AI Trip Planning Error:', error);

    // Handle specific errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate trip plan. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Enable CORS for frontend
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
