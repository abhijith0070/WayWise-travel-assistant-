import { Star, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recommendations } from "@/lib/travel-data";

export default function TouristRecommendations() {
  const handleAddToItinerary = (recommendationId: string) => {
    // Handle adding to itinerary
    console.log("Adding to itinerary:", recommendationId);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover Amazing Places</h2>
          <p className="text-gray-600">AI-recommended experiences tailored for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <Card key={item.id} className="card-hover overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${item.categoryColor}`}>
                    {item.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{item.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <Button 
                  onClick={() => handleAddToItinerary(item.id)}
                  className="bg-accent text-white hover:bg-orange-600 w-full"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Add to Itinerary
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
