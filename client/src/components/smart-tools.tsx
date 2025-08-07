import { CloudSun, RefreshCw, Wallet, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SmartTools() {
  const tools = [
    {
      icon: CloudSun,
      title: "Weather Forecast",
      content: (
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-600">28°C</p>
          <p className="text-sm text-gray-600">Partly Cloudy</p>
          <p className="text-xs text-gray-500 mt-2">Perfect beach weather!</p>
        </div>
      ),
      iconColor: "text-blue-500"
    },
    {
      icon: RefreshCw,
      title: "Currency Converter",
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm">USD</span>
            <span className="font-medium">$1 = ₹83.12</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm">EUR</span>
            <span className="font-medium">€1 = ₹89.45</span>
          </div>
        </div>
      ),
      iconColor: "text-green-500"
    },
    {
      icon: Wallet,
      title: "Budget Optimizer",
      content: (
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-2xl font-bold text-accent">₹15,000</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-accent h-2 rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">65% spent</p>
        </div>
      ),
      iconColor: "text-accent"
    },
    {
      icon: Bell,
      title: "Live Alerts",
      content: (
        <div className="space-y-2">
          <div className="bg-green-50 p-2 rounded text-xs flex items-center">
            <span className="text-green-600 mr-1">✓</span> Flight on time
          </div>
          <div className="bg-yellow-50 p-2 rounded text-xs flex items-center">
            <span className="text-yellow-600 mr-1">!</span> Light traffic on route
          </div>
          <div className="bg-blue-50 p-2 rounded text-xs flex items-center">
            <span className="text-blue-600 mr-1">i</span> Hotel check-in available
          </div>
        </div>
      ),
      iconColor: "text-red-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Smart Travel Tools</h2>
          <p className="text-gray-600">AI-powered assistants for seamless travel</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card key={tool.title} className="card-hover">
              <CardContent className="p-6 text-center">
                <tool.icon className={`${tool.iconColor} text-4xl mb-4 mx-auto`} />
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                {tool.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
