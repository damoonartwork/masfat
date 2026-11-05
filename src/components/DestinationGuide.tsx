import React, { useState, useMemo } from 'react';
import { X, MapPin, Sparkles, Navigation, Users, Gift } from 'lucide-react';
import { City } from '../types';
import { SmartImage } from './SmartImage';
import { formatNumber } from '../utils/persian';

interface DestinationGuideProps {
  cities: City[];
  onSelectAsDestination: (city: City) => void;
}

const PRIORITY_CITY_IDS = ['tehran', 'isfahan', 'mashhad', 'kashan', 'shiraz', 'yazd', 'tabriz', 'kish'];

export const DestinationGuide: React.FC<DestinationGuideProps> = ({
  cities,
  onSelectAsDestination,
}) => {
  const [activeModalCity, setActiveModalCity] = useState<City | null>(null);

  // Sort cities: priority image cities first, then others
  const sortedCities = useMemo(() => {
    const priority = PRIORITY_CITY_IDS.map((id) => cities.find((c) => c.id === id)).filter(
      Boolean
    ) as City[];
    const others = cities.filter((c) => !PRIORITY_CITY_IDS.includes(c.id));
    return [...priority, ...others];
  }, [cities]);

  const handleMakeDestination = (city: City) => {
    onSelectAsDestination(city);
    setActiveModalCity(null);
    const calculatorEl = document.querySelector('#calculator');
    if (calculatorEl) {
      calculatorEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cities" className="py-8 lg:py-14 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1] tracking-wider uppercase mb-2 block">
              راهنمای گردشگری شهرهای ایران
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#132238] dark:text-[#F1EADF]">
              مقصدت را بشناس
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-[#9FB0BF] mt-1">
              با سوغاتی‌ها، جاذبه‌ها و اقلیم شهرهای زیبای ایران آشنا شوید.
            </p>
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] hidden sm:block">
            برای اطلاعات بیشتر روی هر کارت کلیک کنید ←
          </span>
        </div>

        {/* Horizontal Scrollable City Cards */}
        <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin snap-x">
          {sortedCities.map((city) => (
            <div
              key={city.id}
              onClick={() => setActiveModalCity(city)}
              className="flex-shrink-0 w-[270px] sm:w-[310px] bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between snap-start group"
            >
              {/* City Image: 4:3 aspect ratio, cover */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={`/images/${city.id}.png`}
                  alt={city.name}
                  aspectRatio="4/3"
                  loading="lazy"
                  fallbackType="city"
                  cityName={city.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                  containerClassName="w-full h-full rounded-none"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#172634]/90 backdrop-blur-sm text-xs font-bold text-[#132238] dark:text-[#F1EADF] shadow-sm">
                  {city.province}
                </div>
              </div>

              {/* City Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#132238] dark:text-[#F1EADF] mb-1.5 flex items-center justify-between">
                    <span>{city.name}</span>
                    <MapPin className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#9FB0BF] line-clamp-2 leading-relaxed mb-4">
                    {city.description}
                  </p>
                </div>

                {/* Souvenirs Badges */}
                <div className="pt-3 border-t border-[#EADBCE]/50 dark:border-[#24384A]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#9FB0BF] font-semibold block mb-1.5 flex items-center gap-1">
                    <Gift className="w-3 h-3 text-[#F26A51]" />
                    سوغات معروف:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {city.souvenirs.slice(0, 2).map((souvenir, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#FAF6EF] dark:bg-[#1E3142] text-[11px] font-medium text-[#132238] dark:text-[#F1EADF] border border-[#EADBCE]/60 dark:border-[#24384A]"
                      >
                        {souvenir}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Window for Selected City Details */}
        {activeModalCity && (
          <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalCity(null)}
                aria-label="بستن پنجره"
                className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Image (4:3) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <SmartImage
                  src={`/images/${activeModalCity.id}.png`}
                  alt={activeModalCity.name}
                  aspectRatio="4/3"
                  loading="lazy"
                  fallbackType="city"
                  cityName={activeModalCity.name}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full rounded-t-3xl rounded-b-none"
                />
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-[#132238] dark:text-[#F1EADF]">
                    {activeModalCity.name}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 text-[#1FA3A3] dark:text-[#2EC4C1] font-bold text-xs">
                    استان {activeModalCity.province}
                  </span>
                </div>

                <p className="text-sm text-[#64748B] dark:text-[#9FB0BF] leading-relaxed mb-5">
                  {activeModalCity.description}
                </p>

                {/* Key Facts */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 rounded-2xl bg-[#FAF6EF] dark:bg-[#1E3142] flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                    <div>
                      <span className="text-[10px] text-[#64748B] dark:text-[#9FB0BF] block">جمعیت تقریبی</span>
                      <span className="text-xs font-bold text-[#132238] dark:text-[#F1EADF]">
                        {formatNumber(activeModalCity.population)} نفر
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF6EF] dark:bg-[#1E3142] flex items-center gap-2.5">
                    <Navigation className="w-4 h-4 text-[#F26A51] dark:text-[#FF7A5C]" />
                    <div>
                      <span className="text-[10px] text-[#64748B] dark:text-[#9FB0BF] block">دسترسی حمل‌ونقل</span>
                      <span className="text-xs font-bold text-[#132238] dark:text-[#F1EADF]">
                        {activeModalCity.hasAirport && activeModalCity.hasRailway
                          ? 'فرودگاه و راه‌آهن'
                          : activeModalCity.hasAirport
                          ? 'دارای فرودگاه'
                          : activeModalCity.hasRailway
                          ? 'دارای راه‌آهن'
                          : 'ترابری جاده‌ای'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attractions List */}
                <div className="mb-5">
                  <span className="text-xs font-bold text-[#132238] dark:text-[#F1EADF] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#F26A51]" />
                    <span>مهم‌ترین جاذبه‌های دیدنی:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeModalCity.attractions.map((attraction, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-[#FAF6EF] dark:bg-[#1E3142] text-xs font-medium text-[#132238] dark:text-[#F1EADF] border border-[#EADBCE]/70 dark:border-[#24384A]"
                      >
                        {attraction}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Souvenirs */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#132238] dark:text-[#F1EADF] flex items-center gap-1.5 mb-2">
                    <Gift className="w-3.5 h-3.5 text-[#1FA3A3]" />
                    <span>سوغات و صنایع دستی:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeModalCity.souvenirs.map((souvenir, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-[#FAF6EF] dark:bg-[#1E3142] text-xs font-medium text-[#132238] dark:text-[#F1EADF] border border-[#EADBCE]/70 dark:border-[#24384A]"
                      >
                        {souvenir}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA: این شهر را مقصد کن */}
                <button
                  type="button"
                  onClick={() => handleMakeDestination(activeModalCity)}
                  className="w-full py-3.5 rounded-2xl bg-[#F26A51] hover:bg-[#DE553C] dark:bg-[#FF7A5C] dark:hover:bg-[#FF8F75] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <MapPin className="w-4 h-4" />
                  <span>این شهر را مقصد کن</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
