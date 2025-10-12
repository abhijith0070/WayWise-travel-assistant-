export interface TripPlan {
  destination: string;
  from: string;
  duration: string;
  budget: string;
  bestTimeToVisit: string;
  overview: string;
  itinerary: DayItinerary[];
  transportation: Transportation;
  budgetBreakdown: BudgetBreakdown;
  packingList: string[];
  localTips: string[];
  mustTryFoods: string[];
  mustVisitPlaces: string[];
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
  meals: Meals;
  accommodation: string;
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  cost: string;
}

export interface Meals {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface Transportation {
  toDestination: string;
  local: string;
}

export interface BudgetBreakdown {
  transport: string;
  accommodation: string;
  food: string;
  activities: string;
  miscellaneous: string;
  total: string;
}

export interface ApiResponse {
  success: boolean;
  data?: TripPlan;
  error?: string;
  timestamp: string;
}
