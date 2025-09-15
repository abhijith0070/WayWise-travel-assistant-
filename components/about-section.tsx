"use client"

import { motion } from "framer-motion"
import { MapPin, Users, Award, Globe } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in">
            <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-6">About Way-Wise</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Way-Wise revolutionizes travel planning by combining cutting-edge AI technology with comprehensive travel
              services. We believe every journey should be perfectly tailored to your preferences, budget, and dreams.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              From route optimization to accommodation booking, our platform handles every aspect of your travel
              planning, making your adventures seamless and memorable. Join thousands of satisfied travelers who trust
              Way-Wise for their perfect getaways.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">50K+</div>
                  <div className="text-sm text-gray-600">Happy Travelers</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">200+</div>
                  <div className="text-sm text-gray-600">Destinations</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">1M+</div>
                  <div className="text-sm text-gray-600">Routes Planned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Video with Transition */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative"
          >
            <video
              src="/way.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-2xl shadow-2xl"
              poster="/ww.jpg"
            />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="w-10 h-10 text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
