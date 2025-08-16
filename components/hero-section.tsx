"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Plane, Search, Sparkles } from "lucide-react"

export function HeroSection() {
  const [searchType, setSearchType] = useState("manual")
  const [manualSearch, setManualSearch] = useState({
    from: "",
    to: "",
    date: "",
    mode: "",
  })
  const [aiPrompt, setAiPrompt] = useState("")

  const handleManualSearch = () => {
    // Handle manual search logic
    console.log("Manual search:", manualSearch)
  }

  const handleAiSearch = () => {
    // Handle AI search logic
    console.log("AI search:", aiPrompt)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-24 h-24 opacity-20">
          <Plane className="w-full h-full text-white" />
        </div>
        <div className="absolute bottom-32 left-1/4 w-28 h-28 opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <circle cx="50" cy="30" r="15" fill="currentColor" />
            <path d="M20,70 Q50,50 80,70 L80,85 Q50,75 20,85 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Title */}
        <div className="animate-fade-in mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Plan Your Journey, <span className="text-orange-300">Your Way</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
            Discover amazing destinations with AI-powered trip planning and smart route optimization
          </p>
        </div>

        {/* Search Interface */}
        <div className="animate-slide-up bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 max-w-3xl mx-auto">
          <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
              <TabsTrigger
                value="manual"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600"
              >
                <Search className="w-4 h-4" />
                Manual Search
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600"
              >
                <Sparkles className="w-4 h-4" />
                AI Prompt Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    From
                  </Label>
                  <Input
                    id="from"
                    placeholder="Enter departure city"
                    value={manualSearch.from}
                    onChange={(e) => setManualSearch((prev) => ({ ...prev, from: e.target.value }))}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to" className="text-gray-700 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    To
                  </Label>
                  <Input
                    id="to"
                    placeholder="Enter destination city"
                    value={manualSearch.to}
                    onChange={(e) => setManualSearch((prev) => ({ ...prev, to: e.target.value }))}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Travel Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={manualSearch.date}
                    onChange={(e) => setManualSearch((prev) => ({ ...prev, date: e.target.value }))}
                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode" className="text-gray-700 font-medium flex items-center gap-2">
                    <Plane className="w-4 h-4 text-indigo-600" />
                    Mode of Travel
                  </Label>
                  <Select
                    value={manualSearch.mode}
                    onValueChange={(value) => setManualSearch((prev) => ({ ...prev, mode: value }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select travel mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="mixed">Mixed Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleManualSearch}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Routes
              </Button>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt" className="text-gray-700 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Describe Your Perfect Trip
                </Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Plan me a budget trip from Kollam to Goa in December with beach activities and local cuisine experiences..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-32 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                />
                <p className="text-sm text-gray-500">
                  Be specific about your preferences, budget, activities, and travel style for better recommendations.
                </p>
              </div>

              <Button
                onClick={handleAiSearch}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Itinerary
              </Button>
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">50K+</div>
              <div className="text-sm text-gray-600">Routes Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">200+</div>
              <div className="text-sm text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
