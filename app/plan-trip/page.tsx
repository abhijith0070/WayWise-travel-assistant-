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
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)

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
    setTripPlan(null)

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: queryPrompt }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate trip plan')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setTripPlan(data.data)
        toast({
          title: "Success!",
          description: "Your personalized trip plan is ready!",
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error("Trip planning error:", error)
      
      toast({
        title: "Generation Failed", 
        description: error.message || "Failed to generate trip plan. Please try again.",
        variant: "destructive",
      })
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
                placeholder="Example: Plan a budget trip from Kollam to Goa in December with beach activities and local cuisine experiences..."
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
              <p className="text-gray-500 mt-2">This may take a few moments</p>
            </div>
          )}

          {/* Trip Plan Display */}
          {tripPlan && !isLoading && (
            <div className="space-y-6">
              {/* Overview Card */}
              <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {tripPlan.trip_title || tripPlan.destination || "Your Trip Plan"}
                  </CardTitle>
                  <p className="text-white/90">{tripPlan.overview}</p>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tripPlan.from && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">From</div>
                        <div className="font-semibold">{tripPlan.from}</div>
                      </div>
                    </div>
                  )}
                  {tripPlan.duration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Duration</div>
                        <div className="font-semibold">{tripPlan.duration}</div>
                      </div>
                    </div>
                  )}
                  {tripPlan.budget_in_inr && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Budget</div>
                        <div className="font-semibold">{tripPlan.budget_in_inr}</div>
                      </div>
                    </div>
                  )}
                  {tripPlan.destination && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-80">Destination</div>
                        <div className="font-semibold">{tripPlan.destination}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Daily Itinerary */}
              {tripPlan.daily_itinerary && tripPlan.daily_itinerary.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-indigo-900">Day-by-Day Itinerary</h2>
                  {tripPlan.daily_itinerary.map((day) => (
                    <Card key={day.day}>
                      <CardHeader>
                        <CardTitle className="text-xl text-indigo-700">
                          Day {day.day}: {day.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Activities */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">Activities</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="text-gray-700">{activity}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Meals */}
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Utensils className="w-5 h-5 text-orange-600" />
                            <h4 className="font-semibold text-gray-900">Meals</h4>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {day.meals.map((meal, idx) => (
                              <li key={idx} className="text-gray-700">• {meal}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Accommodation */}
                        {day.accommodation && (
                          <div className="bg-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Home className="w-5 h-5 text-indigo-600" />
                              <span className="font-medium">Accommodation:</span>
                              <span className="text-gray-700">{day.accommodation}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Additional Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Breakdown */}
                {tripPlan.budget_breakdown && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Budget Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Transport:</span>
                        <span className="font-semibold">{tripPlan.budget_breakdown.transport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stay:</span>
                        <span className="font-semibold">{tripPlan.budget_breakdown.stay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Food:</span>
                        <span className="font-semibold">{tripPlan.budget_breakdown.food}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Activities:</span>
                        <span className="font-semibold">{tripPlan.budget_breakdown.activities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Miscellaneous:</span>
                        <span className="font-semibold">{tripPlan.budget_breakdown.misc}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Packing List */}
                {tripPlan.packing_list && tripPlan.packing_list.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Backpack className="w-5 h-5 text-purple-600" />
                        Packing List
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tripPlan.packing_list.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Local Tips */}
                {tripPlan.local_tips && tripPlan.local_tips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Local Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tripPlan.local_tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Must Try Foods */}
                {tripPlan.must_try_foods && tripPlan.must_try_foods.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-orange-600" />
                        Must-Try Foods
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tripPlan.must_try_foods.map((food, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
                            <span>{food}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Must Visit Places */}
              {tripPlan.must_visit_places && tripPlan.must_visit_places.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-cyan-600" />
                      Must-Visit Places
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tripPlan.must_visit_places.map((place, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-cyan-50 rounded-lg p-3">
                          <MapPin className="w-4 h-4 text-cyan-600" />
                          <span>{place}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transportation */}
              {tripPlan.transportation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Transportation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="font-semibold">Mode: </span>
                      <span>{tripPlan.transportation.mode}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Estimated Cost: </span>
                      <span>{tripPlan.transportation.approx_cost_in_inr}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-6">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  size="lg"
                >
                  Print Itinerary
                </Button>
                <Button
                  onClick={() => {
                    setTripPlan(null)
                    setPrompt("")
                  }}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Plan Another Trip
                </Button>
              </div>
            </div>
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
