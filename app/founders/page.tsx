import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { SpeakerSection } from "@/components/Founders-section"

export default function FoundersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="pt-16 pb-10 text-center max-w-4xl mx-auto px-4 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our Founders
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto">
            Get to know the passionate team behind WayWise who are dedicated to revolutionizing travel planning and making your journeys unforgettable.
          </p>
        </section>

        {/* Founders Section */}
        <section className="py-16">
          <SpeakerSection />
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
