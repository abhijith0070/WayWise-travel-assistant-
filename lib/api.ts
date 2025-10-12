import { TripPlan } from '@/types/trip';

export async function planTrip(prompt: string): Promise<TripPlan> {
  const response = await fetch('/api/plan-trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate trip plan');
  }

  const data = await response.json();
  return data.data;
}

export async function planTripWithGemini(prompt: string): Promise<TripPlan> {
  const response = await fetch('/api/plan-trip-gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate trip plan');
  }

  const data = await response.json();
  return data.data;
}
