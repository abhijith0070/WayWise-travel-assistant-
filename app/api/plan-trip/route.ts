import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  let prompt: string = '';
  
  try {
    const requestBody = await request.json();
    prompt = requestBody.prompt;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a valid travel query.' },
        { status: 400 }
      );
    }

    // Try Ollama first (free and unlimited)
    try {
      console.log('Attempting Ollama API first...');
      
      const ollamaResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/plan-trip-ollama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (ollamaResponse.ok) {
        const ollamaData = await ollamaResponse.json();
        console.log('Successfully used Ollama API');
        return NextResponse.json({
          ...ollamaData,
          source: 'ollama-llama2'
        });
      } else {
        console.log('Ollama failed, trying mock AI for demo...');
      }
    } catch (ollamaError) {
      console.error('Ollama API failed:', ollamaError);
      console.log('Trying mock AI for demo...');
    }

    // Try Mock AI (for demo while setting up Ollama)
    try {
      const mockResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/plan-trip-mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (mockResponse.ok) {
        const mockData = await mockResponse.json();
        console.log('Successfully used Mock AI (demo mode)');
        return NextResponse.json({
          ...mockData,
          source: 'mock-ai-demo'
        });
      }
    } catch (mockError) {
      console.error('Mock AI failed:', mockError);
      console.log('Falling back to OpenAI...');
    }

    // Fallback to OpenAI if Ollama fails
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'No AI service available. Install Ollama or configure OpenAI API key.' },
        { status: 500 }
      );
    }

    // Create structured prompt for AI
    const systemPrompt = `You are WayWise AI, an expert travel planner. Generate detailed, personalized travel itineraries based on user requests.

Your response MUST be a valid JSON object with this exact structure:
{
  "title": "Short descriptive trip title",
  "description": "Brief 2-3 sentence trip overview",
  "destination": "Primary destination city/region",
  "from": "Starting location",
  "duration": "Number of days (e.g., '3 days')",
  "estimatedBudget": "Total estimated cost in ₹",
  "bestFor": "Who this trip is best for (Solo/Couple/Family/Friends)",
  "season": "Best time to visit (e.g., 'October-March')",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Brief day overview (optional)",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name", 
          "description": "Detailed activity description",
          "location": "Specific location name",
          "estimatedCost": "₹500"
        }
      ]
    }
  ],
  "tips": ["Travel tip 1", "Travel tip 2", "Cultural insight", ...]
}

Be specific with Indian currency (₹), provide realistic costs, and include cultural insights.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
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
      tripPlan: tripPlan,
      timestamp: new Date().toISOString(),
      source: 'openai-gpt3.5'
    });

  } catch (error: any) {
    console.error('OpenAI Trip Planning Error:', error);

    // Handle specific errors
    if (error.code === 'insufficient_quota' || error.status === 429) {
      // Try fallback to Gemini API
      try {
        console.log('Attempting fallback to Gemini API...');
        
        const fallbackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/plan-trip-gemini`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log('Successfully used Gemini fallback');
          return NextResponse.json({
            ...fallbackData,
            source: 'gemini-fallback'
          });
        }
      } catch (fallbackError) {
        console.error('Gemini fallback also failed:', fallbackError);
      }

      return NextResponse.json(
        { 
          error: 'API quota exceeded. Please try again later.',
          details: 'Both AI services are temporarily unavailable. Please try again in a few minutes.' 
        },
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
