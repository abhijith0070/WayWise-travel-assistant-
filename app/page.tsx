"use client";

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { PopularSpots } from "@/components/popular-spots"
import { SpeakerSection } from "@/components/Founders-section"
import { Footer } from "@/components/footer"
import { Chatbot } from "@/components/chatbot"
import { ScrollProgress } from "@/components/scroll-progress"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PopularSpots />
        <SpeakerSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
