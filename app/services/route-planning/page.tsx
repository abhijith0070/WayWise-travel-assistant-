import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Route, MapPin, Clock, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function RoutePlanningPage() {
  const features = [
    "AI-powered route optimization",
    "Real-time traffic updates",
    "Multi-modal transportation options",
    "Scenic route recommendations",
    "Cost-effective path finding",
    "Weather-aware routing",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Route className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Route Planning</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Optimize your travel routes with AI-powered algorithms for the most efficient and scenic journeys.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Start Route Planning</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-6">Smart Route Optimization</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Our advanced AI algorithms analyze millions of data points to find you the perfect route, considering
                  traffic, weather, fuel costs, and your personal preferences.
                </p>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-6">
                  <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-indigo-900 mb-2">Save Time</h3>
                  <p className="text-sm text-gray-600">Up to 30% faster routes</p>
                </Card>
                <Card className="text-center p-6">
                  <Zap className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-indigo-900 mb-2">Save Money</h3>
                  <p className="text-sm text-gray-600">Reduce fuel costs by 25%</p>
                </Card>
                <Card className="text-center p-6">
                  <MapPin className="w-8 h-8 text-cyan-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-indigo-900 mb-2">Discover More</h3>
                  <p className="text-sm text-gray-600">Hidden gems along the way</p>
                </Card>
                <Card className="text-center p-6">
                  <Route className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-indigo-900 mb-2">Multiple Options</h3>
                  <p className="text-sm text-gray-600">Compare different routes</p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
