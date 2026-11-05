import React from 'react';
import { MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="relative z-10 bg-[#132238] dark:bg-[#0A131B] text-[#F1EADF] pt-12 pb-8 border-t border-[#24384A]"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1.4px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Description (6 cols) */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1FA3A3]/20 flex items-center justify-center text-[#2EC4C1]">
                <MapPin className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                سفرنامه <span className="text-[#2EC4C1]">ایران</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9FB0BF] leading-relaxed max-w-md mb-4">
              سامانه هوشمند و تعاملی محاسبه دقیق مسافت، زمان سفر و برآورد هزینه سوخت خودرو بین شهرهای ایران به همراه راهنمای جامع جاذبه‌های گردشگری.
            </p>
            <div className="text-xs text-[#2EC4C1] font-medium">
              نقشه: © OpenStreetMap — مسیریابی: OSRM
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-white mb-3">دسترسی سریع</h4>
            <ul className="flex flex-col gap-2 text-xs text-[#9FB0BF]">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#calculator')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  محاسبه مسیر و مسافت
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#travel-modes')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  مقایسه روش‌های سفر
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#fuel-calculator')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  ماشین‌حساب هزینه بنزین
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#multistop')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  برنامه‌ریزی سفر چندمقصدی
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Exploration & Note (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-white mb-3">گردشگری و بازی</h4>
            <ul className="flex flex-col gap-2 text-xs text-[#9FB0BF]">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#cities')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  معرفی و سوغات شهرها
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('#game')}
                  className="hover:text-[#2EC4C1] transition-colors cursor-pointer"
                >
                  بازی حدس فاصله هوایی
                </button>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#9FB0BF]">
              توجه: فاصله‌ها و زمان‌ها تقریبی هستند و ممکن است با توجه به شرایط آب‌وهوایی و ترافیک جاده متغیر باشند.
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9FB0BF]">
          <div>
            ساخته شده با <Heart className="w-3.5 h-3.5 inline text-[#FF7A5C] mx-0.5" /> برای گردشگران و عاشقان ایران‌زمین.
          </div>
          <div>
            © ۱۴۰۳ سفرنامه ایران. تمامی حقوق محفوظ است.
          </div>
        </div>
      </div>
    </footer>
  );
};
