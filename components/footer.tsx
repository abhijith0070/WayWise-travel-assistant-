
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { SpeakerSection } from "./Founders-section"

export function Footer() {

  return (
    <>
      <SpeakerSection />
      <footer className="bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="text-2xl font-serif font-bold text-white">Way-Wise</div>
              <p className="text-gray-300 leading-relaxed">
                Your trusted companion for intelligent travel planning and unforgettable journeys around the world.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              </div>
            </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/plan-trip" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Plan My Trip
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/route-planning" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Route Planning
                </Link>
              </li>
              <li>
                <Link href="/services/ticket-booking" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Ticket Booking
                </Link>
              </li>
              <li>
                <Link href="/services/hotel-booking" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Hotel Booking
                </Link>
              </li>
              <li>
                <Link href="/services/attractions" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Tourist Attractions
                </Link>
              </li>
              <li>
                <Link href="/services/fuel-stations" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Fuel & EV Stations
                </Link>
              </li>
              <li>
                <Link href="/services/ai-itinerary" className="text-gray-300 hover:text-orange-400 transition-colors">
                  AI Itinerary
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">hello@waywise.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© 2024 Way-Wise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-300 hover:text-orange-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-orange-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-300 hover:text-orange-400 text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
