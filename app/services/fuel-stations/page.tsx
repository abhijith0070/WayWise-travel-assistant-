import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Fuel, Zap, MapPin, Clock, CreditCard, Navigation } from "lucide-react"
import Link from "next/link"

export default function FuelStationsPage() {
  const features = [
    { icon: MapPin, title: "Real-time Locations", description: "Find nearby stations with live availability" },
    { icon: CreditCard, title: "Price Comparison", description: "Compare fuel prices across different stations" },
    { icon: Clock, title: "Operating Hours", description: "Check opening hours and 24/7 availability" },
    { icon: Navigation, title: "Route Integration", description: "Stations along your planned route" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Fuel className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Fuel & EV Stations</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Find fuel stations and EV charging points along your route for seamless road trips.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Find Stations</Link>
            </Button>
          </div>
        </section>

        {/* Station Types */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <Fuel className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-indigo-900">Fuel Stations</h3>
                    <p className="text-gray-600">Petrol, diesel, and alternative fuels</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Real-time fuel prices</li>
                  <li>• Station amenities and services</li>
                  <li>• Brand preferences and loyalty programs</li>
                  <li>• Payment methods accepted</li>
                </ul>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-indigo-900">EV Charging</h3>
                    <p className="text-gray-600">Electric vehicle charging networks</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Fast charging and supercharger locations</li>
                  <li>• Connector types and compatibility</li>
                  <li>• Charging speeds and estimated time</li>
                  <li>• Network memberships and pricing</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">Smart Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
