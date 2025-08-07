import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import TripSummary from "@/components/trip-summary";
import AccommodationFinder from "@/components/accommodation-finder";
import FuelEvSupport from "@/components/fuel-ev-support";
import TouristRecommendations from "@/components/tourist-recommendations";
import ItineraryGenerator from "@/components/itinerary-generator";
import SmartTools from "@/components/smart-tools";
import AiChatbot from "@/components/ai-chatbot";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <TripSummary />
      <AccommodationFinder />
      <FuelEvSupport />
      <TouristRecommendations />
      <ItineraryGenerator />
      <SmartTools />
      <AiChatbot />
      <Footer />
    </div>
  );
}
