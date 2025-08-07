import { Download, Mail, Plane, Utensils, MapPin, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { itineraryData } from "@/lib/travel-data";

export default function ItineraryGenerator() {
  const iconMap = {
    transport: Plane,
    food: Utensils,
    activity: MapPin,
    sightseeing: Camera,
  };

  const handleDownloadPDF = () => {
    console.log("Downloading PDF...");
  };

  const handleEmailItinerary = () => {
    console.log("Emailing itinerary...");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Your Perfect Itinerary</h2>
          <p className="text-gray-600">AI-crafted day-by-day travel plan</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-semibold">3-Day Goa Adventure</h3>
              <p className="text-gray-600">Kollam to Goa • Dec 15-17, 2024</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleDownloadPDF}
                className="bg-secondary text-white hover:bg-green-600"
              >
                <Download className="mr-2 w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                onClick={handleEmailItinerary}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Mail className="mr-2 w-4 h-4" />
                Email Itinerary
              </Button>
            </div>
          </div>

          {itineraryData.map((day) => (
            <Card key={day.day} className="bg-gray-50 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    {day.day}
                  </div>
                  <h4 className="text-lg font-semibold">{day.title}</h4>
                </div>
                <div className="space-y-4 ml-11">
                  {day.activities.map((activity, index) => {
                    const IconComponent = iconMap[activity.type as keyof typeof iconMap] || MapPin;
                    return (
                      <Card key={index} className={`bg-white border-l-4 ${activity.borderColor}`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{activity.time} - {activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <IconComponent className={`${activity.iconColor} w-5 h-5`} />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
