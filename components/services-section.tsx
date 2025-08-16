import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Route, Plane, Hotel, MapPin, Fuel, Brain, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Route,
    title: "Route Planning",
    description: "Optimize your travel routes with AI-powered algorithms for the most efficient and scenic journeys.",
    color: "indigo",
    href: "/services/route-planning",
  },
  {
    icon: Plane,
    title: "Ticket Booking",
    description: "Book flights, trains, and buses with real-time pricing and instant confirmation.",
    color: "cyan",
    href: "/services/ticket-booking",
  },
  {
    icon: Hotel,
    title: "Hotel Finder & Booking",
    description: "Discover and book accommodations that match your style and budget perfectly.",
    color: "orange",
    href: "/services/hotel-booking",
  },
  {
    icon: MapPin,
    title: "Tourist Spots & Activities",
    description: "Explore curated attractions, hidden gems, and local experiences at your destination.",
    color: "purple",
    href: "/services/attractions",
  },
  {
    icon: Fuel,
    title: "Fuel & EV Stations",
    description: "Find fuel stations and EV charging points along your route for seamless road trips.",
    color: "green",
    href: "/services/fuel-stations",
  },
  {
    icon: Brain,
    title: "Smart Itinerary AI",
    description: "Generate personalized itineraries based on your preferences, budget, and travel style.",
    color: "pink",
    href: "/services/ai-itinerary",
  },
]

const colorClasses = {
  indigo: {
    bg: "bg-indigo-100",
    icon: "text-indigo-600",
    button: "bg-indigo-600 hover:bg-indigo-700",
  },
  cyan: {
    bg: "bg-cyan-100",
    icon: "text-cyan-600",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600",
    button: "bg-green-600 hover:bg-green-700",
  },
  pink: {
    bg: "bg-pink-100",
    icon: "text-pink-600",
    button: "bg-pink-600 hover:bg-pink-700",
  },
}

export function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-6">Our Services</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprehensive travel solutions powered by AI and backed by years of industry expertise. Everything you need
            for the perfect journey, all in one place.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {services.map((service, index) => {
            const Icon = service.icon
            const colors = colorClasses[service.color as keyof typeof colorClasses]

            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <CardTitle className="text-xl font-serif font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">4.9/5</span>
                  </div>

                  <Button
                    asChild
                    className={`w-full ${colors.button} text-white font-medium transition-all duration-300 group-hover:scale-105`}
                  >
                    <Link href={service.href} className="flex items-center justify-center">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-bold text-indigo-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of travelers who trust Way-Wise for their perfect adventures.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/plan-trip">
                Start Planning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
