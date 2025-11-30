"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Star, TrendingUp, Heart, Navigation, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const popularDestinations = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    rating: 4.8,
    reviews: 2847,
    description: "Beaches, nightlife, and Portuguese heritage",
    tags: ["Beach", "Nightlife", "Culture"],
    priceRange: "₹₹",
    trending: true,
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    country: "India",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    rating: 4.9,
    reviews: 3251,
    description: "Serene houseboats and lush green landscapes",
    tags: ["Nature", "Relaxation", "Houseboats"],
    priceRange: "₹₹",
    trending: false,
  },
  {
    id: 3,
    name: "Manali",
    country: "India",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    rating: 4.7,
    reviews: 1923,
    description: "Hill station paradise for adventure lovers",
    tags: ["Mountains", "Adventure", "Snow"],
    priceRange: "₹₹",
    trending: true,
  },
  {
    id: 4,
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    rating: 4.9,
    reviews: 5642,
    description: "Luxury shopping, ultramodern architecture",
    tags: ["Luxury", "Shopping", "Modern"],
    priceRange: "₹₹₹",
    trending: true,
  },
  {
    id: 5,
    name: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    rating: 5.0,
    reviews: 4187,
    description: "Tropical paradise with crystal clear waters",
    tags: ["Beach", "Luxury", "Honeymoon"],
    priceRange: "₹₹₹₹",
    trending: false,
  },
  {
    id: 6,
    name: "Jaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    rating: 4.6,
    reviews: 2156,
    description: "Pink city with royal palaces and forts",
    tags: ["Heritage", "Culture", "History"],
    priceRange: "₹",
    trending: false,
  },
  {
    id: 7,
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.8,
    reviews: 6234,
    description: "Island of gods with temples and beaches",
    tags: ["Beach", "Culture", "Temples"],
    priceRange: "₹₹",
    trending: true,
  },
  {
    id: 8,
    name: "Switzerland",
    country: "Switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    rating: 4.9,
    reviews: 3892,
    description: "Alpine beauty with snow-capped mountains",
    tags: ["Mountains", "Nature", "Luxury"],
    priceRange: "₹₹₹₹",
    trending: false,
  },
]

export function PopularSpots() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              Trending Destinations
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular <span className="text-orange-500">Spots</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most loved destinations by travelers worldwide
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popularDestinations.map((destination) => (
            <div
              key={destination.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {destination.trending && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(destination.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Location Badge */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold text-lg">{destination.name}</span>
                  </div>
                  <p className="text-white/80 text-sm">{destination.country}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span className="font-bold text-gray-900">{destination.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({destination.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {destination.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {destination.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{destination.priceRange}</span>
                    <span className="text-xs ml-1">avg. cost</span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Link href={`/plan-trip?destination=${encodeURIComponent(destination.name)}`}>
                      <Navigation className="w-3 h-3 mr-1" />
                      Explore
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white">
            <Camera className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">
              Can't Find Your Dream Destination?
            </h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-white/90">
              Use our AI-powered trip planner to discover hidden gems and personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
              >
                <Link href="/plan-trip">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Plan Custom Trip
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold"
              >
                <Link href="/search-routes">
                  <MapPin className="w-5 h-5 mr-2" />
                  Search Routes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)
