export const hotels = [
  {
    id: "1",
    name: "Taj Exotica Resort & Spa",
    location: "Benaulim Beach, South Goa",
    price: 12500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Luxury",
    features: ["near beach", "spa", "pool"]
  },
  {
    id: "2",
    name: "The Leela Goa",
    location: "Cavelossim Beach, South Goa",
    price: 8200,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Luxury",
    features: ["near beach", "luxury", "spa"]
  },
  {
    id: "3",
    name: "FabHotel Prime",
    location: "Baga Beach, North Goa",
    price: 3500,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Budget",
    features: ["near beach", "budget", "wifi"]
  },
  {
    id: "4",
    name: "Casa Colvale",
    location: "Colvale, North Goa",
    price: 6800,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Mid-range",
    features: ["heritage", "peaceful", "authentic"]
  },
  {
    id: "5",
    name: "Grand Hyatt Goa",
    location: "Bambolim Beach, North Goa",
    price: 9800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Luxury",
    features: ["near beach", "luxury", "conference"]
  },
  {
    id: "6",
    name: "Novotel Goa Resort",
    location: "Candolim Beach, North Goa",
    price: 7200,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Mid-range",
    features: ["near beach", "family", "pool"]
  }
];

export const recommendations = [
  {
    id: "1",
    name: "Fisherman's Wharf",
    category: "Restaurant",
    categoryColor: "bg-orange-100 text-orange-800",
    rating: 4.7,
    description: "Authentic Goan seafood with stunning river views",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "2",
    name: "Basilica of Bom Jesus",
    category: "Cultural",
    categoryColor: "bg-purple-100 text-purple-800",
    rating: 4.6,
    description: "UNESCO World Heritage Site with stunning baroque architecture",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "3",
    name: "Palolem Beach",
    category: "Beach",
    categoryColor: "bg-blue-100 text-blue-800",
    rating: 4.8,
    description: "Crescent-shaped paradise perfect for relaxation and water sports",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "4",
    name: "Water Sports at Baga",
    category: "Adventure",
    categoryColor: "bg-green-100 text-green-800",
    rating: 4.5,
    description: "Thrilling parasailing, jet skiing, and banana boat rides",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "5",
    name: "Tito's Club",
    category: "Nightlife",
    categoryColor: "bg-pink-100 text-pink-800",
    rating: 4.4,
    description: "Iconic nightclub with live DJ performances and beachside vibes",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "6",
    name: "Anjuna Flea Market",
    category: "Shopping",
    categoryColor: "bg-yellow-100 text-yellow-800",
    rating: 4.3,
    description: "Vibrant market with local crafts, spices, and unique souvenirs",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  }
];

export const itineraryData = [
  {
    day: 1,
    title: "Day 1 - Arrival & North Goa",
    activities: [
      {
        time: "9:00 AM",
        title: "Arrival at Goa Airport",
        description: "Check-in at hotel and freshen up",
        type: "transport",
        borderColor: "border-primary",
        iconColor: "text-primary"
      },
      {
        time: "11:30 AM",
        title: "Baga Beach",
        description: "Water sports and beach relaxation",
        type: "activity",
        borderColor: "border-secondary",
        iconColor: "text-secondary"
      },
      {
        time: "1:00 PM",
        title: "Lunch at Fisherman's Wharf",
        description: "Authentic Goan seafood experience",
        type: "food",
        borderColor: "border-accent",
        iconColor: "text-accent"
      },
      {
        time: "7:00 PM",
        title: "Anjuna Flea Market",
        description: "Shopping for local crafts and souvenirs",
        type: "activity",
        borderColor: "border-purple-500",
        iconColor: "text-purple-500"
      }
    ]
  },
  {
    day: 2,
    title: "Day 2 - Cultural Heritage & Old Goa",
    activities: [
      {
        time: "9:00 AM",
        title: "Basilica of Bom Jesus",
        description: "Explore UNESCO World Heritage Site",
        type: "sightseeing",
        borderColor: "border-primary",
        iconColor: "text-primary"
      },
      {
        time: "11:00 AM",
        title: "Se Cathedral",
        description: "Marvel at Portuguese architecture",
        type: "sightseeing",
        borderColor: "border-secondary",
        iconColor: "text-secondary"
      },
      {
        time: "1:00 PM",
        title: "Traditional Goan Lunch",
        description: "Experience local flavors in Panaji",
        type: "food",
        borderColor: "border-accent",
        iconColor: "text-accent"
      },
      {
        time: "8:00 PM",
        title: "Sunset Cruise",
        description: "Romantic evening on Mandovi River",
        type: "activity",
        borderColor: "border-pink-500",
        iconColor: "text-pink-500"
      }
    ]
  },
  {
    day: 3,
    title: "Day 3 - South Goa & Departure",
    activities: [
      {
        time: "8:00 AM",
        title: "Palolem Beach",
        description: "Peaceful morning at crescent beach",
        type: "activity",
        borderColor: "border-primary",
        iconColor: "text-primary"
      },
      {
        time: "12:00 PM",
        title: "Cabo de Rama Fort",
        description: "Historic fort with stunning coastal views",
        type: "sightseeing",
        borderColor: "border-secondary",
        iconColor: "text-secondary"
      },
      {
        time: "2:00 PM",
        title: "Farewell Lunch",
        description: "Last taste of Goan cuisine",
        type: "food",
        borderColor: "border-accent",
        iconColor: "text-accent"
      },
      {
        time: "6:00 PM",
        title: "Departure",
        description: "Flight back to Kollam",
        type: "transport",
        borderColor: "border-red-500",
        iconColor: "text-red-500"
      }
    ]
  }
];
