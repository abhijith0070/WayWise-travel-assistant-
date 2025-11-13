"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Route as RouteIcon, Zap, Fuel, Navigation, ArrowLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"

// Dynamically import TripMap to avoid SSR issues with Leaflet
const TripMap = dynamic(
  () => import("../../../components/TripMap").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-xl overflow-hidden shadow-md mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <div className="flex flex-col items-center justify-center py-12" style={{ height: '450px' }}>
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading map component...</p>
        </div>
      </div>
    )
  }
)

interface Station {
  id: string
  name: string
  lat: number
  lng: number
  type: "fuel" | "ev"
  rating?: number
  address?: string
}

interface RouteData {
  distance: string
  duration: string
}

export default function RoutePlanningPage() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [routeData, setRouteData] = useState<RouteData | null>(null)

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      setError("Please enter both source and destination cities")
      return
    }

    setIsLoading(true)
    setError(null)
    setSearched(false)
    setShowMap(false)
    setRouteData(null)

    try {
      console.log(`🗺️ Searching route: ${from} → ${to}`)

      // Simulate route calculation (in real scenario, you'd use OSRM or similar)
      // For now, we'll just show the map with the route
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set dummy route data (you can enhance this with actual route calculation)
      setRouteData({
        distance: "Calculating...",
        duration: "Calculating..."
      })

      setShowMap(true)
      setSearched(true)
      console.log(`✅ Route ready to display`)
    } catch (err) {
      console.error("❌ Route search error:", err)
      setError(err instanceof Error ? err.message : "Failed to find route. Please try again.")
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && from.trim() && to.trim()) {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RouteIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">Route Planner</h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Find optimal driving routes with nearby fuel and EV charging stations
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600" />
                  Plan Your Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From (City)</Label>
                    <Input
                      id="from"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="e.g., Kochi, Delhi, Mumbai"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To (City)</Label>
                    <Input
                      id="to"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="e.g., Trivandrum, Bangalore, Pune"
                      className="text-base"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !from.trim() || !to.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fetching route...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 mr-2" />
                      Search Routes
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Map and Results Section */}
        {searched && !isLoading && showMap && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Route Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <RouteIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Route</p>
                        <p className="text-xl font-bold text-gray-900">{from} → {to}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Map Provider</p>
                        <p className="text-xl font-bold text-gray-900">OpenStreetMap</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Map with Route */}
              <TripMap from={from} destination={to} showRoute={true} />

              {/* Info Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-indigo-600" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <h3 className="font-semibold text-indigo-900 mb-3">✨ Features:</h3>
                    <ul className="space-y-2 text-sm text-indigo-800">
                      <li>• 🗺️ Interactive OpenStreetMap with real driving routes</li>
                      <li>• 📍 Start and destination markers with location details</li>
                      <li>• 🛣️ Automated route calculation using OpenStreetMap data</li>
                      <li>• 🔒 100% Free - No API keys or rate limits required</li>
                      <li>• 🌍 Global coverage with community-maintained data</li>
                      <li>• 💡 Click markers to see location information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* No Results */}
        {searched && !isLoading && !showMap && !error && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Route Found</h2>
              <p className="text-gray-600">
                Unable to find a route between {from} and {to}. Please try different cities.
              </p>
            </div>
          </section>
        )}

        {/* Info Section */}
        {!searched && (
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">🗺️ How It Works:</h3>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li>• Enter source and destination cities to visualize the route</li>
                  <li>• View the route on an interactive OpenStreetMap with real road routing</li>
                  <li>• See start and destination markers with location details</li>
                  <li>• Automatic route calculation using OpenStreetMap Routing Machine</li>
                  <li>• 100% Free - No API keys, rate limits, or paid services required</li>
                  <li>• Powered by OpenStreetMap (community-maintained global map data)</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
