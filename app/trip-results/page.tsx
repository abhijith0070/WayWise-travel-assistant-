'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarIcon, MapPinIcon, Download, Share2, Heart, Plane, Utensils, Hotel, Compass, Lightbulb, Sun, Moon, Coffee, IndianRupee, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TripResults() {
  const searchParams = useSearchParams()
  const [tripPlan, setTripPlan] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const plan = searchParams.get('plan')
    if (plan) {
      setTripPlan(decodeURIComponent(plan))
    }
  }, [searchParams])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: "Link Copied!", description: "Itinerary link copied to clipboard" })
  }

  const handleDownload = () => {
    toast({ title: "Downloading...", description: "Your itinerary PDF will download shortly" })
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-amber-50/20">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Compass className="w-20 h-20 mx-auto text-sky-400 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Trip Plan Found</h1>
            <p className="text-gray-600">Start planning your adventure from the trip planner page.</p>
            <Button size="lg" className="mt-6" onClick={() => window.location.href = '/plan-trip'}>Create Itinerary</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-amber-50/20">
      <Navbar />
      <div className="pt-20 pb-8 px-4 bg-gradient-to-r from-blue-500/10 via-sky-400/10 to-amber-400/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent mb-3">Day-by-Day Itinerary</h1>
          <p className="text-lg text-gray-600 font-light">Personalized travel plan with budget, highlights, and tips</p>
        </div>
      </div>
      <main className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl border-white/60 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm px-4 py-2 rounded-full">
                  <CalendarIcon className="w-4 h-4 mr-2" />Complete Itinerary
                </Badge>
              </div>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-light">{tripPlan}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-500">Your Itinerary</p>
              <p className="text-2xl font-bold text-gray-900">Ready to Go</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload} className="rounded-full bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600">
              <Download className="w-4 h-4 mr-2" />Export PDF
            </Button>
            <Button onClick={handleShare} variant="outline" className="rounded-full">
              <Share2 className="w-4 h-4 mr-2" />Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
