/**
 * Geocode a place name to latitude and longitude using Nominatim API
 * @param place - The name of the place to geocode
 * @returns An array [lat, lon] or null if not found
 */
export async function geocode(place: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
      {
        headers: {
          'User-Agent': 'WayWise-Travel-App' // Required by Nominatim usage policy
        }
      }
    );
    const data = await res.json();
    
    if (!data || data.length === 0) {
      console.warn(`No geocoding results found for: ${place}`);
      return null;
    }
    
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch (error) {
    console.error(`Geocoding error for ${place}:`, error);
    return null;
  }
}

/**
 * Calculate the center point between two coordinates
 */
export function calculateCenter(
  pos1: [number, number],
  pos2: [number, number]
): [number, number] {
  return [
    (pos1[0] + pos2[0]) / 2,
    (pos1[1] + pos2[1]) / 2
  ];
}
