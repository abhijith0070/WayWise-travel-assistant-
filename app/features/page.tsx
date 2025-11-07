"use client";

import { ShieldCheck, Rocket, Users, Map, Calendar, Star } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Chatbot } from "@/components/chatbot";

const features = [
	{
		icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
		title: "Secure & Private",
		desc: "Your data and privacy are always protected with us.",
	},
	{
		icon: <Rocket className="w-8 h-8 text-indigo-600" />,
		title: "Fast Planning",
		desc: "Get instant itineraries and recommendations powered by AI.",
	},
	{
		icon: <Users className="w-8 h-8 text-orange-500" />,
		title: "Community Driven",
		desc: "Join a vibrant community of passionate travelers.",
	},
	{
		icon: <Map className="w-8 h-8 text-indigo-600" />,
		title: "Smart Routing",
		desc: "Optimize your routes for time, cost, and experience.",
	},
	{
		icon: <Calendar className="w-8 h-8 text-orange-500" />,
		title: "Flexible Scheduling",
		desc: "Easily adjust plans to fit your schedule and preferences.",
	},
	{
		icon: <Star className="w-8 h-8 text-indigo-600" />,
		title: "Top Rated Support",
		desc: "Our team is here 24/7 to help you every step of the way.",
	},
];

export default function FeaturesPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<main className="pt-16">
				{/* Hero Section */}
				<section className="pt-16 pb-10 text-center max-w-3xl mx-auto px-4 bg-gradient-to-br from-indigo-500 via-blue-400 to-teal-300">
					<h1 className="text-4xl font-bold text-white mb-4">
						Our Key Features
					</h1>
					<p className="text-lg text-blue-50">
						Explore the innovative tools and services that make WayWise the
						perfect travel companion.
					</p>
				</section>

				{/* Features Grid */}
				<section className="max-w-6xl mx-auto px-4 py-16">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, idx) => (
							<div
								key={idx}
								className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl group"
							>
								<div className="mb-4">{feature.icon}</div>
								<h3 className="text-xl font-semibold text-indigo-800 mb-2 group-hover:text-orange-500 transition-colors">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.desc}</p>
							</div>
						))}
					</div>
				</section>
			</main>
			<Footer />
			<Chatbot />
		</div>
	);
}