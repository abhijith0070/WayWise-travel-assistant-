import React from "react";

const speakers = [
  {
    name: "ABHIJITH S",
    title: "",
    image: "/ab.jpg",
    bio: "Specialist in adventure travel and sustainable tourism."
  },
  {
    name: "JITHIN JYOTHI",
    title: "",
    image: "/jjj.jpg",
    bio: "Passionate about world cultures and local experiences."
  },
  {
    name: "GOVINDH R",
    title: "",
    image: "/gr.jpg",
    bio: "Exploring the world with technology and remote work."
  }
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
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-24 h-24 rounded-full mb-4 border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300"
            />
            <h3 className="text-xl font-semibold mb-1">{speaker.name}</h3>
            <p className="text-blue-600 mb-2">{speaker.title}</p>
            <p className="text-gray-600 text-center">{speaker.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
