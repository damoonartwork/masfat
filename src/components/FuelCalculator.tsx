import React, { useState } from 'react';
import { Fuel, Info } from 'lucide-react';
import { City } from '../types';
import { SmartImage } from './SmartImage';
import { formatCurrency, formatNumber, toPersianDigits } from '../utils/persian';

interface FuelCalculatorProps {
  origin: City | null;
  dest: City | null;
  roadDistanceKm: number;
}

export const FuelCalculator: React.FC<FuelCalculatorProps> = ({
  origin,
  dest,
  roadDistanceKm,
}) => {
  const [consumption, setConsumption] = useState<number>(8); // L / 100km
  const [pricePerLiter, setPricePerLiter] = useState<number>(3000); // Tomans

  const safeDistance = roadDistanceKm > 0 ? roadDistanceKm : 400;
  const totalLiters = (safeDistance * consumption) / 100;
  const totalCost = Math.round(totalLiters * pricePerLiter);

  return (
    <section id="fuel-calculator" className="py-8 lg:py-14 relative z-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#F26A51] dark:text-[#FF7A5C] tracking-wider uppercase mb-2 block">
            برآورد مالی سفر جاده‌ای
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#132238] dark:text-[#F1EADF] mb-3">
            ماشین‌حساب هوشمند هزینه سوخت
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] dark:text-[#9FB0BF] max-w-xl mx-auto">
            {origin && dest && origin.id !== dest.id
              ? `محاسبه هزینه بنزین مسیر ${origin.name} به ${dest.name} (${formatNumber(safeDistance)} کیلومتر)`
              : 'محاسبه هزینه بنزین بر اساس مصرف خودرو و قیمت روز سوخت'}
          </p>
        </div>

        {/* Two-Sided Main Card */}
        <div className="bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Side 1: Sliders & Manual Inputs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Control 1: Consumption (L / 100km) */}
              <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-5 rounded-2xl border border-[#EADBCE]/70 dark:border-[#24384A]">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="fuel-consumption-input" className="text-sm font-bold text-[#132238] dark:text-[#F1EADF] flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                    <span>مصرف سوخت خودرو (لیتر در ۱۰۰ کیلومتر)</span>
                  </label>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-[#172634] px-3 py-1.5 rounded-xl border border-[#EADBCE] dark:border-[#24384A]">
                    <input
                      id="fuel-consumption-input"
                      type="number"
                      min={3}
                      max={25}
                      step={0.5}
                      value={consumption}
                      onChange={(e) => setConsumption(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-14 text-center font-bold text-[#132238] dark:text-[#F1EADF] text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#64748B] dark:text-[#9FB0BF]">L</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  id="fuel-consumption-slider"
                  aria-label="اسلایدر مصرف سوخت خودرو"
                  type="range"
                  min={4}
                  max={20}
                  step={0.5}
                  value={consumption}
                  onChange={(e) => setConsumption(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#EADBCE] dark:bg-[#24384A] rounded-lg appearance-none cursor-pointer accent-[#1FA3A3]"
                />
                <div className="flex justify-between text-[11px] text-[#64748B] dark:text-[#9FB0BF] mt-1.5">
                  <span>کم‌مصرف (۴ لیتر)</span>
                  <span>متوسط (۸ لیتر)</span>
                  <span>پرمصرف (۲۰ لیتر)</span>
                </div>
              </div>

              {/* Control 2: Price Per Liter (Tomans) */}
              <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-5 rounded-2xl border border-[#EADBCE]/70 dark:border-[#24384A]">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="fuel-price-input" className="text-sm font-bold text-[#132238] dark:text-[#F1EADF]">
                    قیمت هر لیتر بنزین (تومان)
                  </label>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-[#172634] px-3 py-1.5 rounded-xl border border-[#EADBCE] dark:border-[#24384A]">
                    <input
                      id="fuel-price-input"
                      type="number"
                      min={1000}
                      max={20000}
                      step={500}
                      value={pricePerLiter}
                      onChange={(e) => setPricePerLiter(Math.max(500, parseInt(e.target.value, 10) || 0))}
                      className="w-20 text-center font-bold text-[#132238] dark:text-[#F1EADF] text-base focus:outline-none"
                    />
                    <span className="text-xs text-[#64748B] dark:text-[#9FB0BF]">تومان</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  id="fuel-price-slider"
                  aria-label="اسلایدر قیمت هر لیتر بنزین"
                  type="range"
                  min={1500}
                  max={15000}
                  step={500}
                  value={pricePerLiter}
                  onChange={(e) => setPricePerLiter(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#EADBCE] dark:bg-[#24384A] rounded-lg appearance-none cursor-pointer accent-[#F26A51]"
                />
                <div className="flex justify-between text-[11px] text-[#64748B] dark:text-[#9FB0BF] mt-1.5">
                  <span>۱٬۵۰۰ (سهمیه‌ای)</span>
                  <span>۳٬۰۰۰ (آزاد)</span>
                  <span>۱۵٬۰۰۰ (سوپر/آزاد ویژه)</span>
                </div>
              </div>

              {/* Small Note: قیمت بنزین را با نرخ روز وارد کنید */}
              <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#9FB0BF] bg-[#FAF6EF]/70 dark:bg-[#1E3142]/70 p-3 rounded-xl border border-[#EADBCE]/50 dark:border-[#24384A]">
                <Info className="w-4 h-4 text-[#F26A51] dark:text-[#FF7A5C] flex-shrink-0" />
                <span>قیمت بنزین را با نرخ روز وارد کنید.</span>
              </div>
            </div>

            {/* Side 2: Pump Image (1:1, 160px desktop, 120px mobile) + Big Total Result (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF6EF] to-[#F2EAE0] dark:from-[#1E3142] dark:to-[#172634] p-6 sm:p-8 rounded-3xl border border-[#EADBCE] dark:border-[#24384A] flex flex-col items-center text-center shadow-inner">
              
              {/* Pump Image (160px square, 120px mobile, cover, no white frame) */}
              <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-2xl overflow-hidden mb-6 shadow-md">
                <SmartImage
                  src="/images/pump.png"
                  alt="ماشین‌حساب سوخت"
                  aspectRatio="1/1"
                  loading="lazy"
                  fallbackType="pump"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full rounded-2xl"
                />
              </div>

              <span className="text-xs font-bold text-[#64748B] dark:text-[#9FB0BF] uppercase tracking-wider mb-1">
                مجموع هزینه تخمینی سوخت
              </span>

              {/* Big Tomans Amount */}
              <div className="text-3xl sm:text-4xl font-black text-[#F26A51] dark:text-[#FF7A5C] my-2">
                {formatCurrency(totalCost)}
              </div>

              {/* Total Fuel in Liters */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#172634]/80 border border-[#EADBCE] dark:border-[#24384A] text-xs font-bold text-[#132238] dark:text-[#F1EADF] shadow-sm mt-2">
                <Fuel className="w-3.5 h-3.5 text-[#1FA3A3] dark:text-[#2EC4C1]" />
                <span>کل سوخت مصرفی: {toPersianDigits(totalLiters.toFixed(1))} لیتر</span>
              </div>

              <div className="text-[11px] text-[#64748B] dark:text-[#9FB0BF] mt-4">
                مسافت محاسبه‌شده: {formatNumber(safeDistance)} کیلومتر
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
