# Route Planner API Documentation

## Overview
The Route Planner API provides optimized route planning between cities using OpenRouteService. It supports multiple travel modes (car, bike, walk) and returns distance, duration, and route coordinates.

## API Endpoint

**URL:** `/api/route-planner`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Request Format

```json
{
  "from": "Mumbai",
  "to": "Pune",
  "mode": "car"
}
```

### Parameters

| Parameter | Type   | Required | Description                                           |
|-----------|--------|----------|-------------------------------------------------------|
| `from`    | string | Yes      | Departure city name (e.g., "Mumbai", "Kollam")       |
| `to`      | string | Yes      | Destination city name (e.g., "Pune", "Goa")          |
| `mode`    | string | Yes      | Travel mode: `car`, `bike`, `walk` (or `driving`, `cycling`, `walking`) |

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "from": {
      "city": "Mumbai",
      "label": "Mumbai, Maharashtra, India",
      "lat": 19.0760,
      "lng": 72.8777
    },
    "to": {
      "city": "Pune",
      "label": "Pune, Maharashtra, India",
      "lat": 18.5204,
      "lng": 73.8567
    },
    "mode": "car",
    "profile": "driving-car",
    "distance_km": 148.5,
    "duration_hr": 2.3,
    "coordinates": [
      [19.0760, 72.8777],
      [19.0755, 72.8780],
      ...
      [18.5204, 73.8567]
    ]
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "success": false,
  "error": "Error type",
  "details": "Detailed error message"
}
```

## Common Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Invalid input | Missing or invalid request parameters |
| 404 | Location not found | City name could not be geocoded |
| 500 | API key not configured | ORS_API_KEY environment variable not set |
| 502 | External API error | OpenRouteService API returned an error |

## Setup Instructions

### 1. Get OpenRouteService API Key

1. Visit [OpenRouteService](https://openrouteservice.org/dev/#/signup)
2. Sign up for a free account
3. Generate an API key

### 2. Configure Environment Variable

Add to `.env.local`:

```bash
ORS_API_KEY=your_openrouteservice_api_key_here
```

### 3. Restart Development Server

```bash
npm run dev
```

## Testing

### Test Page
Visit `/test-route-planner` to test the API with a user-friendly interface.

### cURL Example

```bash
curl -X POST http://localhost:3000/api/route-planner \
  -H "Content-Type: application/json" \
  -d '{
    "from": "Mumbai",
    "to": "Pune",
    "mode": "car"
  }'
```

### PowerShell Example

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/route-planner" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"from": "Mumbai", "to": "Pune", "mode": "car"}'
```

## Travel Modes

| Mode Value | ORS Profile | Description |
|------------|-------------|-------------|
| `car` or `driving` | `driving-car` | Optimized for cars |
| `bike` or `cycling` | `cycling-regular` | Optimized for bicycles |
| `walk` or `walking` | `foot-walking` | Optimized for pedestrians |

## Response Data Details

### Distance
- **Unit:** Kilometers (km)
- **Precision:** 2 decimal places
- **Example:** `148.5` (148.5 km)

### Duration
- **Unit:** Hours (hr)
- **Precision:** 2 decimal places
- **Example:** `2.3` (2 hours 18 minutes)

### Coordinates
- **Format:** Array of `[latitude, longitude]` pairs
- **Order:** From origin to destination
- **Usage:** Can be plotted on maps (Leaflet, Google Maps, etc.)
- **Example:** `[[19.0760, 72.8777], [19.0755, 72.8780], ...]`

## Implementation Details

### Technology Stack
- **Framework:** Next.js 15 App Router
- **API Service:** OpenRouteService
- **Endpoints Used:**
  - Geocoding API: `https://api.openrouteservice.org/geocode/search`
  - Directions API: `https://api.openrouteservice.org/v2/directions/{profile}`

### Rate Limits
OpenRouteService free tier limits:
- **Requests per day:** 2,000
- **Requests per minute:** 40

### Error Handling
- Validates all input parameters
- Graceful error messages for location not found
- Handles API timeouts and network errors
- Returns user-friendly error messages

## Integration Examples

### React/Next.js Component

```typescript
async function planRoute(from: string, to: string, mode: string) {
  const response = await fetch('/api/route-planner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, mode }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log(`Distance: ${data.data.distance_km} km`);
    console.log(`Duration: ${data.data.duration_hr} hours`);
    console.log(`Route has ${data.data.coordinates.length} points`);
  } else {
    console.error(data.error, data.details);
  }
}
```

### Map Integration (Leaflet)

```typescript
import L from 'leaflet';

function displayRoute(coordinates: [number, number][]) {
  const map = L.map('map');
  
  // Draw route polyline
  L.polyline(coordinates, { 
    color: 'blue',
    weight: 4 
  }).addTo(map);
  
  // Fit map to route bounds
  map.fitBounds(L.polyline(coordinates).getBounds());
}
```

## Support

For issues or questions:
- Check the test page at `/test-route-planner`
- Review OpenRouteService [documentation](https://openrouteservice.org/dev/#/api-docs)
- Verify your API key is valid and has remaining quota

## Future Enhancements

Potential improvements:
- Support for waypoints (multi-stop routes)
- Alternative route options
- Traffic-aware routing
- Real-time ETA updates
- Route elevation profiles
- Turn-by-turn directions
