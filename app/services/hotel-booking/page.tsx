import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hotel, Star, Wifi, Car, Coffee, Dumbbell } from "lucide-react"
import Link from "next/link"

export default function HotelBookingPage() {
  const amenities = [
    { icon: Wifi, name: "Free WiFi" },
    { icon: Car, name: "Parking" },
    { icon: Coffee, name: "Breakfast" },
    { icon: Dumbbell, name: "Fitness Center" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hotel className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Hotel Booking</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover and book accommodations that match your style and budget perfectly.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Find Hotels</Link>
            </Button>
          </div>
        </section>

        {/* Hotel Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">
              Accommodations for Every Budget
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-xl font-serif text-indigo-900 text-center">Budget Hotels</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Comfortable stays without breaking the bank</p>
                  <p className="text-2xl font-bold text-orange-500">$30-80/night</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-orange-200">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-xl font-serif text-indigo-900 text-center">Premium Hotels</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Enhanced comfort with excellent amenities</p>
                  <p className="text-2xl font-bold text-orange-500">$80-200/night</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-xl font-serif text-indigo-900 text-center">Luxury Hotels</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Ultimate luxury and personalized service</p>
                  <p className="text-2xl font-bold text-orange-500">$200+/night</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-12">Popular Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {amenities.map((amenity, index) => {
                const Icon = amenity.icon
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-orange-500" />
                    </div>
                    <span className="text-gray-700 font-medium">{amenity.name}</span>
                  </div>
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
