import React, { useState } from 'react';
import { Share2, Check, Car, Compass, Clock, MapPin } from 'lucide-react';
import { City, RouteCalculation } from '../types';
import { IranMap } from './IranMap';
import { formatNumber, formatDuration } from '../utils/persian';

interface RouteResultProps {
  origin: City | null;
  dest: City | null;
  routeData: RouteCalculation | null;
  allCities: City[];
  onSelectOrigin: (city: City) => void;
  onSelectDest: (city: City) => void;
}

export const RouteResult: React.FC<RouteResultProps> = ({
  origin,
  dest,
  routeData,
  allCities,
  onSelectOrigin,
  onSelectDest,
}) => {
  const [copied, setCopied] = useState(false);

  if (!origin || !dest || origin.id === dest.id) {
    return null;
  }

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('from', origin.id);
    url.searchParams.set('to', dest.id);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const roadDist = routeData?.roadDistanceKm ?? Math.round((routeData?.airDistanceKm || 0) * 1.3);
  const airDist = routeData?.airDistanceKm ?? 0;
  const carDuration = routeData?.roadDurationMinutes ?? Math.round((roadDist / 80) * 60);

  return (
    <section id="route-result" className="py-8 lg:py-12 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Origin ← Destination & Copy Link */}
        <div className="bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl p-5 sm:p-7 shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Title: تهران ← شیراز */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F26A51]/10 dark:bg-[#FF7A5C]/15 flex items-center justify-center text-[#F26A51] dark:text-[#FF7A5C]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#64748B] dark:text-[#9FB0BF] block mb-0.5">
                  نتیجه محاسبه و ترسیم مسیر
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#132238] dark:text-[#F1EADF] flex items-center gap-2">
                  <span>{origin.name}</span>
                  <span className="text-[#1FA3A3] dark:text-[#2EC4C1]">←</span>
                  <span>{dest.name}</span>
                </h2>
              </div>
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#FAF6EF] dark:bg-[#1E3142] hover:bg-[#F2EAE0] dark:hover:bg-[#253D52] border border-[#EADBCE] dark:border-[#24384A] text-[#132238] dark:text-[#F1EADF] font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span className="text-[#10B981]">لینک این مسیر کپی شد!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                  <span>کپی لینک این مسیر</span>
                </>
              )}
            </button>
          </div>

          {/* Three Large Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#EADBCE]/50 dark:border-[#24384A]">
            
            {/* Stat 1: Road Distance */}
            <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-4 rounded-2xl border border-[#EADBCE]/60 dark:border-[#24384A]/60 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1FA3A3]/15 text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] font-medium block">
                  فاصله جاده‌ای
                  {routeData?.isRoadEstimated && (
                    <span className="text-[10px] text-[#F26A51] mr-1.5 font-bold">
                      (تقریبی)
                    </span>
                  )}
                </span>
                <div className="text-2xl font-black text-[#132238] dark:text-[#F1EADF]">
                  {formatNumber(roadDist)}{' '}
                  <span className="text-xs font-normal text-[#64748B] dark:text-[#9FB0BF]">
                    کیلومتر
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 2: Air Distance */}
            <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-4 rounded-2xl border border-[#EADBCE]/60 dark:border-[#24384A]/60 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#F26A51]/15 text-[#F26A51] dark:text-[#FF7A5C] flex items-center justify-center flex-shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] font-medium block">
                  فاصله مستقیم هوایی
                </span>
                <div className="text-2xl font-black text-[#132238] dark:text-[#F1EADF]">
                  {formatNumber(airDist)}{' '}
                  <span className="text-xs font-normal text-[#64748B] dark:text-[#9FB0BF]">
                    کیلومتر
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 3: Driving Duration */}
            <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-4 rounded-2xl border border-[#EADBCE]/60 dark:border-[#24384A]/60 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#132238]/10 dark:bg-white/10 text-[#132238] dark:text-[#F1EADF] flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] font-medium block">
                  زمان رانندگی با ماشین
                </span>
                <div className="text-xl font-black text-[#132238] dark:text-[#F1EADF]">
                  {formatDuration(carDuration)}
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Map */}
          <div className="mt-6">
            <IranMap
              origin={origin}
              dest={dest}
              allCities={allCities}
              routeCoordinates={routeData?.coordinates}
              isEstimated={routeData?.isRoadEstimated}
              onSelectOrigin={onSelectOrigin}
              onSelectDest={onSelectDest}
              className="h-[460px] w-full"
            />
            <p className="text-xs text-[#64748B] dark:text-[#9FB0BF] mt-2.5 text-center">
              برای جابه‌جایی مبدأ یا مقصد می‌توانید روی هر نقطه از نقشه کلیک کنید.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
