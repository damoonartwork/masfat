import React, { useState } from 'react';
import { ArrowLeftRight, Compass, Sparkles, Navigation } from 'lucide-react';
import { City, RouteCalculation } from '../types';
import { CitySelector } from './CitySelector';
import { SmartImage } from './SmartImage';
import { cityToHeroPosition } from '../utils/mapCalibration';
import { toPersianDigits, formatDuration } from '../utils/persian';

interface HeroProps {
  cities: City[];
  originCity: City | null;
  destCity: City | null;
  onSelectOrigin: (city: City) => void;
  onSelectDest: (city: City) => void;
  onSwapCities: () => void;
  routeData: RouteCalculation | null;
  isLoadingRoute: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  cities,
  originCity,
  destCity,
  onSelectOrigin,
  onSelectDest,
  onSwapCities,
  routeData,
  isLoadingRoute,
}) => {
  const [swapRotated, setSwapRotated] = useState(false);

  const handleSwap = () => {
    setSwapRotated(!swapRotated);
    onSwapCities();
  };

  // Predefined popular routes
  const popularRoutes = [
    { fromId: 'tehran', toId: 'isfahan', label: 'تهران به اصفهان' },
    { fromId: 'tehran', toId: 'shiraz', label: 'تهران به شیراز' },
    { fromId: 'tehran', toId: 'mashhad', label: 'تهران به مشهد' },
    { fromId: 'tabriz', toId: 'rasht', label: 'تبریز به رشت' },
  ];

  const handleSelectPopularRoute = (fromId: string, toId: string) => {
    const o = cities.find((c) => c.id === fromId);
    const d = cities.find((c) => c.id === toId);
    if (o) onSelectOrigin(o);
    if (d) onSelectDest(d);
  };

  // Exact 3D calibrated pin positions
  const originPos = originCity
    ? cityToHeroPosition(originCity.lat, originCity.lng, originCity.id)
    : null;
  const destPos = destCity
    ? cityToHeroPosition(destCity.lat, destCity.lng, destCity.id)
    : null;

  // Arc path between pins on the 3D map
  let svgArc = '';
  if (originPos && destPos && originCity?.id !== destCity?.id) {
    const x1 = originPos.x;
    const y1 = originPos.y;
    const x2 = destPos.x;
    const y2 = destPos.y;
    const midX = (x1 + x2) / 2;
    // Dynamic arching height
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const archOffset = Math.min(Math.max(dist * 0.35, 12), 25);
    const midY = (y1 + y2) / 2 - archOffset;
    svgArc = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  }

  const hasValidRoute = originCity && destCity && originCity.id !== destCity.id;

  return (
    <section
      id="calculator"
      className="relative z-20 min-h-[75vh] flex items-center justify-center py-8 lg:py-16 overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Mobile Image with live calibrated pins (shown above headline on small screens) */}
          <div className="block lg:hidden w-full max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-xl border border-[#EADBCE] dark:border-[#24384A] relative">
            <div className="relative aspect-square w-full">
              <SmartImage
                src="/images/hero.png"
                alt="نقشه سه‌بعدی راه‌های ایران"
                aspectRatio="1/1"
                loading="eager"
                fetchPriority="high"
                fallbackType="hero"
                className="w-full h-full object-cover"
                containerClassName="rounded-3xl w-full h-full"
              />

              {/* Mobile SVG Route Arc */}
              {svgArc && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={svgArc}
                    fill="none"
                    stroke="#F26A51"
                    strokeWidth="2.4"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {/* Mobile Origin Pin */}
              {originPos && (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-500 pointer-events-none"
                  style={{ left: `${originPos.x}%`, top: `${originPos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-md bg-[#1FA3A3] text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5">
                      {originCity?.name}
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#1FA3A3] border-2 border-white shadow-md flex items-center justify-center animate-bounce" />
                  </div>
                </div>
              )}

              {/* Mobile Destination Pin */}
              {destPos && (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-500 pointer-events-none"
                  style={{ left: `${destPos.x}%`, top: `${destPos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="px-2 py-0.5 rounded-md bg-[#F26A51] text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5">
                      {destCity?.name}
                    </span>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F26A51] border-2 border-white shadow-md flex items-center justify-center animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Headline, Subtitle, Form, and Popular routes (>= 50% on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 text-[#1FA3A3] dark:text-[#2EC4C1] text-xs font-bold w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مسیریابی دقیق بین تمام شهرهای ایران</span>
            </div>

            {/* Two-line headline */}
            <h1
              className="font-black text-[#132238] dark:text-[#F1EADF] leading-[1.25] tracking-tight mb-4"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)' }}
            >
              <span>محاسبه دقیق مسافت</span>
              <br />
              <span className="relative inline-block text-[#F26A51] dark:text-[#FF7A5C] mt-1">
                و هزینه سوخت
                {/* Hand-drawn curved underline SVG */}
                <svg
                  className="absolute -bottom-2.5 right-0 w-full h-3 text-[#F26A51] dark:text-[#FF7A5C] pointer-events-none"
                  viewBox="0 0 260 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 14C55 4 190 2 257 15"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#64748B] dark:text-[#9FB0BF] leading-relaxed mb-8 max-w-xl">
              فاصله، زمان و هزینه سفر بین شهرهای ایران را در یک نگاه ببین.
            </p>

            {/* Form Card (White card, auto-calculates on change) */}
            <div className="bg-white dark:bg-[#172634] p-4 sm:p-6 rounded-3xl border border-[#EADBCE] dark:border-[#24384A] shadow-xl relative z-30">
              {/* Desktop: Grid 1fr auto 1fr */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-end gap-3 relative">
                {/* Origin City */}
                <CitySelector
                  label="شهر مبدأ"
                  selectedCity={originCity}
                  onSelect={onSelectOrigin}
                  cities={cities}
                  placeholder="مبدأ را انتخاب کنید"
                  isOrigin={true}
                />

                {/* Swap Button (180deg flip) */}
                <div className="pb-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="جابه‌جایی مبدأ و مقصد"
                    className="w-12 h-12 rounded-2xl bg-[#FAF6EF] dark:bg-[#1E3142] hover:bg-[#F2EAE0] dark:hover:bg-[#253D52] border border-[#EADBCE] dark:border-[#24384A] text-[#132238] dark:text-[#F1EADF] flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                    style={{
                      transform: swapRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ArrowLeftRight className="w-5 h-5 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                  </button>
                </div>

                {/* Destination City */}
                <CitySelector
                  label="شهر مقصد"
                  selectedCity={destCity}
                  onSelect={onSelectDest}
                  cities={cities}
                  placeholder="مقصد را انتخاب کنید"
                  isOrigin={false}
                />
              </div>

              {/* Mobile: Vertical Form with swap button on border */}
              <div className="sm:hidden flex flex-col gap-3 relative">
                <CitySelector
                  label="شهر مبدأ"
                  selectedCity={originCity}
                  onSelect={onSelectOrigin}
                  cities={cities}
                  placeholder="مبدأ را انتخاب کنید"
                  isOrigin={true}
                />

                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="جابه‌جایی مبدأ و مقصد"
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#1E3142] border-2 border-[#EADBCE] dark:border-[#24384A] text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center justify-center shadow-md active:scale-90 transition-transform duration-300"
                    style={{
                      transform: swapRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <ArrowLeftRight className="w-4 h-4 rotate-90" />
                  </button>
                </div>

                <CitySelector
                  label="شهر مقصد"
                  selectedCity={destCity}
                  onSelect={onSelectDest}
                  cities={cities}
                  placeholder="مقصد را انتخاب کنید"
                  isOrigin={false}
                />
              </div>

              {/* Under-fields summary bar */}
              <div className="mt-5 pt-4 border-t border-[#EADBCE]/50 dark:border-[#24384A] flex flex-wrap items-center justify-between gap-3 text-sm">
                <div className="text-[#132238] dark:text-[#F1EADF] font-semibold flex items-center gap-2">
                  {isLoadingRoute ? (
                    <span className="text-[#64748B] dark:text-[#9FB0BF] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1FA3A3] animate-ping" />
                      در حال محاسبه مسیر...
                    </span>
                  ) : hasValidRoute && routeData ? (
                    <span>
                      ≈ {toPersianDigits(routeData.airDistanceKm)} کیلومتر هوایی · حدود{' '}
                      {formatDuration(routeData.roadDurationMinutes)} با ماشین
                    </span>
                  ) : (
                    <span className="text-[#64748B] dark:text-[#9FB0BF]">
                      مبدأ و مقصد را انتخاب کنید
                    </span>
                  )}
                </div>

                {hasValidRoute && (
                  <a
                    href="#route-result"
                    className="text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>مشاهده جزئیات ↓</span>
                  </a>
                )}
              </div>
            </div>

            {/* Popular Routes Chips */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-xs font-medium text-[#64748B] dark:text-[#9FB0BF] flex-shrink-0">
                مسیرهای پرطرفدار:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {popularRoutes.map((r) => {
                  const isActive =
                    originCity?.id === r.fromId && destCity?.id === r.toId;
                  return (
                    <button
                      key={`${r.fromId}-${r.toId}`}
                      type="button"
                      onClick={() => handleSelectPopularRoute(r.fromId, r.toId)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                        isActive
                          ? 'bg-[#1FA3A3] text-white border-[#1FA3A3]'
                          : 'bg-white/80 dark:bg-[#172634] text-[#132238] dark:text-[#F1EADF] border-[#EADBCE] dark:border-[#24384A] hover:border-[#1FA3A3] dark:hover:border-[#2EC4C1]'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Left Column: Desktop Hero Image with 3D map, pins & floating badges (1:1 Aspect Ratio) */}
          <div className="hidden lg:block lg:col-span-5 relative order-1 lg:order-2">
            <div className="relative group max-w-[500px] mx-auto">
              {/* Main Image Frame (32px rounded corners, soft shadow, subtle float) */}
              <div className="relative aspect-square w-full rounded-[32px] overflow-hidden shadow-2xl border border-[#EADBCE] dark:border-[#24384A] transition-transform duration-700 ease-out hover:-translate-y-1">
                <SmartImage
                  src="/images/hero.png"
                  alt="نقشه برجسته و سه‌بعدی راه‌های ایران"
                  aspectRatio="1/1"
                  loading="eager"
                  fetchPriority="high"
                  fallbackType="hero"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  containerClassName="rounded-[32px] w-full h-full"
                />

                {/* SVG Live Overlay for Dynamic Route Line between Pins */}
                {svgArc && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={svgArc}
                      fill="none"
                      stroke="#F26A51"
                      strokeWidth="2.2"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                  </svg>
                )}

                {/* Live Origin Pin on Hero 3D Map */}
                {originPos && (
                  <div
                    className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-500 pointer-events-none"
                    style={{ left: `${originPos.x}%`, top: `${originPos.y}%` }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#1FA3A3] text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5 border border-white/60">
                        {originCity?.name}
                      </span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#1FA3A3] border-2 border-white shadow-md flex items-center justify-center animate-bounce" />
                    </div>
                  </div>
                )}

                {/* Live Destination Pin on Hero 3D Map */}
                {destPos && (
                  <div
                    className="absolute z-20 -translate-x-1/2 -translate-y-full transition-all duration-500 pointer-events-none"
                    style={{ left: `${destPos.x}%`, top: `${destPos.y}%` }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#F26A51] text-white text-[10px] font-bold shadow-md whitespace-nowrap mb-0.5 border border-white/60">
                        {destCity?.name}
                      </span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#F26A51] border-2 border-white shadow-md flex items-center justify-center animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Floating Glass Badges OUTSIDE the image frame so they are never clipped */}
              {/* Badge 1: ۳۱ استان (Top Right) */}
              <div className="absolute -top-4 -right-4 z-20 px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-[#172634]/90 border border-[#EADBCE] dark:border-[#24384A] shadow-xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <div className="w-8 h-8 rounded-xl bg-[#1FA3A3]/15 text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center justify-center">
                  <Navigation className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#132238] dark:text-[#F1EADF]">
                    ۳۱ استان
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#9FB0BF]">
                    پوشش سراسری کشور
                  </div>
                </div>
              </div>

              {/* Badge 2: +۵۰ شهر (Bottom Right) */}
              <div className="absolute -bottom-4 -right-2 z-20 px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-[#172634]/90 border border-[#EADBCE] dark:border-[#24384A] shadow-xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <div className="w-8 h-8 rounded-xl bg-[#F26A51]/15 text-[#F26A51] dark:text-[#FF7A5C] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#132238] dark:text-[#F1EADF]">
                    +۵۰ شهر اصلی
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#9FB0BF]">
                    با جاذبه‌ها و سوغات
                  </div>
                </div>
              </div>

              {/* Badge 3: ۴ روش سفر (Bottom Left) */}
              <div className="absolute -bottom-5 -left-4 z-20 px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-[#172634]/90 border border-[#EADBCE] dark:border-[#24384A] shadow-xl flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <div className="w-8 h-8 rounded-xl bg-[#1FA3A3]/15 text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center justify-center">
                  <span className="text-xs font-black">۴</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#132238] dark:text-[#F1EADF]">
                    ۴ روش سفر
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#9FB0BF]">
                    ماشین، اتوبوس، قطار، پرواز
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
