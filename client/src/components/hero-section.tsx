import { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTravelPlanning } from "@/hooks/use-travel-planning";

export default function HeroSection() {
  const [fromLocation, setFromLocation] = useState("Kollam");
  const [toLocation, setToLocation] = useState("Goa");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const { planTrip, isPlanning } = useTravelPlanning();

  const handlePlanTrip = () => {
    planTrip({
      fromLocation,
      toLocation,
      travelDate: new Date(travelDate),
      returnDate: returnDate ? new Date(returnDate) : undefined,
    });
  };

  return (
    <section className="relative gradient-bg text-white py-20 overflow-hidden">
      <div className="absolute inset-0 map-animation opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">WayWise</h1>
          <p className="text-xl md:text-2xl mb-2">Your Smart Travel Partner</p>
          <p className="text-lg opacity-90">Plan. Book. Explore. Smarter.</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 mb-2">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Kollam"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 mb-2">To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Goa"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Travel Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 mb-2">Return Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="lg:col-span-1 flex items-end">
              <Button 
                onClick={handlePlanTrip}
                disabled={isPlanning}
                className="w-full bg-primary text-white hover:bg-blue-700"
              >
                <Search className="mr-2 w-4 h-4" />
                {isPlanning ? "Planning..." : "Plan My Trip"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
