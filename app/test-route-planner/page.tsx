"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, MapPin, Navigation, Clock, Route as RouteIcon, CheckCircle, XCircle } from "lucide-react"

export default function TestRoutePlannerPage() {
  const [from, setFrom] = useState("Mumbai")
  const [to, setTo] = useState("Pune")
  const [mode, setMode] = useState("car")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testRouteAPI = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/route-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, mode }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data.data)
      } else {
        setError(data.error || data.details || 'Unknown error')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RouteIcon className="w-5 h-5" />
              Route Planner API Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From (City)</Label>
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g., Mumbai, Kollam, Delhi"
                />
              </div>

              <div>
                <Label htmlFor="to">To (City)</Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g., Pune, Goa, Bangalore"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mode">Travel Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select travel mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">🚗 Car</SelectItem>
                  <SelectItem value="bike">🚴 Bike</SelectItem>
                  <SelectItem value="walk">🚶 Walk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={testRouteAPI}
              disabled={isLoading || !from || !to || !mode}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Planning Route...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Plan Route
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Route Found!</strong> Successfully planned route from {result.from.city} to {result.to.city}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="font-semibold text-blue-900">{result.distance_km} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-semibold text-green-900">{result.duration_hr} hrs</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <RouteIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Travel Mode</p>
                    <p className="font-semibold text-purple-900 capitalize">{result.mode}</p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 border-l-4 border-blue-500 bg-blue-50">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">From</p>
                    <p className="font-medium">{result.from.label}</p>
                    <p className="text-xs text-gray-500">
                      {result.from.lat.toFixed(4)}, {result.from.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 border-l-4 border-green-500 bg-green-50">
                  <MapPin className="w-4 h-4 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">To</p>
                    <p className="font-medium">{result.to.label}</p>
                    <p className="text-xs text-gray-500">
                      {result.to.lat.toFixed(4)}, {result.to.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Route Info */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Route Information:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    Profile: {result.profile}
                  </Badge>
                  <Badge variant="outline">
                    Coordinates: {result.coordinates.length} points
                  </Badge>
                </div>
              </div>

              {/* Raw Response */}
              <details className="border border-gray-200 rounded-lg p-3">
                <summary className="font-medium cursor-pointer text-sm">
                  View Raw API Response
                </summary>
                <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        <Alert>
          <AlertDescription>
            <strong>Setup Instructions:</strong>
            <br />
            1. Get a free API key from <a href="https://openrouteservice.org/dev/#/signup" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenRouteService</a>
            <br />
            2. Add it to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file as <code className="bg-gray-100 px-1 rounded">ORS_API_KEY</code>
            <br />
            3. Restart your dev server
            <br />
            4. Test the route planner above
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}