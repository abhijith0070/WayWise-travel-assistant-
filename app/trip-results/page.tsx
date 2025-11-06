"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Users, Loader2, RefreshCw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TripPlan, DayPlan, Activity } from "@/types/trip"
import { ApiQuotaFAQ } from "@/components/api-quota-faq"
import { OllamaSetup } from "@/components/ollama-setup"

function TripResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const prompt = searchParams.get("prompt")

  const generateTripPlan = async (tripPrompt: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: tripPrompt }),
      })

      if (!response.ok) {
        let serverMsg = `HTTP error! status: ${response.status}`
        try {
          const errJson = await response.json()
          if (errJson?.error || errJson?.details) {
            serverMsg = `${serverMsg} - ${errJson.error || ''} ${errJson.details || ''}`.trim()
          }
        } catch {}
        
        // Special handling for rate limit errors
        if (response.status === 429) {
          throw new Error("API quota exceeded. Please try again later.")
        }
        
        throw new Error(serverMsg)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTripPlan(data.tripPlan)
      toast({
        title: "Trip Plan Generated!",
        description: "Your personalized itinerary is ready.",
      })
    } catch (error) {
      console.error("Error generating trip plan:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate trip plan"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const regeneratePlan = () => {
    if (prompt) {
      // Store attempt timestamp for rate limiting
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastAttempt', Date.now().toString())
      }
      generateTripPlan(prompt)
    }
  }

  useEffect(() => {
    if (prompt) {
      generateTripPlan(prompt)
    } else {
      setIsLoading(false)
      setError("No trip prompt provided")
    }
  }, [prompt])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Generating Your Trip Plan</h2>
          <p className="text-gray-600">Our AI is crafting the perfect itinerary for you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    const isQuotaError = error.includes("API quota exceeded") || error.includes("429")
    const isRateLimitError = error.includes("rate limit") || error.includes("too many requests")
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-lg mx-auto px-4">
          <div className={`text-6xl mb-4 ${isQuotaError || isRateLimitError ? 'text-orange-500' : 'text-red-500'}`}>
            {isQuotaError || isRateLimitError ? '⏱️' : '⚠️'}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              {isQuotaError || isRateLimitError 
                ? "Service Temporarily Unavailable" 
                : "Oops! Something went wrong"}
            </h2>
            
            {isQuotaError || isRateLimitError ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  Our AI service has reached its usage limit for now. This helps us manage costs and ensure fair access for all users.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <p className="font-medium mb-2">💡 What you can do:</p>
                  <ul className="text-left space-y-1">
                    <li>• Try again in a few minutes</li>
                    <li>• Use our alternative Gemini AI (if available)</li>
                    <li>• Simplify your travel request</li>
                    <li>• Contact support if this persists</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">{error}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            {prompt && (
              <Button 
                onClick={regeneratePlan}
                disabled={isQuotaError && Date.now() - (typeof window !== 'undefined' ? (localStorage.getItem('lastAttempt') ? parseInt(localStorage.getItem('lastAttempt')!) : 0) : 0) < 60000}
                className={isQuotaError ? "animate-pulse" : ""}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {(isQuotaError || isRateLimitError) && (
              <Button 
                onClick={() => router.push("/plan-trip")}
                variant="secondary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            )}
          </div>

          {(isQuotaError || isRateLimitError) && (
            <p className="text-xs text-gray-500">
              Service usually restores within a few minutes
            </p>
          )}

          {/* Ollama Setup for Quota Errors */}
          {(isQuotaError || isRateLimitError) && (
            <div className="mt-8 max-w-4xl mx-auto space-y-6">
              <OllamaSetup />
              <ApiQuotaFAQ />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">No Trip Plan Available</h2>
          <p className="text-gray-600">Please go back and create a new trip plan.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Your Trip Plan</h1>
              <p className="text-sm text-gray-600">{tripPlan.title}</p>
            </div>
            <Button onClick={regeneratePlan} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="w-6 h-6 text-indigo-600" />
              {tripPlan.title}
            </CardTitle>
            <CardDescription className="text-lg">{tripPlan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Duration:</span>
                <span>{tripPlan.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="font-medium">Budget:</span>
                <span>{tripPlan.estimatedBudget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Best For:</span>
                <span>{tripPlan.bestFor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Season:</span>
                <span>{tripPlan.season}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day-by-Day Itinerary */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
          
          {tripPlan.itinerary.map((day: DayPlan, index: number) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    Day {day.day}
                  </Badge>
                  <span className="text-xl">{day.title}</span>
                </CardTitle>
                {day.description && (
                  <CardDescription className="text-base">{day.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {day.activities.map((activity: Activity, activityIndex: number) => (
                    <div key={activityIndex} className="border-l-4 border-indigo-200 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-indigo-600">{activity.time}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{activity.activity}</h4>
                          {activity.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </div>
                          )}
                          {activity.description && (
                            <p className="text-gray-700 text-sm">{activity.description}</p>
                          )}
                        </div>
                        {activity.estimatedCost && (
                          <Badge variant="outline" className="ml-4">
                            {activity.estimatedCost}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Travel Tips */}
        {tripPlan.tips && tripPlan.tips.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">💡 Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tripPlan.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span className="text-indigo-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/")} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Plan Another Trip
            </Button>
            <Button onClick={regeneratePlan} size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Plan
            </Button>
          </div>
          <p className="text-gray-600 text-sm">
            Powered by AI • Generated just for you
            {tripPlan.source && (
              <span className="ml-2 text-xs">
                • Source: {
                  tripPlan.source === 'ollama-llama2' ? '🦙 Ollama (Free & Local)' :
                  tripPlan.source === 'mock-ai-demo' ? '🎭 Demo AI (Install Ollama for Real AI)' :
                  tripPlan.source === 'openai-gpt3.5' ? '🤖 OpenAI GPT-3.5' :
                  tripPlan.source === 'gemini-fallback' ? '🧠 Google Gemini' :
                  tripPlan.source
                }
              </span>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}

export default function TripResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Loading Trip Results</h2>
          <p className="text-gray-600">Preparing your personalized itinerary...</p>
        </div>
      </div>
    }>
      <TripResultsContent />
    </Suspense>
  )
}