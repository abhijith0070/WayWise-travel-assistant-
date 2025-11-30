/**
 * Indian Railways Station Code Mapping Utility
 * Maps city names to their corresponding IRCTC station codes
 */

interface StationMapping {
  [key: string]: string;
}

// Comprehensive city to IRCTC station code mapping
const cityToStationMap: StationMapping = {
  // Major Cities - Multiple stations (using primary/most common)
  "delhi": "NDLS",
  "new delhi": "NDLS",
  "delhi junction": "DLI",
  "hazrat nizamuddin": "NZM",
  "old delhi": "DLI",
  "anand vihar": "ANVT",
  
  "mumbai": "CSTM",
  "mumbai central": "BCT",
  "mumbai cst": "CSTM",
  "bombay": "CSTM",
  "lokmanya tilak": "LTT",
  "bandra terminus": "BDTS",
  "dadar": "DR",
  
  "bangalore": "SBC",
  "bengaluru": "SBC",
  "bangalore city": "SBC",
  "yesvantpur": "YPR",
  "ksr bangalore": "SBC",
  
  "chennai": "MAS",
  "madras": "MAS",
  "chennai central": "MAS",
  "chennai egmore": "MS",
  
  "kolkata": "HWH",
  "calcutta": "HWH",
  "howrah": "HWH",
  "sealdah": "SDAH",
  "kolkata station": "KOAA",
  
  "hyderabad": "HYB",
  "secunderabad": "SC",
  "kacheguda": "KCG",
  
  // Kerala Cities
  "kochi": "ERS",
  "cochin": "ERS",
  "ernakulam": "ERS",
  "ernakulam junction": "ERS",
  "ernakulam town": "ERN",
  
  "trivandrum": "TVC",
  "thiruvananthapuram": "TVC",
  "trivandrum central": "TVC",
  
  "kozhikode": "CLT",
  "calicut": "CLT",
  
  "thrissur": "TCR",
  "trichur": "TCR",
  
  "kollam": "QLN",
  "quilon": "QLN",
  
  "alappuzha": "ALLP",
  "alleppey": "ALLP",
  
  "kannur": "CAN",
  "cannanore": "CAN",
  
  "palakkad": "PGT",
  "palghat": "PGT",
  
  "kottayam": "KTYM",
  
  "kasargod": "KGQ",
  
  // Other Major Cities
  "pune": "PUNE",
  "ahmedabad": "ADI",
  "jaipur": "JP",
  "lucknow": "LKO",
  "kanpur": "CNB",
  "nagpur": "NGP",
  "indore": "INDB",
  "bhopal": "BPL",
  "vadodara": "BRC",
  "baroda": "BRC",
  "surat": "ST",
  "rajkot": "RJT",
  "agra": "AGC",
  "varanasi": "BSB",
  "patna": "PNBE",
  "guwahati": "GHY",
  "bhubaneswar": "BBS",
  "vijayawada": "BZA",
  "visakhapatnam": "VSKP",
  "vizag": "VSKP",
  "coimbatore": "CBE",
  "madurai": "MDU",
  "tiruchirappalli": "TPJ",
  "trichy": "TPJ",
  "salem": "SA",
  "tirupati": "TPTY",
  "mangalore": "MAQ",
  "mysore": "MYS",
  "chandigarh": "CDG",
  "amritsar": "ASR",
  "jammu": "JAT",
  "dehradun": "DDN",
  "haridwar": "HW",
  "rishikesh": "RKSH",
  "udaipur": "UDZ",
  "jodhpur": "JU",
  "ajmer": "AII",
  "kota": "KOTA",
  "gwalior": "GWL",
  "jabalpur": "JBP",
  "raipur": "R",
  "bilaspur": "BSP",
  "ranchi": "RNC",
  "dhanbad": "DHN",
  "asansol": "ASN",
  "durgapur": "DGR",
  "siliguri": "SGUJ",
  "gaya": "GAYA",
  "muzaffarpur": "MFP",
  "darbhanga": "DBG",
  "allahabad": "ALD",
  "prayagraj": "PRYJ",
  "gorakhpur": "GKP",
  "bareilly": "BE",
  "moradabad": "MB",
  "meerut": "MTC",
  "ghaziabad": "GZB",
  "faridabad": "FDB",
  "rohtak": "ROK",
  "panipat": "PNP",
  "ambala": "UMB",
  "ludhiana": "LDH",
  "jalandhar": "JUC",
  "pathankot": "PTK",
  "shimla": "SML",
  "srinagar": "SINA",
  "shillong": "SLNG",
  "imphal": "IMPH",
  "dibrugarh": "DBRG",
  "tinsukia": "NTSK",
  "jorhat": "JHAT",
  "silchar": "SCL",
  "agartala": "AGTL",
  "itanagar": "ITNS",
  "kohima": "KHM",
  "aizawl": "AZL",
  
  // Tourist Destinations
  "goa": "MAO",
  "margao": "MAO",
  "vasco da gama": "VSG",
  "panjim": "PNJM",
  "pondicherry": "PDY",
  "puducherry": "PDY",
  "ooty": "UAM",
  "udhagamandalam": "UAM",
  "kodaikanal": "KDI",
  "munnar": "MNR",
  "wayanad": "WYD",
  "thekkady": "TKD",
  "hampi": "HPT",
  "darjeeling": "DJ",
  "gangtok": "GTO",
  "manali": "MNLI",
  "kullu": "KULU",
  "dharamshala": "DRM",
  "mcleodganj": "MCLG",
  "nainital": "KGM",
  "mussoorie": "MUSR",
  "mount abu": "ABR",
  "mahabaleshwar": "MBL",
  "lonavala": "LNL",
  "khajuraho": "KURJ",
  "ajanta": "AWB",
  "ellora": "AWB",
  "konark": "KONR",
  "puri": "PURI",
  "shirdi": "SAI",
  "rameswaram": "RMM",
  "kanyakumari": "CAPE",
  "kodaikanal road": "KDI",
  "yercaud": "YCRD",
};

/**
 * Get IRCTC station code from city name
 * Supports fuzzy matching (case-insensitive)
 */
export function getStationCode(cityName: string): string | null {
  if (!cityName) return null;
  
  const normalized = cityName.toLowerCase().trim();
  
  // Direct match
  if (cityToStationMap[normalized]) {
    return cityToStationMap[normalized];
  }
  
  // Try to find partial match
  for (const [city, code] of Object.entries(cityToStationMap)) {
    if (city.includes(normalized) || normalized.includes(city)) {
      return code;
    }
  }
  
  return null;
}

/**
 * Get city name from station code
 */
export function getCityFromStation(stationCode: string): string | null {
  if (!stationCode) return null;
  
  const normalized = stationCode.toUpperCase().trim();
  
  for (const [city, code] of Object.entries(cityToStationMap)) {
    if (code === normalized) {
      // Return capitalized city name
      return city.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return null;
}

/**
 * Check if a string is already a station code (2-5 letters)
 */
export function isStationCode(input: string): boolean {
  return /^[A-Z]{2,5}$/i.test(input.trim());
}

/**
 * Convert city name or station code to station code
 * If already station code, return as-is
 * If city name, convert to station code
 */
export function toStationCode(input: string): string {
  if (!input) return "";
  
  const trimmed = input.trim();
  
  // If already station code, return uppercase
  if (isStationCode(trimmed)) {
    return trimmed.toUpperCase();
  }
  
  // Try to convert city name to station code
  const code = getStationCode(trimmed);
  return code || trimmed.toUpperCase();
}

/**
 * Get all supported cities
 */
export function getSupportedCities(): string[] {
  return Object.keys(cityToStationMap).map(city => 
    city.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
}

/**
 * Get all supported station codes
 */
export function getSupportedStationCodes(): string[] {
  return Array.from(new Set(Object.values(cityToStationMap)));
}

/**
 * Validate if we support trains for a given city/station
 */
export function isStationSupported(input: string): boolean {
  if (!input) return false;
  
  const trimmed = input.trim();
  
  // Check if station code
  if (isStationCode(trimmed)) {
    return getSupportedStationCodes().includes(trimmed.toUpperCase());
  }
  
  // Check if city name
  return getStationCode(trimmed) !== null;
}

/**
 * Train class codes
 */
export const trainClasses = {
  "1A": "First AC",
  "2A": "Second AC",
  "3A": "Third AC",
  "SL": "Sleeper",
  "CC": "Chair Car",
  "2S": "Second Seating",
  "3E": "Third AC Economy",
} as const;

export type TrainClass = keyof typeof trainClasses;

/**
 * Quota codes
 */
export const quotaCodes = {
  "GN": "General",
  "TQ": "Tatkal",
  "PT": "Premium Tatkal",
  "LD": "Ladies",
  "HP": "Handicapped",
  "DF": "Defence",
} as const;

export type QuotaCode = keyof typeof quotaCodes;
