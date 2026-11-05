import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RouteResult } from './components/RouteResult';
import { TravelModes } from './components/TravelModes';
import { FuelCalculator } from './components/FuelCalculator';
import { MultiStopPlanner } from './components/MultiStopPlanner';
import { DestinationGuide } from './components/DestinationGuide';
import { DistanceGuessGame } from './components/DistanceGuessGame';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { City, RouteCalculation } from './types';
import { fetchRouteData, computeTravelModes, calculateAirDistance } from './utils/calculations';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('safarname_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [cities, setCities] = useState<City[]>([]);
  const [originCity, setOriginCity] = useState<City | null>(null);
  const [destCity, setDestCity] = useState<City | null>(null);
  const [routeData, setRouteData] = useState<RouteCalculation | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);

  // Sync theme changes with document class and localStorage
  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('safarname_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('safarname_theme', 'light');
      }
      return next;
    });
  };

  // Load cities data on mount
  useEffect(() => {
    fetch('/cities.json')
      .then((res) => res.json())
      .then((data: City[]) => {
        setCities(data);

        // Check URL parameters ?from=...&to=...
        const searchParams = new URLSearchParams(window.location.search);
        const fromParam = searchParams.get('from');
        const toParam = searchParams.get('to');

        const initialOrigin =
          (fromParam && data.find((c) => c.id === fromParam)) ||
          data.find((c) => c.id === 'tehran') ||
          data[0];

        const initialDest =
          (toParam && data.find((c) => c.id === toParam)) ||
          data.find((c) => c.id === 'shiraz') ||
          data[1];

        setOriginCity(initialOrigin);
        setDestCity(initialDest);
      })
      .catch((err) => console.error('Failed to load cities:', err));
  }, []);

  // Update URL search parameters when origin or destination changes
  useEffect(() => {
    if (originCity && destCity) {
      const params = new URLSearchParams(window.location.search);
      params.set('from', originCity.id);
      params.set('to', destCity.id);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [originCity, destCity]);

  // Debounced Route Calculation (~400ms)
  const debounceTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!originCity || !destCity) return;

    if (originCity.id === destCity.id) {
      setRouteData(null);
      setIsLoadingRoute(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoadingRoute(true);

    debounceTimerRef.current = window.setTimeout(async () => {
      try {
        const airDistanceKm = calculateAirDistance(
          originCity.lat,
          originCity.lng,
          destCity.lat,
          destCity.lng
        );

        const routeResult = await fetchRouteData(originCity, destCity, controller.signal);

        const travelModes = computeTravelModes(
          airDistanceKm,
          routeResult.distanceKm,
          routeResult.durationMinutes,
          originCity,
          destCity
        );

        setRouteData({
          airDistanceKm,
          roadDistanceKm: routeResult.distanceKm,
          isRoadEstimated: routeResult.isEstimated,
          roadDurationMinutes: routeResult.durationMinutes,
          coordinates: routeResult.coordinates,
          travelModes,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Route calculation error:', err);
        }
      } finally {
        setIsLoadingRoute(false);
      }
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [originCity, destCity]);

  // Swap cities handler
  const handleSwapCities = () => {
    if (originCity && destCity) {
      const temp = originCity;
      setOriginCity(destCity);
      setDestCity(temp);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
        {/* 1. Sticky Header */}
        <Header isDark={isDark} onToggleTheme={handleToggleTheme} />

        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-hidden">
          {/* 2. Hero Section */}
          <Hero
            cities={cities}
            originCity={originCity}
            destCity={destCity}
            onSelectOrigin={setOriginCity}
            onSelectDest={setDestCity}
            onSwapCities={handleSwapCities}
            routeData={routeData}
            isLoadingRoute={isLoadingRoute}
          />

          {/* 3. Route Result Section */}
          <RouteResult
            origin={originCity}
            dest={destCity}
            routeData={routeData}
            allCities={cities}
            onSelectOrigin={setOriginCity}
            onSelectDest={setDestCity}
          />

          {/* 4. Travel Modes Section */}
          {routeData && (
            <TravelModes
              origin={originCity}
              dest={destCity}
              travelModes={routeData.travelModes}
            />
          )}

          {/* 5. Fuel Cost Calculator Section */}
          <FuelCalculator
            origin={originCity}
            dest={destCity}
            roadDistanceKm={routeData?.roadDistanceKm ?? 0}
          />

          {/* 6. Multi-Stop Trip Planner */}
          <MultiStopPlanner allCities={cities} />

          {/* 7. Destination Guide ("مقصدت را بشناس") */}
          <DestinationGuide
            cities={cities}
            onSelectAsDestination={setDestCity}
          />

          {/* 8. Distance Guess Mini-Game */}
          <DistanceGuessGame cities={cities} />
        </main>

        {/* 9. Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
