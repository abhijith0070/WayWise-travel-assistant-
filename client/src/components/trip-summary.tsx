import { Route, Plane, Train, Bus, Car, Clock, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TripSummary() {
  const transportOptions = [
    {
      type: "Flight",
      icon: Plane,
      duration: "1h 30m",
      price: 4500,
      badge: "Recommended",
      badgeColor: "bg-green-100 text-green-800",
      description: "Fastest"
    },
    {
      type: "Train",
      icon: Train,
      duration: "14h 45m",
      price: 1200,
      badge: "Cheapest",
      badgeColor: "bg-blue-100 text-blue-800",
      description: "Scenic"
    },
    {
      type: "Bus",
      icon: Bus,
      duration: "12h 30m",
      price: 800,
      badge: "Budget",
      badgeColor: "bg-yellow-100 text-yellow-800",
      description: "Comfortable"
    },
    {
      type: "Car Rental",
      icon: Car,
      duration: "10h 15m",
      price: 3200,
      badge: "Premium",
      badgeColor: "bg-purple-100 text-purple-800",
      description: "Flexible"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Trip Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Route className="text-primary mr-2" />
                  Best Route
                </h3>
                <div className="bg-blue-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Route className="text-4xl text-primary mb-2 mx-auto" />
                    <p className="text-gray-600">Interactive Route Map</p>
                    <p className="text-sm text-gray-500">Kollam → Goa (595 km)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-secondary/10 text-center p-4">
                <Clock className="text-secondary text-2xl mb-2 mx-auto" />
                <p className="font-semibold">Total Time</p>
                <p className="text-sm text-gray-600">12h 30m</p>
              </Card>
              <Card className="bg-accent/10 text-center p-4">
                <IndianRupee className="text-accent text-2xl mb-2 mx-auto" />
                <p className="font-semibold">Estimated Cost</p>
                <p className="text-sm text-gray-600">₹8,500</p>
              </Card>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Transport Options</h3>
            <div className="space-y-3">
              {transportOptions.map((option) => (
                <Card key={option.type} className="card-hover cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <option.icon className="text-primary mr-3 w-6 h-6" />
                        <div>
                          <p className="font-medium">{option.type}</p>
                          <p className="text-sm text-gray-500">{option.duration} • {option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{option.price.toLocaleString()}</p>
                        <Badge className={option.badgeColor}>
                          {option.badge}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
