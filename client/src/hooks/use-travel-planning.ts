import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TripPlan {
  fromLocation: string;
  toLocation: string;
  travelDate: Date;
  returnDate?: Date;
}

export function useTravelPlanning() {
  const [isPlanning, setIsPlanning] = useState(false);
  const { toast } = useToast();

  const planTrip = async (tripData: TripPlan) => {
    setIsPlanning(true);
    
    try {
      // Simulate API call for trip planning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Trip Planned Successfully!",
        description: `Your journey from ${tripData.fromLocation} to ${tripData.toLocation} has been optimized by AI.`,
      });

      // Scroll to trip summary section
      const summarySection = document.querySelector('[data-section="trip-summary"]');
      if (summarySection) {
        summarySection.scrollIntoView({ behavior: 'smooth' });
      }
      
    } catch (error) {
      toast({
        title: "Planning Failed",
        description: "Unable to plan your trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlanning(false);
    }
  };

  return {
    planTrip,
    isPlanning
  };
}
