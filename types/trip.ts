export interface TripPlan {
  destination: string;
  from: string;
  title: string;
  description: string;
  duration: string;
  budget: string;
  estimatedBudget: string;
  bestFor: string;
  season: string;
  bestTimeToVisit: string;
  overview: string;
  itinerary: DayPlan[];
  transportation: Transportation;
  budgetBreakdown: BudgetBreakdown;
  packingList: string[];
  localTips: string[];
  tips: string[];
  mustTryFoods: string[];
  mustVisitPlaces: string[];
  source?: string; // AI service that generated this plan
}

export interface DayPlan {
  day: number;
  title: string;
  description?: string;
  activities: Activity[];
  meals: Meals;
  accommodation: string;
}

// Keep backward compatibility
export interface DayItinerary extends DayPlan {}

export interface Activity {
  time: string;
  activity: string;
  description?: string;
  location?: string;
  cost: string;
  estimatedCost?: string;
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
