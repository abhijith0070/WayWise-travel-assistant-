"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-white font-serif font-bold text-2xl">Way-Wise</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-orange-300 transition-colors font-medium">
              Home
            </Link>
            <Link href="/features" className="text-white hover:text-orange-300 transition-colors font-medium">
              Features
            </Link>
            <Link href="/services" className="text-white hover:text-orange-300 transition-colors font-medium">
              Services
            </Link>
            <Link href="/about" className="text-white hover:text-orange-300 transition-colors font-medium">
              About Us
            </Link>
            <Link href="/contact" className="text-white hover:text-orange-300 transition-colors font-medium">
              Contact
            </Link>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/plan-trip">Plan My Trip</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mt-2 p-4 space-y-3">
            <Link
              href="/"
              className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/features"
              className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/services"
              className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/about"
              className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="block text-white hover:text-orange-300 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button
              asChild
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href="/plan-trip">Plan My Trip</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
