import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Check, ChevronDown, MapPin } from 'lucide-react';
import { City } from '../types';

interface CitySelectorProps {
  label: string;
  selectedCity: City | null;
  onSelect: (city: City) => void;
  cities: City[];
  placeholder?: string;
  isOrigin?: boolean;
}

const POPULAR_CITY_IDS = ['tehran', 'isfahan', 'shiraz', 'mashhad', 'tabriz', 'yazd'];

export const CitySelector: React.FC<CitySelectorProps> = ({
  label,
  selectedCity,
  onSelect,
  cities,
  placeholder = 'انتخاب شهر',
  isOrigin = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openUpwards, setOpenUpwards] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Group and sort cities
  const sortedAndFilteredCities = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) {
      // Empty search: popular cities first, then others alphabetically
      const popular = POPULAR_CITY_IDS.map((id) => cities.find((c) => c.id === id)).filter(
        Boolean
      ) as City[];
      const others = cities
        .filter((c) => !POPULAR_CITY_IDS.includes(c.id))
        .sort((a, b) => a.name.localeCompare(b.name, 'fa'));

      return {
        popular,
        others,
        all: [...popular, ...others],
      };
    }

    const matches = cities.filter(
      (c) =>
        c.name.toLowerCase().includes(trimmed) ||
        c.province.toLowerCase().includes(trimmed)
    );

    return {
      popular: [],
      others: matches,
      all: matches,
    };
  }, [cities, search]);

  // Handle auto flip upwards when space below is tight
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 320 && spaceAbove > 320) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }

      setSearch('');
      setHighlightedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const total = sortedAndFilteredCities.all.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < total ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : total - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (total > 0 && sortedAndFilteredCities.all[highlightedIndex]) {
        onSelect(sortedAndFilteredCities.all[highlightedIndex]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Highlight matched search text
  const renderHighlightedName = (name: string, query: string) => {
    if (!query) return name;
    const parts = name.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-extrabold text-[#1FA3A3] underline decoration-[#1FA3A3]/40">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <div className="text-xs font-medium text-[#64748B] dark:text-[#9FB0BF] mb-1.5 flex items-center gap-1.5">
        <MapPin
          className={`w-3.5 h-3.5 ${
            isOrigin ? 'text-[#1FA3A3]' : 'text-[#F26A51]'
          }`}
        />
        <span>{label}</span>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full h-13 px-4 bg-[#FAF6EF] dark:bg-[#1E3142] hover:bg-[#F2EAE0] dark:hover:bg-[#253D52] border border-[#EADBCE]/80 dark:border-[#24384A] rounded-xl text-right flex items-center justify-between transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1FA3A3]/40"
      >
        <span
          className={`text-base font-semibold truncate ${
            selectedCity
              ? 'text-[#132238] dark:text-[#F1EADF]'
              : 'text-[#64748B] dark:text-[#9FB0BF]'
          }`}
        >
          {selectedCity ? selectedCity.name : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#64748B] dark:text-[#9FB0BF] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#1FA3A3]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu - z-index: 60 as required */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 min-w-[280px] z-60 bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-2xl shadow-xl overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
            openUpwards ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
          }`}
        >
          {/* Search Bar at Top */}
          <div className="p-2.5 border-b border-[#EADBCE]/60 dark:border-[#24384A]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#64748B] dark:text-[#9FB0BF] absolute right-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="جست‌وجوی شهر یا استان..."
                className="w-full h-10 pr-9 pl-3 text-sm rounded-xl bg-[#FAF6EF] dark:bg-[#1E3142] text-[#132238] dark:text-[#F1EADF] border-none focus:outline-none focus:ring-1 focus:ring-[#1FA3A3]/60 placeholder:text-[#64748B]/60 dark:placeholder:text-[#9FB0BF]/60"
              />
            </div>
          </div>

          {/* List Options */}
          <div
            ref={listRef}
            className="max-h-[260px] overflow-y-auto overflow-x-hidden p-1.5 scrollbar-thin"
            style={{ scrollbarWidth: 'thin' }}
          >
            {sortedAndFilteredCities.all.length === 0 ? (
              <div className="py-8 text-center text-sm text-[#64748B] dark:text-[#9FB0BF]">
                شهری پیدا نشد
              </div>
            ) : (
              <>
                {/* Popular section header if no search */}
                {!search.trim() && (
                  <div className="px-3 py-1.5 text-xs font-medium text-[#64748B]/80 dark:text-[#9FB0BF]/80 select-none">
                    شهرهای پرطرفدار
                  </div>
                )}

                {sortedAndFilteredCities.all.map((city, idx) => {
                  const isSelected = selectedCity?.id === city.id;
                  const isHighlighted = idx === highlightedIndex;
                  const isPopularSection = !search.trim() && idx < sortedAndFilteredCities.popular.length;
                  const showAlphabeticalHeader =
                    !search.trim() && idx === sortedAndFilteredCities.popular.length;

                  return (
                    <React.Fragment key={city.id}>
                      {showAlphabeticalHeader && (
                        <div className="px-3 pt-3 pb-1 text-xs font-medium text-[#64748B]/80 dark:text-[#9FB0BF]/80 border-t border-[#EADBCE]/40 dark:border-[#24384A]/60 select-none mt-1">
                          سایر شهرها (الفبا)
                        </div>
                      )}
                      <div
                        data-index={idx}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onSelect(city);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        style={{ animationDelay: `${Math.min(idx * 25, 200)}ms` }}
                        className={`h-[52px] px-3.5 rounded-xl flex items-center justify-between cursor-pointer transition-colors duration-150 select-none ${
                          isHighlighted
                            ? 'bg-[#F6EFE4] dark:bg-[#1E3142]'
                            : 'hover:bg-[#F6EFE4]/60 dark:hover:bg-[#1E3142]/60'
                        } ${isSelected ? 'text-[#1FA3A3] font-bold' : 'text-[#132238] dark:text-[#F1EADF]'}`}
                      >
                        {/* Right: City Name */}
                        <div className="flex items-center gap-2">
                          {isSelected && <Check className="w-4 h-4 text-[#1FA3A3] flex-shrink-0" />}
                          <span className={`text-sm ${isSelected ? 'text-[#1FA3A3] font-bold' : ''}`}>
                            {renderHighlightedName(city.name, search.trim())}
                          </span>
                        </div>

                        {/* Left: Province Name (without word استان) */}
                        <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] font-normal truncate max-w-[110px]">
                          {city.province}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
