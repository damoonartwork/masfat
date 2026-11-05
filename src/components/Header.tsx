import React, { useState } from 'react';
import { MapPin, Sun, Moon, Menu, X, Compass } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'محاسبه مسیر', href: '#calculator' },
    { label: 'روش سفر', href: '#travel-modes' },
    { label: 'سفر چندمقصدی', href: '#multistop' },
    { label: 'شهرها', href: '#cities' },
    { label: 'بازی', href: '#game' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F6EFE4]/85 dark:bg-[#0F1A24]/85 border-b border-[#EADBCE]/60 dark:border-[#24384A]/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Right: Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-[#132238] dark:text-[#F1EADF] group no-underline select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 flex items-center justify-center text-[#1FA3A3] dark:text-[#2EC4C1] group-hover:scale-105 transition-transform duration-200">
            <MapPin className="w-6 h-6 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight flex items-center gap-1">
              سفرنامه <span className="text-[#1FA3A3] dark:text-[#2EC4C1]">ایران</span>
            </span>
            <span className="text-[10px] text-[#64748B] dark:text-[#9FB0BF] -mt-1 font-medium">
              محاسبه مسافت و سوخت بین‌شهری
            </span>
          </div>
        </a>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="px-3.5 py-2 text-sm font-medium text-[#132238] dark:text-[#F1EADF] hover:text-[#1FA3A3] dark:hover:text-[#2EC4C1] hover:bg-[#FAF6EF] dark:hover:bg-[#1E3142] rounded-xl transition-all duration-150 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Left: Actions (Theme Toggle & CTA) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت شب'}
            className="w-10 h-10 rounded-xl bg-white/80 dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] text-[#132238] dark:text-[#F1EADF] flex items-center justify-center hover:bg-white dark:hover:bg-[#1E3142] transition-colors duration-200 shadow-sm cursor-pointer group"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-[#FF7A5C] group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-[#132238] group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* CTA Button: شروع سفر */}
          <button
            onClick={() => handleLinkClick('#calculator')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#F26A51] hover:bg-[#DE553C] dark:bg-[#FF7A5C] dark:hover:bg-[#FF8F75] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>شروع سفر</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="منوی موبایل"
            className="md:hidden w-10 h-10 rounded-xl bg-white/80 dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] text-[#132238] dark:text-[#F1EADF] flex items-center justify-center cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 bg-[#FAF6EF] dark:bg-[#172634] border-b border-[#EADBCE] dark:border-[#24384A] animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className="w-full text-right px-4 py-3 text-base font-semibold text-[#132238] dark:text-[#F1EADF] hover:bg-[#F6EFE4] dark:hover:bg-[#1E3142] rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => handleLinkClick('#calculator')}
                className="w-full py-3 bg-[#F26A51] text-white font-bold rounded-xl text-center shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>شروع سفر جدید</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
