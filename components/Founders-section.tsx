"use client";

import React from "react";

const speakers = [
	{
		name: "ABHIJITH S",
		title: "",
		image: "/ab.jpg",
		bio: "Specialist in adventure travel and sustainable tourism.",
		socials: {
			instagram: "https://www.instagram.com/_abhijith__s.__?igsh=MWRxMmFvMnJzd2xhbQ==",
		},
	},
	{
		name: "JITHIN JYOTHI",
		title: "",
		image: "/jjj.jpg",
		bio: "Passionate about world cultures and local experiences.",
		socials: {
			instagram: "https://www.instagram.com/jithin_music?igsh=Ynp4MmFvbGx0OG84",
		},
	},
	{
		name: "GOVINDH R",
		title: "",
		image: "/gr.jpg",
		bio: "Exploring the world with technology and remote work.",
		socials: {
			instagram: "https://www.instagram.com/_govind.r?igsh=MXRvNmFicDRkc3F4eg==",
		},
	},
];

export function SpeakerSection() {
	return (
		<section className="w-full py-12 flex flex-col items-center bg-white">
			<h2 className="text-3xl font-bold mb-8">Meet Our Founders</h2>
			<div className="flex gap-8 justify-center">
				{speakers.map((speaker, idx) => (
					<div
						key={idx}
						className="group relative bg-gray-100 rounded-xl shadow-lg p-6 w-72 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:scale-105"
					>
						<div
							className="text-center cursor-pointer"
							onClick={() => window.open(speaker.socials?.instagram, "_blank")}
						>
							<div className="relative mb-4">
								<img
									src={speaker.image}
									alt={speaker.name}
									className="w-32 h-32 rounded-full mx-auto object-cover transition-transform group-hover:scale-105"
								/>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
								{speaker.name}
							</h3>
							<p className="text-gray-600">{speaker.title}</p>
						</div>
						<p className="text-gray-600 text-center">{speaker.bio}</p>
					</div>
				))}
			</div>
		</section>
	);
}
