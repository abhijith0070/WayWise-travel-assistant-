import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Train, Bus, Car, CreditCard, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TicketBookingPage() {
  const transportModes = [
    { icon: Plane, name: "Flights", description: "Domestic and international flights" },
    { icon: Train, name: "Trains", description: "High-speed and regional trains" },
    { icon: Bus, name: "Buses", description: "Intercity and local bus services" },
    { icon: Car, name: "Car Rentals", description: "Economy to luxury vehicles" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Ticket Booking</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Book flights, trains, and buses with real-time pricing and instant confirmation.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Book Now</Link>
            </Button>
          </div>
        </section>

        {/* Transport Modes */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">
              All Your Transportation Needs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {transportModes.map((mode, index) => {
                const Icon = mode.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-cyan-600" />
                      </div>
                      <CardTitle className="text-xl font-serif text-indigo-900">{mode.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{mode.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <CreditCard className="w-12 h-12 text-green-500 mx-auto mb-6" />
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Best Price Guarantee</h3>
                <p className="text-gray-600">
                  We compare prices across multiple providers to ensure you get the best deals available.
                </p>
              </Card>
              <Card className="text-center p-8">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Secure Booking</h3>
                <p className="text-gray-600">
                  Your payment information is protected with bank-level security and encryption.
                </p>
              </Card>
              <Card className="text-center p-8">
                <ArrowRight className="w-12 h-12 text-orange-500 mx-auto mb-6" />
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Instant Confirmation</h3>
                <p className="text-gray-600">
                  Receive your tickets immediately via email with QR codes for easy check-in.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
