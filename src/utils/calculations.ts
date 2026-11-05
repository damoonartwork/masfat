import { City, RouteCalculation, TravelModeDetail } from '../types';

// Haversine formula to calculate great-circle distance between two points in km
export function calculateAirDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// In-memory cache for OSRM routes
interface OsrmCacheEntry {
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
}
const routeCache = new Map<string, OsrmCacheEntry>();

export async function fetchRouteData(
  origin: City,
  dest: City,
  signal?: AbortSignal
): Promise<{
  distanceKm: number;
  durationMinutes: number;
  isEstimated: boolean;
  coordinates: [number, number][];
}> {
  const airDist = calculateAirDistance(origin.lat, origin.lng, dest.lat, dest.lng);

  if (origin.id === dest.id) {
    return {
      distanceKm: 0,
      durationMinutes: 0,
      isEstimated: false,
      coordinates: [[origin.lat, origin.lng]],
    };
  }

  const cacheKey = `${origin.id}_${dest.id}`;
  if (routeCache.has(cacheKey)) {
    const cached = routeCache.get(cacheKey)!;
    return {
      distanceKm: cached.distanceKm,
      durationMinutes: cached.durationMinutes,
      isEstimated: false,
      coordinates: cached.coordinates,
    };
  }

  // Fallback helper
  const getFallback = () => {
    const fallbackRoadDist = Math.round(airDist * 1.3);
    const fallbackDuration = Math.round((fallbackRoadDist / 80) * 60);
    return {
      distanceKm: fallbackRoadDist,
      durationMinutes: fallbackDuration,
      isEstimated: true,
      coordinates: [
        [origin.lat, origin.lng],
        [dest.lat, dest.lng],
      ] as [number, number][],
    };
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  // Link external signal if present
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return getFallback();
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      return getFallback();
    }

    const primaryRoute = data.routes[0];
    const distanceKm = Math.round((primaryRoute.distance || 0) / 1000);
    const durationMinutes = Math.round((primaryRoute.duration || 0) / 60);

    // OSRM returns GeoJSON coordinates as [lng, lat], Leaflet polyline needs [lat, lng]
    const rawCoords: [number, number][] = primaryRoute.geometry?.coordinates || [];
    const coordinates: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

    if (coordinates.length === 0) {
      coordinates.push([origin.lat, origin.lng], [dest.lat, dest.lng]);
    }

    const result = {
      distanceKm: distanceKm > 0 ? distanceKm : Math.round(airDist * 1.3),
      durationMinutes: durationMinutes > 0 ? durationMinutes : Math.round(((distanceKm || airDist * 1.3) / 80) * 60),
      isEstimated: false,
      coordinates,
    };

    routeCache.set(cacheKey, {
      distanceKm: result.distanceKm,
      durationMinutes: result.durationMinutes,
      coordinates: result.coordinates,
    });

    return result;
  } catch {
    clearTimeout(timeoutId);
    return getFallback();
  }
}

export function computeTravelModes(
  airDistKm: number,
  roadDistKm: number,
  roadDurationMin: number,
  origin: City,
  dest: City,
  consumptionLPer100Km = 8
): TravelModeDetail[] {
  // 1. Car (خودرو شخصی)
  const carFuel = Math.round((roadDistKm * consumptionLPer100Km) / 100);
  const carDuration = roadDurationMin > 0 ? roadDurationMin : Math.round((roadDistKm / 80) * 60);

  // 2. Bus (اتوبوس)
  const busDuration = Math.round((roadDistKm / 65) * 60);

  // 3. Train (قطار)
  const trainAvailable = origin.hasRailway && dest.hasRailway;
  const trainDuration = trainAvailable ? Math.round((roadDistKm / 70) * 60) : 0;

  // 4. Airplane (هواپیما)
  const airplaneAvailable = origin.hasAirport && dest.hasAirport;
  const airplaneDuration = airplaneAvailable ? Math.round((airDistKm / 700) * 60 + 30) : 0;

  return [
    {
      id: 'car',
      title: 'خودرو شخصی',
      tag: 'انعطاف‌پذیرترین',
      available: true,
      durationMinutes: carDuration,
      fuelLiters: carFuel,
      description: 'آزادی عمل در توقفگاه‌ها، سفر اختصاصی و تماشای چشم‌اندازهای مسیر.',
    },
    {
      id: 'bus',
      title: 'اتوبوس بین‌شهری',
      tag: 'اقتصادی و همگانی',
      available: true,
      durationMinutes: busDuration,
      description: 'حرکت منظم از پایانه‌های مسافربری با اتوبوس‌های VIP و صندلی‌های تخت‌شو.',
    },
    {
      id: 'train',
      title: 'قطار مسافربری',
      tag: 'آرامش و امنیت',
      available: trainAvailable,
      reasonDisabled: !trainAvailable ? 'راه‌آهن ندارد' : undefined,
      durationMinutes: trainDuration,
      description: trainAvailable
        ? 'سفر دلپذیر با تخت‌خواب، کوپه‌های اختصاصی و آرامش تماشای ریل‌های راه‌آهن ایران.'
        : 'یکی از دو شهر مبدأ یا مقصد به شبکه ریلی سراسری متصل نیست.',
    },
    {
      id: 'airplane',
      title: 'هواپیما',
      tag: 'سریع‌ترین راه',
      available: airplaneAvailable,
      reasonDisabled: !airplaneAvailable ? 'فرودگاه ندارد' : undefined,
      durationMinutes: airplaneDuration,
      description: airplaneAvailable
        ? 'پرواز مستقیم هوایی با کوتاه‌ترین زمان، مناسب سفرهای فوری و تجاری.'
        : 'یکی از دو شهر مبدأ یا مقصد دارای فرودگاه فعال مسافربری نیست.',
    },
  ];
}
