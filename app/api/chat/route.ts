import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are Sundaran AI, a friendly travel planning assistant for WayWise. Help users with trip planning, route search, bookings, and travel recommendations. Be concise, warm, and informative. Keep responses under 100 words." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return new Response(JSON.stringify({ error: "Groq API request failed" }), { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response received.";

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("Chat route error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
