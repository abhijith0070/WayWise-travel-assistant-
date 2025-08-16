import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { AboutSection } from "@/components/about-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <section className="py-20 gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">About Way-Wise</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Revolutionizing travel planning with AI-powered solutions and personalized experiences.
            </p>
          </div>
        </section>
        <AboutSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
