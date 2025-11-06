"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, MapPin, Clock, DollarSign, Bus, Train, Plane, Car, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { routesData, cities } from "@/data/routesData"
import { matchCity } from "@/utils/fuzzyMatch"

const getModeIcon = (mode: string) => {
  const modeLower = mode.toLowerCase()
  if (modeLower.includes('bus')) return <Bus className="w-5 h-5" />
  if (modeLower.includes('train')) return <Train className="w-5 h-5" />
  if (modeLower.includes('flight')) return <Plane className="w-5 h-5" />
  if (modeLower.includes('car')) return <Car className="w-5 h-5" />
  return <MapPin className="w-5 h-5" />
}

interface Route {
  id?: number
  from?: string
  to?: string
  mode: string
  price: string | number
  duration: string
  operator?: string
  amenities?: string[]
  image?: string
}

function SearchRoutesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [mode, setMode] = useState("AUTO")
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [routes, setRoutes] = useState<Route[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const lastSearchRef = useRef<string>("")

  // Auto-fill and search from URL parameters
  useEffect(() => {
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')
    const modeParam = searchParams.get('mode')
    const dateParam = searchParams.get('date')
    
    // Set form values from URL params
    if (fromParam) setFrom(fromParam)
    if (toParam) setTo(toParam)
    // Handle mode param - default to "AUTO" if empty or missing
    if (modeParam) {
      setMode(modeParam)
    } else {
      setMode("AUTO")
    }
    if (dateParam) setDate(dateParam)
    
    // Create a unique key for this search to prevent duplicate calls
    // Normalize mode param - treat empty/null as 'AUTO'
    const normalizedMode = modeParam && modeParam !== 'all' ? modeParam : 'AUTO'
    const searchKey = `${fromParam || ''}|${toParam || ''}|${normalizedMode}|${dateParam || ''}`
    
    // Auto-search if both from and to are provided
    // Only trigger if params have changed and not already loading
    if (fromParam && toParam && searchKey !== lastSearchRef.current && !isLoading) {
      lastSearchRef.current = searchKey
      // Trigger search with params directly
      fetchRoutes(fromParam, toParam, modeParam || "", dateParam || "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchRoutes = async (fromCity?: string, toCity?: string, modeType?: string, dateParam?: string) => {
    const searchFrom = fromCity || from
    const searchTo = toCity || to
    let searchMode = modeType !== undefined ? modeType : mode
    
    // Map old mode values to new format
    const modeMap: Record<string, string> = {
      'AUTO': '',
      'all': '',
      'Bus': 'Bus',
      'Train': 'Train',
      'Flight': 'Flight',
      'Car': 'Car',
      'BUS': 'Bus',
      'TRAIN': 'Train',
      'FLIGHT': 'Flight',
    }
    if (modeMap[searchMode] !== undefined) {
      searchMode = modeMap[searchMode]
    }
    
    if (!searchFrom.trim() || !searchTo.trim()) {
      setError("Please enter both source and destination")
      return
    }

    setIsLoading(true)
    setError(null)
    setRoutes([])
    setSearched(false)

    try {
      console.log(`🔍 Searching routes: ${searchFrom} → ${searchTo}`)

      // TRY SCRAPING ROME2RIO FIRST
      const scrapeResponse = await fetch('/api/scrape-routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          from: searchFrom.trim(), 
          to: searchTo.trim(), 
          mode: searchMode,
        }),
      })

      const scrapeData = await scrapeResponse.json()

      if (scrapeData.success && scrapeData.routes && scrapeData.routes.length > 0) {
        console.log(`✅ Successfully scraped ${scrapeData.routes.length} routes from Rome2Rio`)
        
        // Format scraped routes to match our interface
        const formattedRoutes = scrapeData.routes.map((route: any, index: number) => ({
          id: index + 1,
          from: searchFrom,
          to: searchTo,
          mode: route.mode,
          price: route.price,
          duration: route.duration,
          operator: route.operator || 'Various operators',
          amenities: ['Web scraped data'],
          image: '/images/default.jpg',
        }))

        setRoutes(formattedRoutes)
        setSearched(true)
        setError(null)
        setIsLoading(false)
        return
      }

      // FALLBACK TO DUMMY DATA if scraping fails
      console.log('⚠️ Scraping failed or no routes found, using dummy data fallback...')
      
      const matchedFrom = matchCity(searchFrom, cities)
      const matchedTo = matchCity(searchTo, cities)

      if (!matchedFrom || !matchedTo) {
        setError(`No routes found from "${searchFrom}" to "${searchTo}". Try cities like: ${cities.slice(0, 5).join(', ')}, etc.`)
        setRoutes([])
        setSearched(true)
        setIsLoading(false)
        return
      }

      const results = routesData.filter(route =>
        route.from === matchedFrom &&
        route.to === matchedTo &&
        (!searchMode || route.mode === searchMode)
      )

      if (results.length > 0) {
        console.log(`✅ Found ${results.length} routes in dummy data`)
      }

      setRoutes(results)
      setSearched(true)
      setError(null)
    } catch (err) {
      console.error('❌ Search error:', err)
      setError('Search failed. Please try again.')
      setRoutes([])
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Alias for backward compatibility with button click
  const searchRoutes = () => {
    // Reset last search key to allow manual re-search
    lastSearchRef.current = ""
    fetchRoutes()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && from.trim() && to.trim()) {
      searchRoutes()
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
                <Search className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">Search Transport Routes</h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Find available buses, trains, flights, and car rentals for your journey
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
                  Search Routes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="e.g., Kochi, Mumbai"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="e.g., Trivandrum, Pune"
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mode">Transport Mode</Label>
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger id="mode">
                        <SelectValue placeholder="All modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All modes</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Train">Train</SelectItem>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Car">Car Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={searchRoutes}
                  disabled={isLoading || !from.trim() || !to.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Searching Available Routes...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
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

        {/* Loading State */}
        {isLoading && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-900">Searching Routes</h2>
                <p className="text-gray-600">Finding available transport options for your journey...</p>
              </div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {searched && !isLoading && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {routes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Routes Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any routes from {from} to {to}
                    {mode && mode !== 'AUTO' && ` by ${mode}`}.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try searching for different cities or change the transport mode.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {routes.length} {routes.length === 1 ? 'Route' : 'Routes'} Found
                    </h2>
                    <p className="text-gray-600">
                      From {from} to {to}
                      {mode && mode !== 'AUTO' && ` by ${mode}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {routes.map((route) => (
                      <Card key={route.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getModeIcon(route.mode)}
                              <Badge variant="secondary" className="text-sm">
                                {route.mode}
                              </Badge>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700 text-white text-base font-semibold">
                              {typeof route.price === 'number' 
                                ? `₹${route.price.toLocaleString()}`
                                : route.price}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{route.from} → {route.to}</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                            <span className="font-medium text-gray-700">{route.from}</span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-700">{route.to}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">Duration: {route.duration}</span>
                            </div>
                          </div>

                          {/* Amenities */}
                          {route.amenities && route.amenities.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">Amenities:</p>
                              <div className="flex flex-wrap gap-1">
                                {route.amenities.map((amenity, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Info Section */}
        {!searched && (
          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-3">💡 Search Tips:</h3>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li>• Enter city names (e.g., "Kochi", "Mumbai", "Bangalore")</li>
                  <li>• Select a specific transport mode or search across all modes</li>
                  <li>• Results are sorted by price (lowest first)</li>
                  <li>• Try nearby cities if no direct routes are available</li>
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

export default function SearchRoutesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    }>
      <SearchRoutesContent />
    </Suspense>
  )
}
