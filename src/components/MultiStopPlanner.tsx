import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, MapPin, Navigation, Clock } from 'lucide-react';
import { City, RouteLeg } from '../types';
import { IranMap } from './IranMap';
import { calculateAirDistance } from '../utils/calculations';
import { formatNumber, formatDuration, toPersianDigits } from '../utils/persian';

interface MultiStopPlannerProps {
  allCities: City[];
}

export const MultiStopPlanner: React.FC<MultiStopPlannerProps> = ({ allCities }) => {
  // Initial multi-stop tour
  const [stops, setStops] = useState<City[]>([]);
  const [selectedAddCityId, setSelectedAddCityId] = useState<string>('');
  const [legs, setLegs] = useState<RouteLeg[]>([]);
  const [totalDist, setTotalDist] = useState(0);
  const [totalMin, setTotalMin] = useState(0);

  // Set initial default tour once cities are loaded
  useEffect(() => {
    if (allCities.length > 0 && stops.length === 0) {
      const defaultIds = ['tehran', 'isfahan', 'shiraz', 'yazd'];
      const defaultStops = defaultIds
        .map((id) => allCities.find((c) => c.id === id))
        .filter(Boolean) as City[];
      setStops(defaultStops);
    }
  }, [allCities, stops.length]);

  // Compute legs and totals whenever stops change
  useEffect(() => {
    if (stops.length < 2) {
      setLegs([]);
      setTotalDist(0);
      setTotalMin(0);
      return;
    }

    const newLegs: RouteLeg[] = [];
    let sumDist = 0;
    let sumMin = 0;

    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i];
      const to = stops[i + 1];
      const air = calculateAirDistance(from.lat, from.lng, to.lat, to.lng);
      const roadEst = Math.round(air * 1.3);
      const durationEst = Math.round((roadEst / 80) * 60);

      sumDist += roadEst;
      sumMin += durationEst;

      newLegs.push({
        from,
        to,
        distanceKm: roadEst,
        durationMinutes: durationEst,
        isEstimated: true,
        coordinates: [
          [from.lat, from.lng],
          [to.lat, to.lng],
        ],
      });
    }

    setLegs(newLegs);
    setTotalDist(sumDist);
    setTotalMin(sumMin);
  }, [stops]);

  const handleAddStop = () => {
    if (!selectedAddCityId || stops.length >= 8) return;
    const cityToAdd = allCities.find((c) => c.id === selectedAddCityId);
    if (cityToAdd) {
      setStops([...stops, cityToAdd]);
      setSelectedAddCityId('');
    }
  };

  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...stops];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setStops(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === stops.length - 1) return;
    const updated = [...stops];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setStops(updated);
  };

  // Connected multi-stop coordinates for the map
  const routePolylineCoords = stops.map((s) => [s.lat, s.lng] as [number, number]);

  return (
    <section id="multistop" className="py-8 lg:py-14 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] tracking-wider uppercase mb-2 block">
            برنامه‌ریزی تور ایران‌گردی
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#132238] dark:text-[#F1EADF] mb-3">
            سفر چندمقصدی
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#9FB0BF] max-w-xl mx-auto">
            توقفگاه‌های سفر خود را به ترتیب مشخص کنید تا کل مسافت و زمان مسیر محاسبه شود (تا ۸ توقف).
          </p>
        </div>

        {/* Content Grid: On desktop Map is beside list; on mobile Map is above list */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Map (Order 1 on mobile, Order 2 on desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white dark:bg-[#172634] p-4 rounded-3xl border border-[#EADBCE] dark:border-[#24384A] shadow-xl">
              <IranMap
                origin={null}
                dest={null}
                waypoints={stops}
                routeCoordinates={routePolylineCoords}
                interactiveCities={false}
                className="h-[420px] sm:h-[480px] w-full"
              />

              {/* Total Stats Banner below map */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#EADBCE]/60 dark:border-[#24384A]">
                <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-3.5 rounded-2xl text-center">
                  <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                    کل مسافت تور
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#1FA3A3] dark:text-[#2EC4C1]">
                    {formatNumber(totalDist)} کیلومتر
                  </span>
                </div>
                <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-3.5 rounded-2xl text-center">
                  <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                    کل زمان تخمینی جاده
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#F26A51] dark:text-[#FF7A5C]">
                    {formatDuration(totalMin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stops List & Controls (Order 2 on mobile, Order 1 on desktop) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#172634] p-5 sm:p-6 rounded-3xl border border-[#EADBCE] dark:border-[#24384A] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#132238] dark:text-[#F1EADF] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                  <span>توقفگاه‌های مسیر ({toPersianDigits(stops.length)} از ۸)</span>
                </h3>
              </div>

              {/* Numbered Stops List */}
              <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {stops.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === stops.length - 1;

                  return (
                    <div
                      key={`${stop.id}-${idx}`}
                      className="bg-[#FAF6EF] dark:bg-[#1E3142] p-3 rounded-2xl border border-[#EADBCE]/70 dark:border-[#24384A] flex items-center justify-between gap-2 transition-all"
                    >
                      {/* Numbered Circle & City Details */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1FA3A3] text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                          {toPersianDigits(idx + 1)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#132238] dark:text-[#F1EADF]">
                            {stop.name}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#9FB0BF]">
                            استان {stop.province}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons: Move Up, Move Down, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={isFirst}
                          aria-label="انتقال به بالا"
                          className="w-8 h-8 rounded-lg bg-white dark:bg-[#172634] text-[#132238] dark:text-[#F1EADF] flex items-center justify-center border border-[#EADBCE]/70 dark:border-[#24384A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F6EFE4] dark:hover:bg-[#253D52] cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={isLast}
                          aria-label="انتقال به پایین"
                          className="w-8 h-8 rounded-lg bg-white dark:bg-[#172634] text-[#132238] dark:text-[#F1EADF] flex items-center justify-center border border-[#EADBCE]/70 dark:border-[#24384A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F6EFE4] dark:hover:bg-[#253D52] cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStop(idx)}
                          disabled={stops.length <= 2}
                          aria-label="حذف شهر"
                          className="w-8 h-8 rounded-lg bg-white dark:bg-[#172634] text-red-500 flex items-center justify-center border border-[#EADBCE]/70 dark:border-[#24384A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Stop Input (max 8 stops) */}
              {stops.length < 8 && (
                <div className="mt-4 pt-4 border-t border-[#EADBCE]/60 dark:border-[#24384A] flex gap-2">
                  <select
                    value={selectedAddCityId}
                    onChange={(e) => setSelectedAddCityId(e.target.value)}
                    className="flex-1 h-11 px-3 text-sm rounded-xl bg-[#FAF6EF] dark:bg-[#1E3142] text-[#132238] dark:text-[#F1EADF] border border-[#EADBCE] dark:border-[#24384A] focus:outline-none focus:ring-1 focus:ring-[#1FA3A3]"
                  >
                    <option value="">انتخاب شهر برای افزودن...</option>
                    {allCities
                      .filter((c) => !stops.some((s) => s.id === c.id))
                      .sort((a, b) => a.name.localeCompare(b.name, 'fa'))
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddStop}
                    disabled={!selectedAddCityId}
                    className="h-11 px-4 bg-[#1FA3A3] hover:bg-[#198B8B] dark:bg-[#2EC4C1] dark:hover:bg-[#3BD4D1] text-white font-bold text-sm rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن</span>
                  </button>
                </div>
              )}
            </div>

            {/* Step-by-Step Breakdown Cards */}
            {legs.length > 0 && (
              <div className="bg-white dark:bg-[#172634] p-5 rounded-3xl border border-[#EADBCE] dark:border-[#24384A] shadow-md">
                <span className="text-xs font-bold text-[#64748B] dark:text-[#9FB0BF] uppercase tracking-wider block mb-3">
                  مسافت و زمان هر مرحله
                </span>
                <div className="flex flex-col gap-2">
                  {legs.map((leg, i) => (
                    <div
                      key={`leg-${i}`}
                      className="text-xs flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EF]/70 dark:bg-[#1E3142]/70"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[#132238] dark:text-[#F1EADF]">
                        <span>{leg.from.name}</span>
                        <span className="text-[#1FA3A3]">←</span>
                        <span>{leg.to.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[#64748B] dark:text-[#9FB0BF]">
                        <span>{formatNumber(leg.distanceKm)} کم</span>
                        <span>{formatDuration(leg.durationMinutes)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
