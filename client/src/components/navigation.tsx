import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Compass className="text-primary text-2xl" />
            <span className="text-2xl font-bold text-gray-800">WayWise</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Destinations</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Hotels</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Experiences</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">Support</a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 hover:text-primary">
              Sign In
            </Button>
            <Button className="bg-primary text-white hover:bg-blue-700">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
