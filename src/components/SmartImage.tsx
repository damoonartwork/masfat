import React, { useState, useEffect } from 'react';

export interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: '16/9' | '3/2' | '4/3' | '1/1' | string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  fallbackType?: 'hero' | 'car' | 'bus' | 'train' | 'airplane' | 'pump' | 'city';
  cityName?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = '3/2',
  loading = 'lazy',
  fetchPriority,
  fallbackType = 'city',
  cityName,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleImageError = () => {
    if (currentSrc.endsWith('.png')) {
      setCurrentSrc(currentSrc.replace('.png', '.jpg'));
    } else {
      setHasError(true);
    }
  };

  // Map aspect ratio string to tailwind style
  const aspectStyle = {
    aspectRatio: aspectRatio.replace('/', ' / '),
  };

  const renderFallbackSvg = () => {
    switch (fallbackType) {
      case 'hero':
        return (
          <svg
            viewBox="0 0 800 450"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="800" height="450" fill="#F6EFE4" />
            <path
              d="M0 320 Q200 240 400 300 T800 220 L800 450 L0 450 Z"
              fill="#1FA3A3"
              opacity="0.3"
            />
            <path
              d="M0 360 Q250 280 500 340 T800 290 L800 450 L0 450 Z"
              fill="#132238"
              opacity="0.15"
            />
            {/* Winding road */}
            <path
              d="M80 450 Q300 320 480 280 T750 180"
              stroke="#F26A51"
              strokeWidth="8"
              strokeDasharray="16 10"
              fill="none"
              strokeLinecap="round"
            />
            {/* Mountain peaks */}
            <polygon points="180,260 270,120 360,260" fill="#132238" opacity="0.25" />
            <polygon points="320,280 440,90 560,280" fill="#132238" opacity="0.4" />
            <polygon points="415,130 440,90 465,130" fill="#FFFFFF" opacity="0.8" />
            <circle cx="680" cy="90" r="42" fill="#F26A51" opacity="0.75" />
            <text
              x="400"
              y="400"
              textAnchor="middle"
              fill="#132238"
              fontSize="24"
              fontWeight="bold"
              fontFamily="Vazirmatn, sans-serif"
            >
              سفرنامه ایران · نقشه راه‌های کشور
            </text>
          </svg>
        );

      case 'car':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#FAF6EF" />
            <rect x="0" y="270" width="600" height="130" fill="#132238" opacity="0.08" />
            <g transform="translate(130, 110)">
              <path
                d="M40 130 C40 90, 80 50, 140 40 L210 40 C240 10, 270 10, 310 40 L340 70 C360 80, 370 100, 370 130 L40 130 Z"
                fill="#1FA3A3"
              />
              <path d="M140 48 L210 48 L200 80 L130 80 Z" fill="#F6EFE4" />
              <path d="M225 48 L295 48 L315 80 L220 80 Z" fill="#F6EFE4" />
              <circle cx="100" cy="135" r="34" fill="#132238" />
              <circle cx="100" cy="135" r="16" fill="#F6EFE4" />
              <circle cx="300" cy="135" r="34" fill="#132238" />
              <circle cx="300" cy="135" r="16" fill="#F6EFE4" />
              <circle cx="355" cy="95" r="8" fill="#F26A51" />
            </g>
          </svg>
        );

      case 'bus':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#FAF6EF" />
            <rect x="0" y="270" width="600" height="130" fill="#132238" opacity="0.08" />
            <g transform="translate(100, 90)">
              <rect x="30" y="30" width="360" height="130" rx="20" fill="#1FA3A3" />
              <rect x="60" y="50" width="50" height="40" rx="6" fill="#F6EFE4" />
              <rect x="125" y="50" width="50" height="40" rx="6" fill="#F6EFE4" />
              <rect x="190" y="50" width="50" height="40" rx="6" fill="#F6EFE4" />
              <rect x="255" y="50" width="50" height="40" rx="6" fill="#F6EFE4" />
              <rect x="320" y="45" width="55" height="60" rx="8" fill="#F6EFE4" />
              <rect x="30" y="115" width="360" height="10" fill="#F26A51" />
              <circle cx="110" cy="165" r="30" fill="#132238" />
              <circle cx="110" cy="165" r="14" fill="#F6EFE4" />
              <circle cx="320" cy="165" r="30" fill="#132238" />
              <circle cx="320" cy="165" r="14" fill="#F6EFE4" />
            </g>
          </svg>
        );

      case 'train':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#FAF6EF" />
            <rect x="0" y="270" width="600" height="130" fill="#132238" opacity="0.08" />
            <g transform="translate(90, 80)">
              <path
                d="M40 60 C120 60, 320 60, 380 90 C420 110, 430 140, 430 160 L40 160 Z"
                fill="#F26A51"
              />
              <path d="M70 75 L340 75 L380 115 L70 115 Z" fill="#132238" />
              <rect x="90" y="85" width="45" height="22" rx="4" fill="#1FA3A3" />
              <rect x="150" y="85" width="45" height="22" rx="4" fill="#1FA3A3" />
              <rect x="210" y="85" width="45" height="22" rx="4" fill="#1FA3A3" />
              <line x1="20" y1="175" x2="440" y2="175" stroke="#132238" strokeWidth="6" />
              <line x1="20" y1="185" x2="440" y2="185" stroke="#64748B" strokeWidth="4" />
            </g>
          </svg>
        );

      case 'airplane':
        return (
          <svg viewBox="0 0 600 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#FAF6EF" />
            <g transform="translate(130, 80)">
              <circle cx="170" cy="120" r="90" fill="#1FA3A3" opacity="0.12" />
              <path
                d="M50 160 L140 140 L190 60 L220 60 L190 130 L280 120 L310 90 L330 90 L320 125 C345 125, 360 135, 360 140 C360 145, 345 155, 320 155 L60 180 Z"
                fill="#1FA3A3"
              />
              <path
                d="M170 145 L200 210 L170 210 L130 150 Z"
                fill="#132238"
                opacity="0.8"
              />
              <circle cx="330" cy="140" r="5" fill="#F26A51" />
            </g>
          </svg>
        );

      case 'pump':
        return (
          <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="#FAF6EF" />
            <g transform="translate(90, 70)">
              <rect x="40" y="30" width="140" height="220" rx="18" fill="#F26A51" />
              <rect x="60" y="60" width="100" height="65" rx="8" fill="#132238" />
              <circle cx="110" cy="92" r="16" fill="#1FA3A3" opacity="0.8" />
              <path
                d="M180 100 C210 100, 220 160, 210 210 C205 235, 190 230, 190 200 L190 170"
                stroke="#132238"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              <polygon points="185,160 195,160 205,130 185,130" fill="#1FA3A3" />
            </g>
          </svg>
        );

      case 'city':
      default:
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#FAF6EF" />
            <path
              d="M0 240 L400 240 L400 300 L0 300 Z"
              fill="#132238"
              opacity="0.08"
            />
            <path
              d="M130 240 C130 150, 200 90, 200 90 C200 90, 270 150, 270 240 Z"
              fill="#1FA3A3"
            />
            <path
              d="M160 240 C160 170, 200 120, 200 120 C200 120, 240 170, 240 240 Z"
              fill="#F6EFE4"
              opacity="0.25"
            />
            <rect x="90" y="80" width="22" height="160" rx="4" fill="#F26A51" />
            <polygon points="90,80 101,55 112,80" fill="#132238" />
            <rect x="288" y="80" width="22" height="160" rx="4" fill="#F26A51" />
            <polygon points="288,80 299,55 310,80" fill="#132238" />
            {cityName && (
              <text
                x="200"
                y="275"
                textAnchor="middle"
                fill="#132238"
                fontSize="18"
                fontWeight="bold"
                fontFamily="Vazirmatn, sans-serif"
              >
                {cityName}
              </text>
            )}
          </svg>
        );
    }
  };

  return (
    <div
      style={aspectStyle}
      className={`relative overflow-hidden rounded-2xl ${containerClassName}`}
    >
      {!hasError ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={handleImageError}
          className={className}
        />
      ) : (
        renderFallbackSvg()
      )}
    </div>
  );
};
