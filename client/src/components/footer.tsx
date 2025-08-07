import { Compass, Download, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const socialLinks = [
    { name: "Facebook", href: "#", icon: "fab fa-facebook" },
    { name: "Twitter", href: "#", icon: "fab fa-twitter" },
    { name: "Instagram", href: "#", icon: "fab fa-instagram" },
    { name: "LinkedIn", href: "#", icon: "fab fa-linkedin" }
  ];

  const quickLinks = [
    "About Us", "How It Works", "Destinations", "Travel Guides"
  ];

  const supportLinks = [
    "Help Center", "Contact Us", "Privacy Policy", "Terms of Service"
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Compass className="text-primary text-2xl" />
              <span className="text-2xl font-bold">WayWise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your smart travel partner for unforgettable journeys powered by AI.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Download App</h4>
            <div className="space-y-3">
              <Button className="bg-primary text-white hover:bg-blue-700 w-full">
                <Download className="mr-2 w-4 h-4" />
                Download Offline Trip
              </Button>
              <div className="text-center">
                <Badge className="bg-gray-800 text-gray-300">
                  <Bot className="mr-1 w-3 h-3" />
                  Powered by AI
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 WayWise. All rights reserved. Made with ❤️ for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
