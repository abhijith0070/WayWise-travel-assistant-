import { Battery, Fuel } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FuelEvSupport() {
  const evStations = [
    { name: "BPCL EV Station", location: "Panaji, Goa • 2.5 km", status: "Available", statusColor: "bg-green-100 text-green-800" },
    { name: "Tata Power Station", location: "Margao, Goa • 5.2 km", status: "2 slots left", statusColor: "bg-yellow-100 text-yellow-800" }
  ];

  const fuelStations = [
    { name: "HP Petrol Pump", location: "NH66, Ponda • 1.8 km", price: "₹102.5/L" },
    { name: "IOCL Station", location: "Mapusa, Goa • 3.4 km", price: "₹101.8/L" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Fuel & EV Support</h2>
          <p className="text-gray-600">Smart route optimization with charging and fuel stations</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Battery className="text-secondary mr-2" />
                EV Charging Stations
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-green-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Battery className="text-4xl text-secondary mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">EV Charging Network</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {evStations.map((station, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-600">{station.location}</p>
                    </div>
                    <Badge className={station.statusColor}>
                      {station.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Fuel className="text-accent mr-2" />
                Fuel Stations
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-orange-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <Fuel className="text-4xl text-accent mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Fuel Station Network</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {fuelStations.map((station, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-600">{station.location}</p>
                    </div>
                    <span className="text-lg font-semibold text-green-600">{station.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
