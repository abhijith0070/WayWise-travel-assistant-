export const cities = [
  "Kochi", "Ernakulam", "Trivandrum", "Kozhikode", "Thrissur", "Alappuzha", "Kollam",
  "Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Goa", "Manali", "Pune",
  "Dubai", "Singapore", "London", "New York", "Zurich",
];

export interface RouteData {
  id: number;
  from: string;
  to: string;
  mode: string;
  price: number;
  duration: string;
  amenities: string[];
  image: string;
}

export const routesData: RouteData[] = [
  // Kerala Routes
  { id: 1, from: "Kochi", to: "Trivandrum", mode: "Bus", price: 450, duration: "4h 30m", amenities: ["AC", "Pushback Seats"], image: "/images/bus1.jpg" },
  { id: 2, from: "Kochi", to: "Trivandrum", mode: "Train", price: 320, duration: "4h 15m", amenities: ["Sleeper", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 3, from: "Kochi", to: "Kozhikode", mode: "Bus", price: 380, duration: "3h 45m", amenities: ["AC", "WiFi"], image: "/images/bus1.jpg" },
  { id: 4, from: "Kochi", to: "Thrissur", mode: "Bus", price: 180, duration: "1h 30m", amenities: ["AC"], image: "/images/bus1.jpg" },
  { id: 5, from: "Kochi", to: "Alappuzha", mode: "Bus", price: 120, duration: "1h 15m", amenities: ["AC"], image: "/images/bus1.jpg" },
  { id: 6, from: "Trivandrum", to: "Kochi", mode: "Bus", price: 450, duration: "4h 30m", amenities: ["AC", "Pushback Seats"], image: "/images/bus1.jpg" },
  { id: 7, from: "Trivandrum", to: "Kollam", mode: "Bus", price: 150, duration: "1h 45m", amenities: ["AC"], image: "/images/bus1.jpg" },
  
  // Kochi to Major Cities
  { id: 8, from: "Kochi", to: "Bangalore", mode: "Train", price: 620, duration: "12h", amenities: ["Sleeper", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 9, from: "Kochi", to: "Bangalore", mode: "Bus", price: 850, duration: "11h 30m", amenities: ["AC Sleeper", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 10, from: "Kochi", to: "Bangalore", mode: "Flight", price: 3200, duration: "1h", amenities: ["Free Cabin Bag"], image: "/images/flight1.jpg" },
  { id: 11, from: "Kochi", to: "Chennai", mode: "Train", price: 750, duration: "10h 30m", amenities: ["AC Coach", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 12, from: "Kochi", to: "Chennai", mode: "Flight", price: 3500, duration: "1h 10m", amenities: ["Meal Included"], image: "/images/flight1.jpg" },
  { id: 13, from: "Kochi", to: "Mumbai", mode: "Flight", price: 4800, duration: "2h", amenities: ["Meal Included", "WiFi"], image: "/images/flight2.jpg" },
  { id: 14, from: "Kochi", to: "Delhi", mode: "Flight", price: 5500, duration: "3h 15m", amenities: ["Meal Included", "WiFi"], image: "/images/flight2.jpg" },
  { id: 15, from: "Kochi", to: "Hyderabad", mode: "Flight", price: 3800, duration: "1h 30m", amenities: ["Free Cabin Bag"], image: "/images/flight1.jpg" },
  { id: 16, from: "Kochi", to: "Goa", mode: "Bus", price: 1200, duration: "14h", amenities: ["AC Sleeper", "WiFi", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 17, from: "Kochi", to: "Goa", mode: "Train", price: 980, duration: "15h 30m", amenities: ["Sleeper", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 18, from: "Kochi", to: "Goa", mode: "Flight", price: 4200, duration: "1h 20m", amenities: ["Meal Included"], image: "/images/flight1.jpg" },
  
  // Mumbai Routes
  { id: 19, from: "Mumbai", to: "Goa", mode: "Bus", price: 950, duration: "13h", amenities: ["AC Sleeper", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 20, from: "Mumbai", to: "Goa", mode: "Train", price: 720, duration: "12h", amenities: ["Sleeper", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 21, from: "Mumbai", to: "Delhi", mode: "Flight", price: 4800, duration: "2h 15m", amenities: ["Meal Included", "WiFi"], image: "/images/flight2.jpg" },
  { id: 22, from: "Mumbai", to: "Delhi", mode: "Train", price: 1450, duration: "16h", amenities: ["AC Coach", "Pantry Car"], image: "/images/train1.jpg" },
  { id: 23, from: "Mumbai", to: "Bangalore", mode: "Flight", price: 3600, duration: "1h 30m", amenities: ["Free Cabin Bag"], image: "/images/flight1.jpg" },
  { id: 24, from: "Mumbai", to: "Chennai", mode: "Flight", price: 3900, duration: "1h 45m", amenities: ["Meal Included"], image: "/images/flight1.jpg" },
  
  // Delhi Routes
  { id: 25, from: "Delhi", to: "Mumbai", mode: "Flight", price: 4800, duration: "2h 15m", amenities: ["Meal Included", "WiFi"], image: "/images/flight2.jpg" },
  { id: 26, from: "Delhi", to: "Bangalore", mode: "Flight", price: 4500, duration: "2h 45m", amenities: ["Meal Included"], image: "/images/flight2.jpg" },
  { id: 27, from: "Delhi", to: "Goa", mode: "Flight", price: 4200, duration: "2h 30m", amenities: ["Meal Included"], image: "/images/flight2.jpg" },
  { id: 28, from: "Delhi", to: "Chennai", mode: "Flight", price: 5200, duration: "2h 50m", amenities: ["Meal Included", "WiFi"], image: "/images/flight2.jpg" },
  { id: 29, from: "Delhi", to: "Hyderabad", mode: "Flight", price: 4300, duration: "2h 20m", amenities: ["Free Cabin Bag"], image: "/images/flight1.jpg" },
  { id: 30, from: "Delhi", to: "Manali", mode: "Bus", price: 1200, duration: "14h", amenities: ["AC Sleeper", "WiFi"], image: "/images/bus2.jpg" },
  
  // Bangalore Routes
  { id: 31, from: "Bangalore", to: "Kochi", mode: "Bus", price: 850, duration: "11h 30m", amenities: ["AC Sleeper", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 32, from: "Bangalore", to: "Chennai", mode: "Bus", price: 650, duration: "7h", amenities: ["AC Sleeper"], image: "/images/bus2.jpg" },
  { id: 33, from: "Bangalore", to: "Hyderabad", mode: "Bus", price: 850, duration: "10h", amenities: ["AC Sleeper", "WiFi"], image: "/images/bus2.jpg" },
  { id: 34, from: "Bangalore", to: "Goa", mode: "Bus", price: 950, duration: "12h", amenities: ["AC Sleeper", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 35, from: "Bangalore", to: "Mumbai", mode: "Flight", price: 3600, duration: "1h 30m", amenities: ["Free Cabin Bag"], image: "/images/flight1.jpg" },
  
  // Goa Routes
  { id: 36, from: "Goa", to: "Mumbai", mode: "Bus", price: 950, duration: "13h", amenities: ["AC Sleeper", "Charging Port"], image: "/images/bus2.jpg" },
  { id: 37, from: "Goa", to: "Bangalore", mode: "Bus", price: 950, duration: "12h", amenities: ["AC Sleeper", "WiFi"], image: "/images/bus2.jpg" },
  { id: 38, from: "Goa", to: "Kochi", mode: "Train", price: 980, duration: "15h 30m", amenities: ["Sleeper", "Pantry Car"], image: "/images/train1.jpg" },
  
  // International Routes
  { id: 39, from: "Mumbai", to: "Dubai", mode: "Flight", price: 15000, duration: "3h", amenities: ["International Meal", "WiFi", "Entertainment"], image: "/images/flight3.jpg" },
  { id: 40, from: "Delhi", to: "Dubai", mode: "Flight", price: 14500, duration: "3h 30m", amenities: ["International Meal", "WiFi"], image: "/images/flight3.jpg" },
  { id: 41, from: "Mumbai", to: "Singapore", mode: "Flight", price: 22000, duration: "5h 30m", amenities: ["International Meal", "WiFi", "Entertainment"], image: "/images/flight3.jpg" },
  { id: 42, from: "Delhi", to: "London", mode: "Flight", price: 45000, duration: "9h", amenities: ["International Meal", "WiFi", "Entertainment"], image: "/images/flight3.jpg" },
  { id: 43, from: "Bangalore", to: "Singapore", mode: "Flight", price: 18000, duration: "4h 30m", amenities: ["International Meal", "WiFi"], image: "/images/flight3.jpg" },
  { id: 44, from: "Zurich", to: "New York", mode: "Flight", price: 45999, duration: "8h 20m", amenities: ["International Meal", "WiFi", "Entertainment"], image: "/images/flight3.jpg" },
];
