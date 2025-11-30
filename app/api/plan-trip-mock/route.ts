import { NextRequest, NextResponse } from 'next/server';

// DEPRECATED: Mock AI route is no longer used
// All trip planning now uses Ollama (local AI) via /api/plan-trip
// This file is kept for backwards compatibility but returns an error

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Mock AI is deprecated. Please use /api/plan-trip instead (now powered by Ollama).',
      deprecated: true,
      redirect: '/api/plan-trip'
    },
    { status: 410 } // 410 Gone - resource no longer available
  );
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