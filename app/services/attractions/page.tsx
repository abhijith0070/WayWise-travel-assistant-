import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Camera, Mountain, Building, Utensils, Music } from "lucide-react"
import Link from "next/link"

export default function AttractionsPage() {
  const categories = [
    { icon: Mountain, name: "Nature & Parks", description: "Scenic landscapes and outdoor adventures" },
    { icon: Building, name: "Historical Sites", description: "Museums, monuments, and cultural heritage" },
    { icon: Utensils, name: "Food & Dining", description: "Local cuisine and culinary experiences" },
    { icon: Music, name: "Entertainment", description: "Shows, concerts, and nightlife" },
    { icon: Camera, name: "Photography Spots", description: "Instagram-worthy locations and viewpoints" },
    { icon: MapPin, name: "Hidden Gems", description: "Off-the-beaten-path discoveries" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Tourist Attractions</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Explore curated attractions, hidden gems, and local experiences at your destination.
            </p>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
              <Link href="/plan-trip">Discover Attractions</Link>
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-indigo-900 text-center mb-12">Explore by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl font-serif text-indigo-900 text-center">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600">{category.description}</p>
                    </CardContent>
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
