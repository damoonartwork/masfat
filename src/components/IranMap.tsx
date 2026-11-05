import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { City } from '../types';

interface IranMapProps {
  origin: City | null;
  dest: City | null;
  allCities?: City[];
  routeCoordinates?: [number, number][];
  isEstimated?: boolean;
  onSelectOrigin?: (city: City) => void;
  onSelectDest?: (city: City) => void;
  waypoints?: City[];
  className?: string;
  zoomControl?: boolean;
  interactiveCities?: boolean;
}

export const IranMap: React.FC<IranMapProps> = ({
  origin,
  dest,
  allCities = [],
  routeCoordinates = [],
  isEstimated = false,
  onSelectOrigin,
  onSelectDest,
  waypoints = [],
  className = 'h-[440px] w-full',
  zoomControl = true,
  interactiveCities = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Iran bounds
  const iranBounds = L.latLngBounds(
    L.latLng(24.0, 44.0), // South-West
    L.latLng(40.0, 64.0)  // North-East
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [32.4279, 53.688], // Center of Iran
        zoom: 5.5,
        minZoom: 4.8,
        maxZoom: 14,
        maxBounds: iranBounds.pad(0.1),
        maxBoundsViscosity: 0.8,
        zoomControl: zoomControl,
        attributionControl: true,
      });

      // Primary Tile Layer: OpenStreetMap
      const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'iran-map-tiles',
      });

      // Tile error fallback to HOT tiles
      tileLayer.on('tileerror', (e) => {
        const target = e.tile as HTMLImageElement;
        if (target && !target.dataset.triedFallback) {
          target.dataset.triedFallback = 'true';
          const src = target.src;
          const match = src.match(/\/(\d+)\/(\d+)\/(\d+)\.png$/);
          if (match) {
            const [, z, x, y] = match;
            target.src = `https://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`;
          }
        }
      });

      tileLayer.addTo(map);

      // Create a layer group for markers and routes
      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update layers when origin, dest, waypoints, or route changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const boundsPoints: L.LatLngExpression[] = [];

    // Helper to create custom divIcon
    const createMarkerIcon = (
      bgColor: string,
      label: string,
      sublabel?: string,
      isNumber = false
    ) => {
      const html = isNumber
        ? `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${bgColor}; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 13px; font-family: Vazirmatn, sans-serif;">
              ${label}
            </div>
            ${sublabel ? `<span style="margin-top: 2px; padding: 1px 6px; background: rgba(19,34,56,0.85); color: #ffffff; border-radius: 4px; font-size: 11px; font-weight: bold; font-family: Vazirmatn, sans-serif; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${sublabel}</span>` : ''}
          </div>
        `
        : `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(0, -6px);">
            <div style="padding: 2px 8px; background: ${bgColor}; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: Vazirmatn, sans-serif; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 1.5px solid #ffffff;">
              ${label}
            </div>
            <div style="width: 14px; height: 14px; background: ${bgColor}; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3); margin-top: 2px;"></div>
          </div>
        `;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html,
        iconSize: [80, 50],
        iconAnchor: [40, 45],
      });
    };

    // 1. Draw route polyline if available
    if (routeCoordinates && routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#F26A51',
        weight: isEstimated ? 4 : 5,
        opacity: 0.95,
        dashArray: isEstimated ? '8, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });
      polyline.addTo(layerGroup);

      routeCoordinates.forEach((coord) => boundsPoints.push(coord));
    }

    // 2. Add Waypoints if any (multi-stop)
    waypoints.forEach((wp, index) => {
      const wpIcon = createMarkerIcon('#1FA3A3', (index + 1).toString(), wp.name, true);
      const marker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
      marker.bindPopup(`
        <div style="direction: rtl; text-align: right; font-family: Vazirmatn, sans-serif; padding: 4px 6px;">
          <strong style="font-size: 14px; color: #132238;">ایستگاه ${index + 1}: ${wp.name}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748B;">استان ${wp.province}</p>
        </div>
      `);
      marker.addTo(layerGroup);
      boundsPoints.push([wp.lat, wp.lng]);
    });

    // 3. Add Origin Marker (Green/Teal #10B981)
    if (origin) {
      const originIcon = createMarkerIcon('#10B981', `مبدأ: ${origin.name}`);
      const originMarker = L.marker([origin.lat, origin.lng], { icon: originIcon });
      originMarker.bindPopup(`
        <div style="direction: rtl; text-align: right; font-family: Vazirmatn, sans-serif; padding: 4px 6px;">
          <strong style="font-size: 14px; color: #10B981;">مبدأ: ${origin.name}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748B;">استان ${origin.province}</p>
        </div>
      `);
      originMarker.addTo(layerGroup);
      boundsPoints.push([origin.lat, origin.lng]);
    }

    // 4. Add Destination Marker (Coral #F26A51)
    if (dest) {
      const destIcon = createMarkerIcon('#F26A51', `مقصد: ${dest.name}`);
      const destMarker = L.marker([dest.lat, dest.lng], { icon: destIcon });
      destMarker.bindPopup(`
        <div style="direction: rtl; text-align: right; font-family: Vazirmatn, sans-serif; padding: 4px 6px;">
          <strong style="font-size: 14px; color: #F26A51;">مقصد: ${dest.name}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748B;">استان ${dest.province}</p>
        </div>
      `);
      destMarker.addTo(layerGroup);
      boundsPoints.push([dest.lat, dest.lng]);
    }

    // 5. Interactive markers for all other cities
    if (interactiveCities && allCities.length > 0) {
      allCities.forEach((city) => {
        // Skip if already origin, dest, or in waypoints
        if (city.id === origin?.id || city.id === dest?.id || waypoints.some((w) => w.id === city.id)) {
          return;
        }

        const cityDotIcon = L.divIcon({
          className: 'city-dot-marker',
          html: `
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #64748B; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); cursor: pointer;" title="${city.name}"></div>
          `,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        const cityMarker = L.marker([city.lat, city.lng], { icon: cityDotIcon });

        // Popup with Persian buttons: انتخاب به‌عنوان مبدأ & انتخاب به‌عنوان مقصد
        const popupContent = document.createElement('div');
        popupContent.style.direction = 'rtl';
        popupContent.style.textAlign = 'right';
        popupContent.style.fontFamily = 'Vazirmatn, sans-serif';
        popupContent.style.padding = '4px 6px';
        popupContent.innerHTML = `
          <div style="font-weight: 800; font-size: 15px; color: #132238; margin-bottom: 2px;">${city.name}</div>
          <div style="font-size: 12px; color: #64748B; margin-bottom: 8px;">استان ${city.province}</div>
          <div style="display: flex; gap: 6px; flex-direction: column;">
            <button id="btn-orig-${city.id}" style="width: 100%; padding: 6px 12px; background: #10B981; color: #ffffff; border: none; border-radius: 8px; font-weight: bold; font-size: 12px; cursor: pointer; font-family: Vazirmatn, sans-serif;">
              انتخاب به‌عنوان مبدأ
            </button>
            <button id="btn-dest-${city.id}" style="width: 100%; padding: 6px 12px; background: #F26A51; color: #ffffff; border: none; border-radius: 8px; font-weight: bold; font-size: 12px; cursor: pointer; font-family: Vazirmatn, sans-serif;">
              انتخاب به‌عنوان مقصد
            </button>
          </div>
        `;

        cityMarker.bindPopup(popupContent);
        cityMarker.on('popupopen', () => {
          const btnOrig = document.getElementById(`btn-orig-${city.id}`);
          const btnDest = document.getElementById(`btn-dest-${city.id}`);
          if (btnOrig && onSelectOrigin) {
            btnOrig.onclick = () => {
              onSelectOrigin(city);
              cityMarker.closePopup();
            };
          }
          if (btnDest && onSelectDest) {
            btnDest.onclick = () => {
              onSelectDest(city);
              cityMarker.closePopup();
            };
          }
        });

        cityMarker.addTo(layerGroup);
      });
    }

    // Auto fit bounds smoothly if we have points
    if (boundsPoints.length > 1) {
      const bounds = L.latLngBounds(boundsPoints);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 10,
        animate: true,
      });
    } else if (boundsPoints.length === 1) {
      map.setView(boundsPoints[0], 7, { animate: true });
    }
  }, [origin, dest, routeCoordinates, waypoints, isEstimated, allCities, interactiveCities]);

  return (
    <div
      dir="ltr"
      className={`relative rounded-3xl overflow-hidden border border-[#EADBCE] dark:border-[#24384A] shadow-lg ${className}`}
    >
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
