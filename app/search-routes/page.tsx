"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, MapPin, Clock, Plane, Train as TrainIcon, Bus as BusIcon, Car as CarIcon, ArrowLeft, Calendar, Building, Info } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toIataCode } from "@/lib/airportMapping"
import { toStationCode } from "@/lib/stationMapping"
import manualRoutesData from "@/data/manualRoutes.json"

type SearchMode = "flight" | "train" | "bus" | "car"

interface Flight {
  airline: string
  flightNumber: string
  flightIata: string
  flightIcao: string
  departure: {
    airport: string
    iata: string
    timezone: string
    scheduledTime: string
    estimatedTime: string
    actualTime: string | null
    terminal: string | null
    gate: string | null
  }
  arrival: {
    airport: string
    iata: string
    timezone: string
    estimatedTime: string
    actualTime: string | null
    terminal: string | null
    gate: string | null
  }
  flightStatus: string
  flightDate: string
  aircraftType: string | null
}

interface Train {
  trainNumber: string
  trainName: string
  from: string
  to: string
  fromCode: string
  toCode: string
  departureTime: string
  arrivalTime: string
  currentStatus?: string
  currentLocation?: string
  runningStatus?: string
  delay?: string
  travelClass?: string
  quota?: string
  availability?: any[]
  fare?: string
  distance?: string
  duration?: string
  date: string
  type: "live-status" | "seat-availability"
}

interface ManualRoute {
  from: string
  to: string
  mode: "Bus" | "Car"
  duration: string
  cost: string
  operator?: string
  vehicle?: string
  departureTime?: string
  arrivalTime?: string
  busType?: string
  fuelCost?: string
  tollCost?: string
}

const getStatusBadgeColor = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'active' || statusLower === 'landed' || statusLower === 'running') return 'bg-green-600'
  if (statusLower === 'scheduled' || statusLower === 'on time') return 'bg-blue-600'
  if (statusLower === 'cancelled') return 'bg-red-600'
  if (statusLower === 'delayed') return 'bg-yellow-600'
  return 'bg-gray-600'
}

const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString || dateTimeString === 'N/A') return 'N/A'
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateTimeString
  }
}

function SearchRoutesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<SearchMode>("flight")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [trainNumber, setTrainNumber] = useState("")
  const [travelClass, setTravelClass] = useState("SL")
  const [isLoading, setIsLoading] = useState(false)
  const [flights, setFlights] = useState<Flight[]>([])
  const [trains, setTrains] = useState<Train[]>([])
  const [manualRoutes, setManualRoutes] = useState<ManualRoute[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const lastSearchRef = useRef<string>("")

  // Auto-fill and search from URL parameters
  useEffect(() => {
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')
    const modeParam = searchParams.get('mode') as SearchMode | null
    
    // Set form values from URL params
    if (fromParam) setFrom(fromParam)
    if (toParam) setTo(toParam)
    if (modeParam && (modeParam === 'flight' || modeParam === 'train' || modeParam === 'bus' || modeParam === 'car')) {
      setMode(modeParam)
    }
    
    // Create a unique key for this search to prevent duplicate calls
    const searchKey = `${modeParam || 'flight'}|${fromParam || ''}|${toParam || ''}`
    
    // Auto-search if both from and to are provided
    // Only trigger if params have changed and not already loading
    if (fromParam && toParam && searchKey !== lastSearchRef.current && !isLoading) {
      lastSearchRef.current = searchKey
      // Trigger search with params directly
      if (modeParam === 'train') {
        fetchTrains(fromParam, toParam)
      } else if (modeParam === 'bus' || modeParam === 'car') {
        fetchManualRoutes(fromParam, toParam, modeParam)
      } else {
        fetchFlights(fromParam, toParam)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const fetchFlights = async (fromCity?: string, toCity?: string) => {
    const searchFrom = fromCity || from
    const searchTo = toCity || to
    
    if (!searchFrom.trim() || !searchTo.trim()) {
      setError("Please enter both departure and arrival cities")
      return
    }

    // Convert city names to IATA codes
    const fromIata = toIataCode(searchFrom)
    const toIata = toIataCode(searchTo)

    if (!fromIata || !toIata) {
      setError(`Unable to find airport codes for "${searchFrom}" or "${searchTo}". Please try major city names or IATA codes.`)
      return
    }

    setIsLoading(true)
    setError(null)
    setFlights([])
    setSearched(false)

    try {
      console.log(`✈️ Searching flights: ${searchFrom} (${fromIata}) → ${searchTo} (${toIata})`)

      // Fetch flights in both directions
      const [outboundResponse, inboundResponse] = await Promise.all([
        fetch('/api/flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: fromIata, to: toIata }),
        }),
        fetch('/api/flights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: toIata, to: fromIata }),
        }),
      ])

      const outboundData = await outboundResponse.json()
      const inboundData = await inboundResponse.json()

      // Combine flights from both directions
      const allFlights: Flight[] = [
        ...(outboundData.success ? outboundData.flights : []),
        ...(inboundData.success ? inboundData.flights : []),
      ]

      if (allFlights.length > 0) {
        console.log(`✅ Found ${allFlights.length} flight(s)`)
        setFlights(allFlights)
        setSearched(true)
        setError(null)
      } else {
        const errorMsg = outboundData.message || inboundData.message || `No flights found between ${searchFrom} and ${searchTo}`
        setError(errorMsg)
        setFlights([])
        setSearched(true)
      }
    } catch (err) {
      console.error('❌ Flight search error:', err)
      setError('Failed to search flights. Please try again.')
      setFlights([])
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTrains = async (fromCity?: string, toCity?: string) => {
    const searchFrom = fromCity || from
    const searchTo = toCity || to
    const searchTrainNumber = trainNumber.trim()
    
    // Either train number OR both from/to required
    if (!searchTrainNumber && (!searchFrom.trim() || !searchTo.trim())) {
      setError("Please enter train number or both source and destination stations")
      return
    }

    setIsLoading(true)
    setError(null)
    setTrains([])
    setSearched(false)

    try {
      let fromStation = "";
      let toStation = "";

      // Convert city names to station codes if from/to provided
      if (searchFrom && searchTo) {
        fromStation = toStationCode(searchFrom)
        toStation = toStationCode(searchTo)

        if (!fromStation || !toStation) {
          setError(`Unable to find station codes for "${searchFrom}" or "${searchTo}". Please try major city names or station codes.`)
          setIsLoading(false)
          return
        }
      }

      console.log(`🚂 Searching trains: ${searchTrainNumber || `${searchFrom} (${fromStation}) → ${searchTo} (${toStation})`}`)

      const response = await fetch('/api/trains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trainNumber: searchTrainNumber || undefined,
          from: fromStation || undefined,
          to: toStation || undefined,
          classCode: travelClass,
          quota: "GN"
        }),
      })

      const data = await response.json()

      if (data.success && data.trains && data.trains.length > 0) {
        console.log(`✅ Found ${data.trains.length} train(s)`)
        setTrains(data.trains)
        setSearched(true)
        setError(null)
      } else {
        const errorMsg = data.message || `No trains found`
        setError(errorMsg)
        setTrains([])
        setSearched(true)
      }
    } catch (err) {
      console.error('❌ Train search error:', err)
      setError('Failed to search trains. Please try again.')
      setTrains([])
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchManualRoutes = async (fromCity?: string, toCity?: string, searchMode?: SearchMode) => {
    const searchFrom = fromCity || from
    const searchTo = toCity || to
    const currentMode = searchMode || mode
    
    if (!searchFrom.trim() || !searchTo.trim()) {
      setError("Please enter both source and destination cities")
      return
    }

    setIsLoading(true)
    setError(null)
    setManualRoutes([])
    setSearched(false)

    try {
      const modeLabel = currentMode === 'bus' ? 'Bus' : 'Car'
      console.log(`🚌 Searching ${modeLabel} routes: ${searchFrom} → ${searchTo}`)

      // Filter routes from JSON data
      const routes = manualRoutesData.filter((route) => {
        const fromMatch = route.from.toLowerCase() === searchFrom.trim().toLowerCase()
        const toMatch = route.to.toLowerCase() === searchTo.trim().toLowerCase()
        const modeMatch = route.mode.toLowerCase() === modeLabel.toLowerCase()
        
        return fromMatch && toMatch && modeMatch
      })

      if (routes.length > 0) {
        console.log(`✅ Found ${routes.length} ${modeLabel} route(s)`)
        setManualRoutes(routes as ManualRoute[])
        setSearched(true)
        setError(null)
      } else {
        setError(`No ${modeLabel.toLowerCase()} routes found between ${searchFrom} and ${searchTo}. Try: Goa, Delhi, Chennai, Kolkata, Bengaluru, or Jaipur.`)
        setManualRoutes([])
        setSearched(true)
      }
    } catch (err) {
      console.error(`❌ ${mode} search error:`, err)
      setError(`Failed to search ${mode} routes. Please try again.`)
      setManualRoutes([])
      setSearched(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Unified search handler
  const handleSearch = () => {
    // Reset last search key to allow manual re-search
    lastSearchRef.current = ""
    if (mode === 'flight') {
      fetchFlights()
    } else if (mode === 'train') {
      fetchTrains()
    } else if (mode === 'bus' || mode === 'car') {
      fetchManualRoutes()
    }
  }

  // Alias for backward compatibility with button click
  const searchFlights = () => {
    // Reset last search key to allow manual re-search
    lastSearchRef.current = ""
    fetchFlights()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (mode === 'flight' && from.trim() && to.trim()) {
        handleSearch()
      } else if (mode === 'train' && (trainNumber.trim() || (from.trim() && to.trim()))) {
        handleSearch()
      } else if ((mode === 'bus' || mode === 'car') && from.trim() && to.trim()) {
        handleSearch()
      }
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
                {mode === 'flight' ? (
                  <Plane className="w-8 h-8 text-white" />
                ) : mode === 'train' ? (
                  <TrainIcon className="w-8 h-8 text-white" />
                ) : mode === 'bus' ? (
                  <BusIcon className="w-8 h-8 text-white" />
                ) : (
                  <CarIcon className="w-8 h-8 text-white" />
                )}
              </div>
              <h1 className="text-4xl font-serif font-bold mb-4">
                {mode === 'flight' ? 'Search Real-Time Flights' : 
                 mode === 'train' ? 'Search Indian Trains' :
                 mode === 'bus' ? 'Search Bus Routes' : 'Search Car Routes'}
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {mode === 'flight' 
                  ? 'Find live flight information powered by AviationStack API'
                  : mode === 'train'
                  ? 'Find live train status and seat availability powered by IndianRailAPI'
                  : mode === 'bus'
                  ? 'Find bus routes between major Indian cities'
                  : 'Find car travel routes and costs between cities'}
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
                  {mode === 'flight' ? 'Search Flights' : 
                   mode === 'train' ? 'Search Trains' :
                   mode === 'bus' ? 'Search Bus Routes' : 'Search Car Routes'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selector */}
                <div className="space-y-2">
                  <Label htmlFor="mode">Transport Mode</Label>
                  <Select value={mode} onValueChange={(value) => {
                    setMode(value as SearchMode)
                    setError(null)
                    setSearched(false)
                    setFlights([])
                    setTrains([])
                    setManualRoutes([])
                  }}>
                    <SelectTrigger id="mode" className="text-base">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">
                        <div className="flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          <span>Flight (Live API)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="train">
                        <div className="flex items-center gap-2">
                          <TrainIcon className="w-4 h-4" />
                          <span>Train (Live API)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bus">
                        <div className="flex items-center gap-2">
                          <BusIcon className="w-4 h-4" />
                          <span>Bus (Offline)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="car">
                        <div className="flex items-center gap-2">
                          <CarIcon className="w-4 h-4" />
                          <span>Car (Offline)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Flight Search Fields */}
                {mode === 'flight' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from">From (City or IATA Code)</Label>
                      <Input
                        id="from"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="e.g., Kochi, COK, Delhi, DEL"
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to">To (City or IATA Code)</Label>
                      <Input
                        id="to"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="e.g., Dubai, DXB, Mumbai, BOM"
                        className="text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Train Search Fields */}
                {mode === 'train' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="trainNumber">Train Number (Optional)</Label>
                      <Input
                        id="trainNumber"
                        value={trainNumber}
                        onChange={(e) => setTrainNumber(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="e.g., 12626 (Kerala Express)"
                        className="text-base"
                      />
                      <p className="text-xs text-gray-500">Enter train number to get live status</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from">From (City or Station Code)</Label>
                        <Input
                          id="from"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="e.g., Delhi, NDLS, Kochi, ERS"
                          className="text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="to">To (City or Station Code)</Label>
                        <Input
                          id="to"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="e.g., Mumbai, CSTM, Trivandrum, TVC"
                          className="text-base"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Travel Class</Label>
                        <Select value={travelClass} onValueChange={setTravelClass}>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1A">First AC (1A)</SelectItem>
                            <SelectItem value="2A">Second AC (2A)</SelectItem>
                            <SelectItem value="3A">Third AC (3A)</SelectItem>
                            <SelectItem value="SL">Sleeper (SL)</SelectItem>
                            <SelectItem value="CC">Chair Car (CC)</SelectItem>
                            <SelectItem value="2S">Second Seating (2S)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {(mode === 'bus' || mode === 'car') && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bus-from">From City</Label>
                        <Input
                          id="bus-from"
                          placeholder="e.g., Goa, Delhi, Chennai"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bus-to">To City</Label>
                        <Input
                          id="bus-to"
                          placeholder="e.g., Delhi, Bengaluru, Kolkata"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleSearch}
                  disabled={isLoading || (mode === 'flight' && (!from.trim() || !to.trim())) || (mode === 'train' && !trainNumber.trim() && (!from.trim() || !to.trim())) || ((mode === 'bus' || mode === 'car') && (!from.trim() || !to.trim()))}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {mode === 'flight' ? 'Searching Real-Time Flights...' : mode === 'train' ? 'Searching Trains...' : mode === 'bus' ? 'Searching Bus Routes...' : 'Searching Car Routes...'}
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      {mode === 'flight' ? 'Search Flights' : mode === 'train' ? 'Search Trains' : mode === 'bus' ? 'Search Bus Routes' : 'Search Car Routes'}
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  {mode === 'flight' ? 'Searching Flights' : 'Searching Trains'}
                </h2>
                <p className="text-gray-600">
                  {mode === 'flight' 
                    ? 'Fetching real-time flight data from AviationStack API...'
                    : 'Fetching live train data from IndianRailAPI...'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Error Display */}
        {error && !isLoading && (
          <section className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p className="font-medium">⚠️ {error}</p>
              </div>
            </div>
          </section>
        )}

        {/* Results Section - Flights */}
        {searched && !isLoading && mode === 'flight' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {flights.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✈️</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Flights Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any flights from {from} to {to}.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try searching for different cities or use airport IATA codes (e.g., COK for Kochi).
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {flights.length} {flights.length === 1 ? 'Flight' : 'Flights'} Found
                    </h2>
                    <p className="text-gray-600">
                      Showing results for {from} ↔ {to}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flights.map((flight, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Plane className="w-5 h-5 text-indigo-600" />
                              <Badge variant="secondary" className="text-sm font-semibold">
                                {flight.flightIata}
                              </Badge>
                            </div>
                            <Badge className={`${getStatusBadgeColor(flight.flightStatus)} hover:opacity-90 text-white text-xs font-semibold`}>
                              {flight.flightStatus.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{flight.airline}</p>
                          <p className="text-sm text-gray-500">Flight #{flight.flightNumber}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Departure Info */}
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-green-800 uppercase">Departure</p>
                                <p className="text-sm font-semibold text-gray-900">{flight.departure.airport}</p>
                                <p className="text-xs text-gray-600">IATA: {flight.departure.iata}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900">
                                {formatDateTime(flight.departure.estimatedTime)}
                              </span>
                            </div>
                            {flight.departure.terminal && (
                              <p className="text-xs text-gray-600 mt-1">
                                Terminal: {flight.departure.terminal}
                                {flight.departure.gate && ` • Gate: ${flight.departure.gate}`}
                              </p>
                            )}
                          </div>

                          {/* Arrival Info */}
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-blue-800 uppercase">Arrival</p>
                                <p className="text-sm font-semibold text-gray-900">{flight.arrival.airport}</p>
                                <p className="text-xs text-gray-600">IATA: {flight.arrival.iata}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-gray-900">
                                {formatDateTime(flight.arrival.estimatedTime)}
                              </span>
                            </div>
                            {flight.arrival.terminal && (
                              <p className="text-xs text-gray-600 mt-1">
                                Terminal: {flight.arrival.terminal}
                                {flight.arrival.gate && ` • Gate: ${flight.arrival.gate}`}
                              </p>
                            )}
                          </div>

                          {/* Flight Date */}
                          {flight.flightDate && flight.flightDate !== 'N/A' && (
                            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">Date: {flight.flightDate}</span>
                            </div>
                          )}

                          {/* Aircraft Type */}
                          {flight.aircraftType && (
                            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                              <Building className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">Aircraft: {flight.aircraftType}</span>
                            </div>
                          )}

                          <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                            View Details
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

        {/* Results Section - Trains */}
        {searched && !isLoading && mode === 'train' && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {trains.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚂</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Trains Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find train data for your search.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try different station codes or verify the train number.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {trains.length} {trains.length === 1 ? 'Train' : 'Trains'} Found
                    </h2>
                    <p className="text-gray-600">
                      Live train information from IndianRailAPI
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trains.map((train, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-indigo-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrainIcon className="w-5 h-5 text-indigo-600" />
                              <Badge variant="secondary" className="text-sm font-semibold">
                                {train.trainNumber}
                              </Badge>
                            </div>
                            {train.currentStatus && (
                              <Badge className={`${getStatusBadgeColor(train.currentStatus)} hover:opacity-90 text-white text-xs font-semibold`}>
                                {train.currentStatus.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900">{train.trainName}</p>
                          <p className="text-sm text-gray-500">{train.fromCode} → {train.toCode}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Source Station */}
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-green-800 uppercase">Source</p>
                                <p className="text-sm font-semibold text-gray-900">{train.from}</p>
                                <p className="text-xs text-gray-600">Code: {train.fromCode}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900">
                                Departure: {train.departureTime}
                              </span>
                            </div>
                          </div>

                          {/* Destination Station */}
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-blue-800 uppercase">Destination</p>
                                <p className="text-sm font-semibold text-gray-900">{train.to}</p>
                                <p className="text-xs text-gray-600">Code: {train.toCode}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-gray-900">
                                Arrival: {train.arrivalTime}
                              </span>
                            </div>
                          </div>

                          {/* Live Status Info */}
                          {train.type === 'live-status' && (
                            <>
                              {train.currentLocation && (
                                <div className="flex items-center gap-2 text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                                  <Info className="w-4 h-4 text-yellow-600" />
                                  <span className="text-gray-700">Currently at: {train.currentLocation}</span>
                                </div>
                              )}
                              {train.delay && train.delay !== '0 min' && (
                                <div className="flex items-center gap-2 text-sm bg-red-50 p-2 rounded border border-red-200">
                                  <Clock className="w-4 h-4 text-red-600" />
                                  <span className="text-gray-700">Delay: {train.delay}</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Seat Availability Info */}
                          {train.type === 'seat-availability' && (
                            <>
                              {train.travelClass && (
                                <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                                  <Badge variant="outline">{train.travelClass}</Badge>
                                  <span className="text-gray-700">Class</span>
                                </div>
                              )}
                              {train.fare && train.fare !== 'N/A' && (
                                <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded">
                                  <span className="font-semibold text-green-700">Fare: ₹{train.fare}</span>
                                </div>
                              )}
                              {train.duration && train.duration !== 'N/A' && (
                                <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">Duration: {train.duration}</span>
                                </div>
                              )}
                            </>
                          )}

                          <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                            View Details
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

        {/* Results Section - Bus/Car Routes */}
        {searched && !isLoading && (mode === 'bus' || mode === 'car') && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {manualRoutes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{mode === 'bus' ? '🚌' : '🚗'}</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">No {mode === 'bus' ? 'Bus' : 'Car'} Routes Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any {mode} routes from {from} to {to}.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try: Goa, Delhi, Chennai, Kolkata, Bengaluru, or Jaipur
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {mode === 'bus' ? '🚌' : '🚗'} {manualRoutes.length} {mode === 'bus' ? 'Bus' : 'Car'} {manualRoutes.length === 1 ? 'Route' : 'Routes'} Found
                    </h2>
                    <p className="text-gray-600">
                      Showing results for {from} → {to}
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {manualRoutes.map((route, index) => (
                      <Card key={index} className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          {/* Route Header */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-indigo-600 text-white px-3 py-1 text-sm">
                                {route.mode.toUpperCase()}
                              </Badge>
                              <h3 className="text-xl font-bold text-gray-900">
                                {route.from} → {route.to}
                              </h3>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-indigo-600">₹{route.cost}</p>
                              <p className="text-xs text-gray-500">Total Cost</p>
                            </div>
                          </div>

                          {/* Route Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Origin */}
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-green-800 uppercase">Origin</p>
                                <p className="text-sm font-semibold text-gray-900">{route.from}</p>
                                {mode === 'bus' && route.departureTime && (
                                  <p className="text-xs text-gray-600">Departure: {route.departureTime}</p>
                                )}
                              </div>
                            </div>

                            {/* Destination */}
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-blue-800 uppercase">Destination</p>
                                <p className="text-sm font-semibold text-gray-900">{route.to}</p>
                                {mode === 'bus' && route.arrivalTime && (
                                  <p className="text-xs text-gray-600">Arrival: {route.arrivalTime}</p>
                                )}
                              </div>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">Duration: {route.duration}</span>
                            </div>

                            {/* Operator/Vehicle */}
                            <div className="flex items-center gap-2 text-sm bg-indigo-50 p-2 rounded">
                              <Info className="w-4 h-4 text-indigo-600" />
                              <span className="text-gray-700">
                                {mode === 'bus' ? `Operator: ${route.operator}` : `Vehicle: ${route.vehicle}`}
                              </span>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="space-y-2">
                            {mode === 'bus' && route.busType && (
                              <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded border border-blue-200">
                                <Badge variant="outline" className="border-blue-400 text-blue-700">
                                  {route.busType}
                                </Badge>
                                <span className="text-gray-700">Bus Type</span>
                              </div>
                            )}
                            
                            {mode === 'car' && (
                              <div className="grid grid-cols-2 gap-2">
                                {route.fuelCost && (
                                  <div className="flex items-center gap-2 text-sm bg-yellow-50 p-2 rounded">
                                    <span className="text-gray-700">Fuel: ₹{route.fuelCost}</span>
                                  </div>
                                )}
                                {route.tollCost && (
                                  <div className="flex items-center gap-2 text-sm bg-orange-50 p-2 rounded">
                                    <span className="text-gray-700">Tolls: ₹{route.tollCost}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <Button className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                            View Details
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
                {mode === 'flight' ? (
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li>• Enter city names (e.g., "Kochi", "Mumbai", "Dubai") or IATA codes (e.g., "COK", "BOM", "DXB")</li>
                    <li>• Results show real-time flight data from AviationStack API</li>
                    <li>• Search includes flights in both directions automatically</li>
                    <li>• Flight status: Active, Scheduled, Landed, Delayed, or Cancelled</li>
                    <li>• Major cities and international airports are supported</li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li>• Enter train number to get live running status (e.g., "12626" for Kerala Express)</li>
                    <li>• Or enter source and destination cities/station codes for seat availability</li>
                    <li>• Supported cities: Delhi (NDLS), Mumbai (CSTM), Bangalore (SBC), Chennai (MAS), Kochi (ERS), etc.</li>
                    <li>• Results show live train status, current location, delay information, and seat availability</li>
                    <li>• Select your preferred travel class (1A, 2A, 3A, SL, CC, 2S)</li>
                    <li>• Data powered by IndianRailAPI</li>
                  </ul>
                )}
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
