/**
 * Fuzzy match city names with case-insensitive partial matching
 * @param input - User input city name
 * @param cities - List of valid city names
 * @returns Matched city name or null
 */
export function matchCity(input: string, cities: string[]): string | null {
  if (!input || !input.trim()) {
    return null;
  }
  
  const normalizedInput = input.toLowerCase().trim();
  
  // First try exact match (case-insensitive)
  const exactMatch = cities.find(city => city.toLowerCase() === normalizedInput);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Then try partial match (contains)
  const partialMatch = cities.find(city => city.toLowerCase().includes(normalizedInput));
  if (partialMatch) {
    return partialMatch;
  }
  
  // Try reverse - check if any city name is contained in the input
  const reverseMatch = cities.find(city => normalizedInput.includes(city.toLowerCase()));
  if (reverseMatch) {
    return reverseMatch;
  }
  
  return null;
}
