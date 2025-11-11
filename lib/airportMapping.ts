/**
 * Airport IATA Code Mapping Utility
 * Maps city names to their corresponding airport IATA codes
 */

interface AirportMapping {
  [key: string]: string;
}

// Comprehensive city to IATA code mapping
const cityToIataMap: AirportMapping = {
  // India - Major Cities
  "kochi": "COK",
  "cochin": "COK",
  "trivandrum": "TRV",
  "thiruvananthapuram": "TRV",
  "kozhikode": "CCJ",
  "calicut": "CCJ",
  "thrissur": "TCR",
  "kannur": "CNN",
  "munnar": "COK", // Nearest: Kochi
  "kottayam": "COK", // Nearest: Kochi
  "kollam": "TRV", // Nearest: Trivandrum
  "alappuzha": "COK", // Nearest: Kochi
  "alleppey": "COK",
  "palakkad": "CJB", // Nearest: Coimbatore
  
  "delhi": "DEL",
  "new delhi": "DEL",
  "mumbai": "BOM",
  "bombay": "BOM",
  "bangalore": "BLR",
  "bengaluru": "BLR",
  "chennai": "MAA",
  "madras": "MAA",
  "hyderabad": "HYD",
  "kolkata": "CCU",
  "calcutta": "CCU",
  "pune": "PNQ",
  "ahmedabad": "AMD",
  "jaipur": "JAI",
  "lucknow": "LKO",
  "chandigarh": "IXC",
  "goa": "GOI",
  "panaji": "GOI",
  "guwahati": "GAU",
  "bhubaneswar": "BBI",
  "indore": "IDR",
  "nagpur": "NAG",
  "vadodara": "BDQ",
  "baroda": "BDQ",
  "coimbatore": "CJB",
  "vijayawada": "VGA",
  "visakhapatnam": "VTZ",
  "vizag": "VTZ",
  "surat": "STV",
  "patna": "PAT",
  "ranchi": "IXR",
  "mangalore": "IXE",
  "amritsar": "ATQ",
  "madurai": "IXM",
  "tiruchirappalli": "TRZ",
  "trichy": "TRZ",
  "varanasi": "VNS",
  "benaras": "VNS",
  "raipur": "RPR",
  "aurangabad": "IXU",
  "jammu": "IXJ",
  "srinagar": "SXR",
  "agra": "AGR",
  "jodhpur": "JDH",
  "udaipur": "UDR",
  
  // International - Popular Destinations
  "dubai": "DXB",
  "abu dhabi": "AUH",
  "doha": "DOH",
  "singapore": "SIN",
  "bangkok": "BKK",
  "kuala lumpur": "KUL",
  "colombo": "CMB",
  "kathmandu": "KTM",
  "dhaka": "DAC",
  "male": "MLE",
  "maldives": "MLE",
  "phuket": "HKT",
  "bali": "DPS",
  "denpasar": "DPS",
  
  // USA
  "new york": "JFK",
  "los angeles": "LAX",
  "chicago": "ORD",
  "san francisco": "SFO",
  "washington": "IAD",
  "boston": "BOS",
  "seattle": "SEA",
  "miami": "MIA",
  "atlanta": "ATL",
  "dallas": "DFW",
  
  // Europe
  "london": "LHR",
  "paris": "CDG",
  "frankfurt": "FRA",
  "amsterdam": "AMS",
  "rome": "FCO",
  "madrid": "MAD",
  "barcelona": "BCN",
  "zurich": "ZRH",
  "switzerland": "ZRH",
  "geneva": "GVA",
  "vienna": "VIE",
  "brussels": "BRU",
  "munich": "MUC",
  "istanbul": "IST",
  "athens": "ATH",
  "dublin": "DUB",
  "copenhagen": "CPH",
  "stockholm": "ARN",
  "oslo": "OSL",
  "helsinki": "HEL",
  
  // Middle East
  "riyadh": "RUH",
  "jeddah": "JED",
  "muscat": "MCT",
  "kuwait": "KWI",
  "bahrain": "BAH",
  "beirut": "BEY",
  "cairo": "CAI",
  "tel aviv": "TLV",
  
  // Asia Pacific
  "tokyo": "NRT",
  "osaka": "KIX",
  "seoul": "ICN",
  "beijing": "PEK",
  "shanghai": "PVG",
  "hong kong": "HKG",
  "taipei": "TPE",
  "manila": "MNL",
  "jakarta": "CGK",
  "hanoi": "HAN",
  "ho chi minh": "SGN",
  "saigon": "SGN",
  
  // Australia & New Zealand
  "sydney": "SYD",
  "melbourne": "MEL",
  "brisbane": "BNE",
  "perth": "PER",
  "auckland": "AKL",
  
  // Africa
  "johannesburg": "JNB",
  "cape town": "CPT",
  "nairobi": "NBO",
  "addis ababa": "ADD",
  "lagos": "LOS",
  "casablanca": "CMN",
};

/**
 * Get IATA code from city name
 * Supports fuzzy matching (case-insensitive)
 */
export function getIataCode(cityName: string): string | null {
  if (!cityName) return null;
  
  const normalized = cityName.toLowerCase().trim();
  
  // Direct match
  if (cityToIataMap[normalized]) {
    return cityToIataMap[normalized];
  }
  
  // Try to find partial match
  for (const [city, iata] of Object.entries(cityToIataMap)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      return iata;
    }
  }
  
  return null;
}

/**
 * Get city name from IATA code
 */
export function getCityFromIata(iataCode: string): string | null {
  if (!iataCode) return null;
  
  const normalized = iataCode.toUpperCase().trim();
  
  for (const [city, iata] of Object.entries(cityToIataMap)) {
    if (iata === normalized) {
      // Return capitalized city name
      return city.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return null;
}

/**
 * Check if a string is already an IATA code (3 letters)
 */
export function isIataCode(input: string): boolean {
  return /^[A-Z]{3}$/i.test(input.trim());
}

/**
 * Convert city name or IATA code to IATA code
 * If already IATA code, return as-is
 * If city name, convert to IATA code
 */
export function toIataCode(input: string): string {
  if (!input) return "";
  
  const trimmed = input.trim();
  
  // If already IATA code, return uppercase
  if (isIataCode(trimmed)) {
    return trimmed.toUpperCase();
  }
  
  // Try to convert city name to IATA
  const iata = getIataCode(trimmed);
  return iata || trimmed.toUpperCase();
}

/**
 * Get all supported cities
 */
export function getSupportedCities(): string[] {
  return Object.keys(cityToIataMap).map(city => 
    city.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
}

/**
 * Get all supported IATA codes
 */
export function getSupportedIataCodes(): string[] {
  return Array.from(new Set(Object.values(cityToIataMap)));
}

/**
 * Validate if we support flights for a given city/IATA
 */
export function isSupported(input: string): boolean {
  if (!input) return false;
  
  const trimmed = input.trim();
  
  // Check if IATA code
  if (isIataCode(trimmed)) {
    return getSupportedIataCodes().includes(trimmed.toUpperCase());
  }
  
  // Check if city name
  return getIataCode(trimmed) !== null;
}
