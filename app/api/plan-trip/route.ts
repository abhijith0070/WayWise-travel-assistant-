import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Increase timeout for serverless functions
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing prompt' },
        { status: 400 }
      );
    }

    // Optimized prompt for faster responses
    const enhancedPrompt = `You are a travel planner AI. Create a concise trip itinerary:

${prompt}

Include:
1. Day-by-day plan with key activities
2. Budget estimate (₹)
3. Top 3 attractions
4. Travel tips

Be brief and structured. Max 500 words.`;

    console.log('🚀 Starting trip generation with gemma3:1b model...');

    // Call Ollama API with non-streaming mode for stability
    const ollamaResponse = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: enhancedPrompt,
        stream: false,
        keep_alive: "10m",
        options: {
          num_predict: 700,
          temperature: 0.6
        }
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API failed with ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    
    // Extract the response text from Ollama
    const tripPlan = data.response;
    
    if (!tripPlan) {
      throw new Error('No response from Ollama model');
    }

    console.log('✅ Trip plan generated successfully. Length:', tripPlan.length);

    // Return complete trip plan as JSON
    return NextResponse.json({
      success: true,
      data: tripPlan,
      plan: tripPlan
    });

  } catch (error: any) {
    console.error('Trip Plan API error:', error);
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cannot connect to Ollama. Make sure Ollama is running: "ollama serve"'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Ollama API failed. Check if Ollama is running.'
      },
      { status: 500 }
    );
  }
}
