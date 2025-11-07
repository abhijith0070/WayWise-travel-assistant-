"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";

const founders = [
	{
		name: "ABHIJITH S",
		title: "Co-Founder & CEO",
		image: "/abhi.jpg",
		bio: "Visionary leader driving innovation in travel technology.",
		gradient: "from-blue-500/20 to-blue-600/20",
		socials: {
			instagram: "https://www.instagram.com/_abhijith__s.__?igsh=MWRxMmFvMnJzd2xhbQ==",
		},
	},
	{
		name: "JITHIN JYOTHI",
		title: "Co-Founder & CTO",
		image: "/jithin.jpg",
		bio: "Tech innovator passionate about seamless user experiences.",
		gradient: "from-green-500/20 to-green-600/20",
		socials: {
			instagram: "https://www.instagram.com/jithin_music?igsh=Ynp4MmFvbGx0OG84",
		},
	},
	{
		name: "GOVINDH R",
		title: "Co-Founder & COO",
		image: "/govind.jpg",
		bio: "Operations expert focused on delivering excellence.",
		gradient: "from-purple-500/20 to-purple-600/20",
		socials: {
			instagram: "https://www.instagram.com/_govind.r?igsh=MXRvNmFicDRkc3F4eg==",
		},
	},
];

export function SpeakerSection() {
	return (
		<section className="w-full py-16 px-4 flex flex-col items-center bg-gradient-to-b from-gray-50 to-white">
			{/* Top Headline */}
			<motion.div
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.3 }}
				variants={staggerContainer}
				className="text-center"
			>
				<motion.h2 
					variants={fadeInUp}
					className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
				>
					Meet Our Founders
				</motion.h2>
				<motion.p 
					variants={fadeInUp}
					className="text-base md:text-lg text-gray-600 mb-12 italic font-light"
				>
					Team expertise in travel innovation and technology
				</motion.p>
			</motion.div>

			{/* Cards Row */}
			<motion.div 
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				variants={staggerContainer}
				className="flex flex-col md:flex-row gap-5 justify-center items-center max-w-6xl w-full"
			>
				{founders.map((founder, idx) => (
					<motion.div
						key={idx}
						variants={scaleIn}
						className="group relative w-full md:w-[300px] h-[300px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
						onClick={() => window.open(founder.socials?.instagram, "_blank")}
					>
						{/* Gradient Background Layer */}
						<div className={`absolute inset-0 bg-gradient-to-br ${founder.gradient} z-0`}></div>

						{/* Photo with Vignette Overlay */}
						<div className="absolute inset-0 z-10">
							<img
								src={founder.image}
								alt={founder.name}
								className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
							/>
							{/* Vignette effect */}
							<div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
						</div>

						{/* Arrow Icon - Top Right */}
						<div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
								<ArrowUpRight className="w-6 h-6 text-indigo-600" strokeWidth={2} />
							</div>
						</div>

						{/* Text Overlay - Bottom */}
						<div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
							<h3 className="text-xl font-bold text-white mb-1">
								{founder.name}
							</h3>
							<p className="text-sm text-orange-300 mb-2 font-medium">{founder.title}</p>
							<p className="text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								{founder.bio}
							</p>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Bottom Reinforcement Text */}
			<motion.p 
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ delay: 0.5, duration: 0.8 }}
				className="text-base text-gray-500 mt-12 text-center italic font-light"
			>
				Team expertise in travel innovation and technology
			</motion.p>
		</section>
	);
}
