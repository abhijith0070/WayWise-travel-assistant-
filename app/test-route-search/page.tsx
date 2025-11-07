"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Clock, DollarSign, CheckCircle, XCircle, Bus, Train, Plane, Car } from "lucide-react"

const getModeIcon = (mode: string) => {
  const modeLower = mode.toLowerCase()
  if (modeLower.includes('bus')) return <Bus className="w-4 h-4" />
  if (modeLower.includes('train')) return <Train className="w-4 h-4" />
  if (modeLower.includes('flight')) return <Plane className="w-4 h-4" />
  if (modeLower.includes('car')) return <Car className="w-4 h-4" />
  return <MapPin className="w-4 h-4" />
}

export default function TestRouteSearchPage() {
  const [from, setFrom] = useState("Kochi")
  const [to, setTo] = useState("Trivandrum")
  const [mode, setMode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const searchRoutes = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/routes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          from, 
          to, 
          mode: mode || undefined 
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult(data)
      } else {
        setError(data.error || data.details || 'Search failed')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Route Search Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g., Kochi, Mumbai"
                />
              </div>

              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g., Trivandrum, Pune"
                />
              </div>

              <div>
                <Label htmlFor="mode">Mode (Optional)</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="mode">
                    <SelectValue placeholder="All modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All modes</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Train">Train</SelectItem>
                    <SelectItem value="Flight">Flight</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={searchRoutes}
              disabled={isLoading || !from || !to}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Routes
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
                  <strong>Success!</strong> Found {result.count} route(s)
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {result && result.routes && result.routes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.routes.map((route: any) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getModeIcon(route.mode)}
                      <Badge variant="secondary">{route.mode}</Badge>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      ₹{route.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="font-medium">{route.source}</span>
                      <span>→</span>
                      <span className="font-medium">{route.destination}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">{route.duration}</span>
                    </div>
                    {route.distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{route.distance}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2">
                    <p className="text-xs font-medium text-gray-700">{route.operatorName}</p>
                    {route.departureTime && (
                      <p className="text-xs text-gray-500">
                        Departs: {route.departureTime}
                      </p>
                    )}
                  </div>

                  {route.amenities && route.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {route.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Alert>
          <AlertDescription>
            <strong>Example Searches:</strong>
            <br />
            • From: "Kochi" To: "Trivandrum" Mode: "Bus"
            <br />
            • From: "Kollam" To: "Goa" Mode: "" (all modes)
            <br />
            • From: "Mumbai" To: "Pune" Mode: "Train"
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}