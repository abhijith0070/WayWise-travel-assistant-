"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MapPin, Calendar, DollarSign, Utensils, Home, Backpack, Lightbulb, Star, ArrowLeft, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TripPlan {
  trip_title?: string;
  from?: string;
  destination?: string;
  duration?: string;
  budget_in_inr?: string;
  overview?: string;
  daily_itinerary?: Array<{
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation: string;
  }>;
  transportation?: {
    mode: string;
    approx_cost_in_inr: string;
  };
  budget_breakdown?: {
    transport: string;
    stay: string;
    food: string;
    activities: string;
    misc: string;
  };
  packing_list?: string[];
  local_tips?: string[];
  must_try_foods?: string[];
  must_visit_places?: string[];
}

function PlanTripContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState<string | null>(null)

  useEffect(() => {
    // Check if we should auto-generate from hero section
    const shouldGenerate = searchParams.get("generate") === "true"
    const storedPrompt = sessionStorage.getItem("tripPrompt")

    if (shouldGenerate && storedPrompt) {
      setPrompt(storedPrompt)
      generateTrip(storedPrompt)
      sessionStorage.removeItem("tripPrompt")
    }
  }, [searchParams])

  const generateTrip = async (customPrompt?: string) => {
    const queryPrompt = customPrompt || prompt

    if (!queryPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please describe your trip requirements.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTripPlan("")

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: queryPrompt
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate trip plan')
      }

      // Handle JSON response
      const data = await response.json()
      
      if (data.success && (data.data || data.plan)) {
        const planText = data.data || data.plan
        setTripPlan(planText)
        setIsLoading(false)
        toast({
          title: "Success!",
          description: "Your personalized trip plan is ready! ✈️",
        })
      } else {
        throw new Error(data.error || 'Invalid response from server')
      }

    } catch (error: any) {
      console.error("Trip planning error:", error)
      
      toast({
        title: "Generation Failed", 
        description: error.message || "Failed to generate trip plan. Please try again.",
        variant: "destructive",
      })
      setTripPlan(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-4xl font-bold text-indigo-900 mb-4">
              AI Trip Planner
            </h1>
            <p className="text-lg text-gray-700">
              Describe your dream trip and let our AI create a personalized itinerary for you.
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Describe Your Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: Plan a 5-day budget trip from Mumbai to Goa in December. Budget: ₹15,000. Include beach activities, water sports, local cuisine, and nightlife. Prefer budget hotels near the beach."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32"
                disabled={isLoading}
              />
              <Button
                onClick={() => generateTrip()}
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Trip Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
              <p className="text-xl font-semibold text-gray-700">Creating your personalized itinerary...</p>
              <p className="text-gray-500 mt-2">Powered by phi3:mini - Ultra-fast AI (10-15 seconds) ⚡</p>
              <div className="mt-4 px-6 py-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700">
                  💡 Streaming mode: You'll see text appear as it's generated!
                </p>
              </div>
            </div>
          )}

          {/* Trip Plan Display */}
          {tripPlan && !isLoading && (
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Your Personalized Trip Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-indigo max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {tripPlan.split('\n').map((line, idx) => {
                      // Handle headers
                      if (line.startsWith('# ')) {
                        return <h1 key={idx} className="text-3xl font-bold text-indigo-900 mt-6 mb-4">{line.substring(2)}</h1>
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-2xl font-bold text-indigo-800 mt-5 mb-3">{line.substring(3)}</h2>
                      }
                      if (line.startsWith('### ')) {
                        return <h3 key={idx} className="text-xl font-semibold text-indigo-700 mt-4 mb-2">{line.substring(4)}</h3>
                      }
                      // Handle bullet points
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return <li key={idx} className="ml-6 text-gray-700 mb-1">{line.substring(2)}</li>
                      }
                      // Handle bold text
                      if (line.includes('**')) {
                        const parts = line.split('**')
                        return (
                          <p key={idx} className="mb-2">
                            {parts.map((part, i) => 
                              i % 2 === 1 ? <strong key={i} className="font-semibold text-indigo-900">{part}</strong> : part
                            )}
                          </p>
                        )
                      }
                      // Regular paragraphs
                      if (line.trim()) {
                        return <p key={idx} className="mb-2 text-gray-700">{line}</p>
                      }
                      return <br key={idx} />
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!tripPlan && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Ready to Plan Your Adventure?
              </h3>
              <p className="text-gray-500">
                Enter your trip details above and let our AI create the perfect itinerary!
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PlanTripPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Loading Trip Planner</h2>
          <p className="text-gray-600">Setting up your travel planning experience...</p>
        </div>
      </div>
    }>
      <PlanTripContent />
    </Suspense>
  )
}
