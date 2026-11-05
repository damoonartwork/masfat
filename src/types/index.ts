export interface City {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  population: number;
  hasAirport: boolean;
  hasRailway: boolean;
  souvenirs: string[];
  attractions: string[];
  description: string;
}

export type TravelModeId = 'car' | 'bus' | 'train' | 'airplane';

export interface TravelModeDetail {
  id: TravelModeId;
  title: string;
  tag: string;
  available: boolean;
  reasonDisabled?: string;
  durationMinutes: number;
  fuelLiters?: number;
  description: string;
}

export interface RouteCalculation {
  airDistanceKm: number;
  roadDistanceKm: number;
  isRoadEstimated: boolean;
  roadDurationMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
  travelModes: TravelModeDetail[];
}

export interface RouteLeg {
  from: City;
  to: City;
  distanceKm: number;
  durationMinutes: number;
  isEstimated: boolean;
  coordinates: [number, number][];
}

export interface MultiStopResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  legs: RouteLeg[];
}
