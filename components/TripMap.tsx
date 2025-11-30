"use client"

import { useEffect, useState } from 'react';
import { geocode, calculateCenter } from '@/lib/geocode';
import { Loader2, MapPin } from 'lucide-react';

interface TripMapProps {
  from: string;
  destination: string;
  showRoute?: boolean;
}

export default function TripMap({ from, destination, showRoute = true }: TripMapProps) {
  const [fromPos, setFromPos] = useState<[number, number] | null>(null);
  const [toPos, setToPos] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Only load map on client side
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    async function fetchCoordinates() {
      setLoading(true);
      setError(null);

      try {
        const [fromCoords, toCoords] = await Promise.all([
          geocode(from),
          geocode(destination)
        ]);

        if (!fromCoords) {
          setError(`Could not find location: ${from}`);
          setLoading(false);
          return;
        }

        if (!toCoords) {
          setError(`Could not find location: ${destination}`);
          setLoading(false);
          return;
        }

        setFromPos(fromCoords);
        setToPos(toCoords);
        setCenter(calculateCenter(fromCoords, toCoords));
      } catch (err) {
        console.error('Error fetching coordinates:', err);
        setError('Failed to load map locations');
      } finally {
        setLoading(false);
      }
    }

    if (from && destination && mapLoaded) {
      fetchCoordinates();
    }
  }, [from, destination, mapLoaded]);

  // Render map only on client side after loading coordinates
  useEffect(() => {
    if (!mapLoaded || !fromPos || !toPos || loading) return;

    let map: any = null;
    let routingControl: any = null;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet and React-Leaflet
        const L = (await import('leaflet')).default;
        
        // Fix for default marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const mapContainer = document.getElementById('route-map');
        if (!mapContainer) return;

        // Create map instance
        map = L.map(mapContainer).setView(center, 6);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers
        L.marker(fromPos).addTo(map)
          .bindPopup(`<div class="text-center"><p class="font-semibold text-green-700">📍 Start</p><p class="text-sm">${from}</p></div>`);

        L.marker(toPos).addTo(map)
          .bindPopup(`<div class="text-center"><p class="font-semibold text-red-700">🎯 Destination</p><p class="text-sm">${destination}</p></div>`);

        // Add route
        if (showRoute) {
          try {
            // @ts-ignore - leaflet-routing-machine doesn't have types
            await import('leaflet-routing-machine');

            routingControl = (L as any).Routing.control({
              waypoints: [
                L.latLng(fromPos[0], fromPos[1]),
                L.latLng(toPos[0], toPos[1])
              ],
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoutes: true,
              showAlternatives: false,
              lineOptions: {
                styles: [{ color: '#4F46E5', weight: 4, opacity: 0.7 }]
              },
              createMarker: () => null,
            }).addTo(map);

            // Hide routing instructions panel
            const container = routingControl.getContainer();
            if (container) container.style.display = 'none';
          } catch (err) {
            console.error('Routing error:', err);
            // Fallback to straight line
            L.polyline([fromPos, toPos], {
              color: '#4F46E5',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10'
            }).addTo(map);
          }
        } else {
          // Straight line
          L.polyline([fromPos, toPos], {
            color: '#4F46E5',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(map);
        }

        // Fit bounds
        map.fitBounds([fromPos, toPos], { padding: [50, 50] });

      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to initialize map');
      }
    };

    initMap();

    return () => {
      if (routingControl && map) {
        try {
          map.removeControl(routingControl);
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
      if (map) {
        try {
          map.remove();
        } catch (e) {
          console.error('Map removal error:', e);
        }
      }
    };
  }, [mapLoaded, fromPos, toPos, loading, from, destination, showRoute, center]);

  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-lg font-semibold text-gray-700">Loading map...</p>
          <p className="text-sm text-gray-500 mt-1">Fetching coordinates for {from} and {destination}</p>
        </div>
      </div>
    );
  }

  if (error || !fromPos || !toPos) {
    return (
      <div className="rounded-xl overflow-hidden shadow-md mt-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
        <div className="flex flex-col items-center justify-center py-12">
          <MapPin className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg font-semibold text-gray-700">Could not load map</p>
          <p className="text-sm text-gray-500 mt-1">{error || 'Unable to geocode locations'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md mt-6 border border-indigo-100">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Route Visualization</h3>
        </div>
        <p className="text-indigo-100 text-sm mt-1">
          {from} → {destination}
        </p>
      </div>
      
      <div 
        id="route-map" 
        style={{ height: '450px', width: '100%' }}
        className="z-0"
      />
    </div>
  );
}
