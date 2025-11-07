import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Sparkles, Calendar, Users, DollarSign, Clock } from "lucide-react"
import Link from "next/link"

export default function AIItineraryPage() {
  const capabilities = [
    { icon: Calendar, title: "Smart Scheduling", description: "Optimize your time with intelligent day planning" },
    { icon: DollarSign, title: "Budget Optimization", description: "Stay within budget while maximizing experiences" },
    { icon: Users, title: "Group Preferences", description: "Balance different interests and needs" },
    { icon: Clock, title: "Real-time Adjustments", description: "Adapt to changes and unexpected situations" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Smart Itinerary AI</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Generate personalized itineraries based on your preferences, budget, and travel style.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Create AI Itinerary</Link>
            </Button>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">How AI Planning Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Tell Us Your Preferences</h3>
                <p className="text-gray-600">
                  Share your interests, budget, travel dates, and any special requirements or constraints.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">AI Analyzes & Plans</h3>
                <p className="text-gray-600">
                  Our AI processes millions of data points to create the perfect itinerary tailored just for you.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-indigo-900 mb-4">Receive & Customize</h3>
                <p className="text-gray-600">
                  Get your personalized itinerary and make adjustments as needed with real-time updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">AI Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-900 mb-2">{capability.title}</h3>
                    <p className="text-sm text-gray-600">{capability.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
              <Sparkles className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-bold mb-6">Ready for Your AI-Powered Adventure?</h2>
              <p className="text-xl mb-8 opacity-90">
                Let our AI create the perfect itinerary that matches your dreams and budget.
              </p>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3">
                <Link href="/plan-trip">Start AI Planning</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
