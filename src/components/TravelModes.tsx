import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { City, TravelModeDetail } from '../types';
import { formatDuration } from '../utils/persian';

interface TravelModesProps {
  origin: City | null;
  dest: City | null;
  travelModes: TravelModeDetail[];
}

export const TravelModes: React.FC<TravelModesProps> = ({
  origin,
  dest,
  travelModes,
}) => {
  if (!origin || !dest || origin.id === dest.id) {
    return null;
  }

  const getImageSrc = (id: string) => {
    switch (id) {
      case 'car':
        return '/images/car.png';
      case 'bus':
        return '/images/bus.png';
      case 'train':
        return '/images/train.png';
      case 'airplane':
        return '/images/airplane.png';
      default:
        return `/images/${id}.png`;
    }
  };

  const getBadgeColor = (id: string, available: boolean) => {
    if (!available) {
      return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700';
    }
    switch (id) {
      case 'car':
        return 'bg-[#1FA3A3]/10 text-[#1FA3A3] dark:bg-[#2EC4C1]/15 dark:text-[#2EC4C1] border-[#1FA3A3]/20';
      case 'bus':
        return 'bg-[#F26A51]/10 text-[#F26A51] dark:bg-[#FF7A5C]/15 dark:text-[#FF7A5C] border-[#F26A51]/20';
      case 'train':
        return 'bg-[#132238]/10 text-[#132238] dark:bg-white/10 dark:text-[#F1EADF] border-[#132238]/20';
      case 'airplane':
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section id="travel-modes" className="py-8 lg:py-14 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] tracking-wider uppercase mb-2 block">
            مقایسه گزینه‌های ترابری
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#132238] dark:text-[#F1EADF] mb-3">
            چطور می‌خواهید سفر کنید؟
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#9FB0BF] max-w-xl mx-auto">
            بررسی زمان و شرایط سفر بین {origin.name} و {dest.name} با خودرو شخصی، اتوبوس، قطار و پرواز
          </p>
        </div>

        {/* 4 Travel Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {travelModes.map((mode) => {
            const isAvailable = mode.available;
            const imagePath = getImageSrc(mode.id);

            return (
              <div
                key={mode.id}
                className={`group relative bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between ${
                  isAvailable
                    ? 'hover:shadow-2xl hover:-translate-y-1'
                    : 'opacity-65 grayscale-[25%]'
                }`}
              >
                {/* Image Top: aspect-ratio 3:2, object-fit: cover, rounded corners, no border, hover scale 1.05 */}
                <div
                  className="relative w-full overflow-hidden rounded-t-[22px] border-none p-0 m-0 bg-[#FAF6EF] dark:bg-[#1E3142]"
                  style={{ aspectRatio: '3 / 2' }}
                >
                  <img
                    src={imagePath}
                    alt={mode.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 hover:scale-105 border-none p-0 m-0"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = `/images/${mode.id}.jpg`;
                      }
                    }}
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-3 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-bold shadow-md">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {mode.reasonDisabled || 'ناممکن'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tag Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getBadgeColor(
                          mode.id,
                          isAvailable
                        )}`}
                      >
                        {mode.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#132238] dark:text-[#F1EADF] mb-2">
                      {mode.title}
                    </h3>

                    {/* Duration / Disabled Notice */}
                    <div className="mb-3">
                      {isAvailable ? (
                        <div className="flex items-center gap-2 text-[#132238] dark:text-[#F1EADF] font-bold text-lg">
                          <Clock className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                          <span>{formatDuration(mode.durationMinutes)}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-red-500 dark:text-red-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{mode.reasonDisabled}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#64748B] dark:text-[#9FB0BF] leading-relaxed">
                      {mode.description}
                    </p>
                  </div>

                  {/* Fuel note for car */}
                  {mode.id === 'car' && mode.fuelLiters && (
                    <div className="mt-4 pt-3 border-t border-[#EADBCE]/50 dark:border-[#24384A] text-xs text-[#1FA3A3] dark:text-[#2EC4C1] font-medium flex items-center justify-between">
                      <span>مصرف تقریبی:</span>
                      <span className="font-bold">حدود {mode.fuelLiters} لیتر بنزین</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
