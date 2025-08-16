import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"

export default function PlanTripPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        {/* Additional trip planning features can be added here */}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
