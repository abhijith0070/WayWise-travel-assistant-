import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hotels } from "@/lib/travel-data";

export default function AccommodationFinder() {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filters = ["All", "Budget", "Mid-range", "Luxury", "Near Beach", "City Center"];

  const filteredHotels = hotels.filter(hotel => {
    if (activeFilter === "All") return true;
    return hotel.category.toLowerCase() === activeFilter.toLowerCase() || 
           hotel.features.includes(activeFilter.toLowerCase());
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find Perfect Accommodation</h2>
          <p className="text-gray-600">AI-curated hotels based on your preferences</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter ? "bg-primary text-white" : ""}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <Card key={hotel.id} className="card-hover overflow-hidden">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{hotel.location}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{hotel.price.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/night</span>
                  </div>
                  <Button className="bg-primary text-white hover:bg-blue-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
