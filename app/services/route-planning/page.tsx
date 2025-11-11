"use client"

import { useState, useCallback } from "react"
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Route as RouteIcon, Zap, Fuel, Navigation, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const libraries: ("places" | "geometry")[] = ["places", "geometry"]

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Center of India
}

interface Station {
  id: string
  name: string
  lat: number
  lng: number
  type: "fuel" | "ev"
  rating?: number
  address?: string
}

export default function RoutePlanningPage() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null)
  const [distance, setDistance] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [fuelStations, setFuelStations] = useState<Station[]>([])
  const [evStations, setEvStations] = useState<Station[]>([])

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries,
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const searchNearbyStations = async (
    location: google.maps.LatLng,
    type: "gas_station" | "electric_vehicle_charging_station",
    stationType: "fuel" | "ev"
  ): Promise<Station[]> => {
    if (!map) return []

    const service = new google.maps.places.PlacesService(map)

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius: 50000, // 50km radius
        type: type,
      }

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const stations: Station[] = results.slice(0, 10).map((place, index) => ({
            id: place.place_id || `${stationType}-${index}`,
            name: place.name || `${stationType === "fuel" ? "Fuel" : "EV Charging"} Station`,
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            type: stationType,
            rating: place.rating,
            address: place.vicinity,
          }))
          resolve(stations)
        } else {
          resolve([])
        }
      })
    })
  }

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      setError("Please enter both source and destination cities")
      return
    }

    if (!isLoaded) {
      setError("Google Maps is still loading. Please wait...")
      return
    }

    setIsLoading(true)
    setError(null)
    setSearched(false)
    setDirectionsResponse(null)
    setFuelStations([])
    setEvStations([])
    setDistance("")
    setDuration("")

    try {
      console.log(`🗺️ Searching route: ${from} → ${to}`)

      // Initialize services
      const directionsService = new google.maps.DirectionsService()
      const geocoder = new google.maps.Geocoder()

      // Geocode both locations
      const [fromResult, toResult] = await Promise.all([
        geocoder.geocode({ address: from }),
        geocoder.geocode({ address: to }),
      ])

      if (!fromResult.results[0]) {
        throw new Error(`Could not find location: "${from}"`)
      }
      if (!toResult.results[0]) {
        throw new Error(`Could not find location: "${to}"`)
      }

      const fromLocation = fromResult.results[0].geometry.location
      const toLocation = toResult.results[0].geometry.location

      // Get directions
      const directionsResult = await directionsService.route({
        origin: fromLocation,
        destination: toLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      })

      if (directionsResult.routes.length === 0) {
        throw new Error("No route found between these locations")
      }

      setDirectionsResponse(directionsResult)

      // Extract distance and duration
      const route = directionsResult.routes[0]
      if (route.legs.length > 0) {
        setDistance(route.legs[0].distance?.text || "")
        setDuration(route.legs[0].duration?.text || "")
      }

      // Calculate midpoint for Places API search
      const path = route.overview_path
      const midIndex = Math.floor(path.length / 2)
      const midpoint = path[midIndex]

      console.log(`📍 Route midpoint: ${midpoint.lat()}, ${midpoint.lng()}`)

      // Search for nearby stations at the midpoint
      const [fuelResults, evResults] = await Promise.all([
        searchNearbyStations(midpoint, "gas_station", "fuel"),
        searchNearbyStations(midpoint, "electric_vehicle_charging_station", "ev"),
      ])

      setFuelStations(fuelResults)
      setEvStations(evResults)

      setSearched(true)
      console.log(`✅ Route found: ${route.legs[0].distance?.text}`)
      console.log(`⛽ Found ${fuelResults.length} fuel stations`)
      console.log(`⚡ Found ${evResults.length} EV stations`)
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

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-600">Error loading Google Maps. Please check your API key.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                  disabled={isLoading || !from.trim() || !to.trim() || !isLoaded}
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
        {searched && !isLoading && directionsResponse && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Route Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <RouteIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Distance</p>
                        <p className="text-2xl font-bold text-gray-900">{distance || "N/A"}</p>
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
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-2xl font-bold text-gray-900">{duration || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Fuel className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fuel Stations</p>
                        <p className="text-2xl font-bold text-gray-900">{fuelStations.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">EV Stations</p>
                        <p className="text-2xl font-bold text-gray-900">{evStations.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Map</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={defaultCenter}
                      zoom={6}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                      options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                      }}
                    >
                      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}

                      {/* Fuel Station Markers */}
                      {fuelStations.map((station) => (
                        <Marker
                          key={station.id}
                          position={{ lat: station.lat, lng: station.lng }}
                          icon={{
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <circle cx="16" cy="16" r="14" fill="#F97316" stroke="white" stroke-width="2"/>
                                <text x="16" y="22" font-size="16" text-anchor="middle" fill="white">⛽</text>
                              </svg>
                            `),
                            scaledSize: new google.maps.Size(32, 32),
                          }}
                          title={station.name}
                          onClick={() => {
                            const infoWindow = new google.maps.InfoWindow({
                              content: `
                                <div style="padding: 8px;">
                                  <strong>⛽ ${station.name}</strong>
                                  ${station.rating ? `<br/><small>Rating: ${station.rating} ⭐</small>` : ""}
                                  ${station.address ? `<br/><small>${station.address}</small>` : ""}
                                </div>
                              `,
                            })
                            if (map) {
                              infoWindow.setPosition({ lat: station.lat, lng: station.lng })
                              infoWindow.open(map)
                            }
                          }}
                        />
                      ))}

                      {/* EV Station Markers */}
                      {evStations.map((station) => (
                        <Marker
                          key={station.id}
                          position={{ lat: station.lat, lng: station.lng }}
                          icon={{
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <circle cx="16" cy="16" r="14" fill="#10B981" stroke="white" stroke-width="2"/>
                                <text x="16" y="22" font-size="16" text-anchor="middle" fill="white">⚡</text>
                              </svg>
                            `),
                            scaledSize: new google.maps.Size(32, 32),
                          }}
                          title={station.name}
                          onClick={() => {
                            const infoWindow = new google.maps.InfoWindow({
                              content: `
                                <div style="padding: 8px;">
                                  <strong>⚡ ${station.name}</strong>
                                  ${station.rating ? `<br/><small>Rating: ${station.rating} ⭐</small>` : ""}
                                  ${station.address ? `<br/><small>${station.address}</small>` : ""}
                                </div>
                              `,
                            })
                            if (map) {
                              infoWindow.setPosition({ lat: station.lat, lng: station.lng })
                              infoWindow.open(map)
                            }
                          }}
                        />
                      ))}
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* POI Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Fuel Stations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-orange-600" />
                      Fuel Stations ({fuelStations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fuelStations.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {fuelStations.map((station) => (
                          <div key={station.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2 flex-1">
                              <Fuel className="w-4 h-4 text-orange-600 mt-1" />
                              <div className="flex-1">
                                <span className="text-sm font-medium block">{station.name}</span>
                                {station.rating && (
                                  <span className="text-xs text-gray-600">Rating: {station.rating} ⭐</span>
                                )}
                                {station.address && (
                                  <span className="text-xs text-gray-500 block">{station.address}</span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No fuel stations found nearby</p>
                    )}
                  </CardContent>
                </Card>

                {/* EV Stations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      EV Charging Stations ({evStations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {evStations.length > 0 ? (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {evStations.map((station) => (
                          <div key={station.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2 flex-1">
                              <Zap className="w-4 h-4 text-green-600 mt-1" />
                              <div className="flex-1">
                                <span className="text-sm font-medium block">{station.name}</span>
                                {station.rating && (
                                  <span className="text-xs text-gray-600">Rating: {station.rating} ⭐</span>
                                )}
                                {station.address && (
                                  <span className="text-xs text-gray-500 block">{station.address}</span>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No EV stations found nearby</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* No Results */}
        {searched && !isLoading && !directionsResponse && !error && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Route Found</h2>
              <p className="text-gray-600">
                Unable to find a driving route between {from} and {to}. Please try different cities.
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
                  <li>• Enter source and destination cities to find the optimal driving route</li>
                  <li>• View the route on an interactive Google Map with detailed directions</li>
                  <li>• Find nearby fuel stations (⛽) and EV charging stations (⚡) along your route</li>
                  <li>• Get distance, duration, and station ratings</li>
                  <li>• Powered by Google Maps Platform (Directions, Geocoding, and Places APIs)</li>
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
