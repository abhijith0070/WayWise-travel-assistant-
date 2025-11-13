import { NextRequest } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

interface GroqRequest {
  message: string;
  role: "chat" | "planner";
  destination?: string;
  duration?: string;
  budget?: string;
  interests?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { message, role, destination, duration, budget, interests }: GroqRequest = await req.json();

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        { status: 500 }
      );
    }

    if (!message || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: message and role" }),
        { status: 400 }
      );
    }

    // Define system prompts based on role
    let systemPrompt = "";
    
    if (role === "chat") {
      systemPrompt = `You are Sundaran AI, a friendly travel planning assistant for WayWise. Help users with trip planning, route search, bookings, and travel recommendations. Be concise, warm, and informative. Keep responses under 100 words. Use emojis occasionally to make it friendly.`;
    } else if (role === "planner") {
      systemPrompt = `You are an expert AI travel planner for WayWise. Generate detailed, structured travel itineraries based on user preferences. Include:
- Day-by-day breakdown with specific activities and timings
- Accommodation recommendations with budget considerations
- Local attractions, restaurants, and cultural experiences
- Transportation options between locations
- Estimated costs and budget breakdown
- Practical tips and local insights

Format your response in a clear, organized markdown structure with headers, bullet points, and sections for each day. Be comprehensive but concise.`;
    }

    // Build user message with trip details if it's a planner request
    let userMessage = message;
    if (role === "planner" && destination) {
      userMessage = `Plan a ${duration || "multi-day"} trip to ${destination}.
Budget: ${budget || "flexible"}
Interests: ${interests || "general sightseeing and local culture"}

${message}`;
    }

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: role === "chat" ? 0.7 : 0.8,
        max_tokens: role === "chat" ? 500 : 2000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service temporarily busy. Please try again in a moment." }),
          { status: 429 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Groq API request failed" }),
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response received.";

    return new Response(
      JSON.stringify({ reply, success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Groq API route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
