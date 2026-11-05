export const heroMapCalibration = {
  lngMin: 44.0,
  lngMax: 63.5,
  latMin: 25.0,
  latMax: 40.0,
  xMinPercent: 8,
  xMaxPercent: 90,
  yMinPercent: 12,
  yMaxPercent: 90,
};

// Calibrated 3D isometric anchor coordinates for key geographic landmarks on hero2 3D relief map
const HERO_3D_ANCHORS = [
  { id: 'tehran', lat: 35.6892, lng: 51.3890, x: 52.2, y: 25.2 }, // Milad tower & capital
  { id: 'mashhad', lat: 36.2605, lng: 59.6168, x: 81.0, y: 39.0 }, // Dome & minarets (Khorasan)
  { id: 'tabriz', lat: 38.0962, lng: 46.2738, x: 14.0, y: 20.5 }, // NW castle (Azarbaijan)
  { id: 'shiraz', lat: 29.5918, lng: 52.5837, x: 53.5, y: 46.5 }, // Persepolis (Fars)
  { id: 'isfahan', lat: 32.6546, lng: 51.6680, x: 48.5, y: 36.5 }, // Central plateau
  { id: 'ahvaz', lat: 31.3183, lng: 48.6706, x: 21.0, y: 48.0 }, // Khuzestan plains
  { id: 'bandar-abbas', lat: 27.1832, lng: 56.2666, x: 55.0, y: 75.5 }, // Strait of Hormuz port
  { id: 'chabahar', lat: 25.2919, lng: 60.6430, x: 75.0, y: 87.0 }, // Sea of Oman coast
  { id: 'yazd', lat: 31.8974, lng: 54.3569, x: 60.0, y: 44.5 }, // Desert edge
  { id: 'rasht', lat: 37.2809, lng: 49.5924, x: 38.0, y: 21.0 }, // Gilan / SW Caspian
  { id: 'kerman', lat: 30.2839, lng: 57.0834, x: 69.0, y: 54.0 }, // Kerman
  { id: 'zahedan', lat: 29.4963, lng: 60.8629, x: 85.0, y: 68.0 }, // SE highlands
  { id: 'bushehr', lat: 28.9234, lng: 50.8203, x: 32.0, y: 63.0 }, // Persian Gulf shore
  { id: 'qazvin', lat: 36.2797, lng: 50.0049, x: 42.0, y: 24.0 },
  { id: 'kashan', lat: 33.9850, lng: 51.4100, x: 50.0, y: 31.0 },
  { id: 'kish', lat: 26.5325, lng: 54.0194, x: 40.0, y: 78.0 }, // Persian Gulf island
  { id: 'qeshm', lat: 26.9584, lng: 56.2719, x: 53.0, y: 79.0 }, // Qeshm island
  { id: 'kermanshah', lat: 34.3142, lng: 47.0650, x: 20.0, y: 32.0 }, // Zagros slopes
  { id: 'hamedan', lat: 34.7989, lng: 48.5150, x: 29.0, y: 28.5 }, // Alvand
  { id: 'sanandaj', lat: 35.3113, lng: 46.9960, x: 20.0, y: 27.0 },
  { id: 'urmia', lat: 37.5527, lng: 45.0761, x: 9.0, y: 22.0 },
  { id: 'ardabil', lat: 38.2498, lng: 48.2933, x: 27.0, y: 17.0 },
  { id: 'sari', lat: 36.5659, lng: 53.0586, x: 59.0, y: 23.0 }, // Mazandaran
  { id: 'gorgan', lat: 36.8427, lng: 54.4439, x: 67.0, y: 24.5 }, // Golestan
  { id: 'birjand', lat: 32.8663, lng: 59.2211, x: 82.0, y: 52.0 },
  { id: 'semnan', lat: 35.5729, lng: 53.3971, x: 62.0, y: 29.0 },
  { id: 'qom', lat: 34.6399, lng: 50.8759, x: 48.0, y: 29.5 },
  { id: 'arak', lat: 34.0954, lng: 49.7013, x: 38.0, y: 33.0 },
  { id: 'khorramabad', lat: 33.4878, lng: 48.3558, x: 28.0, y: 38.0 },
  { id: 'ilam', lat: 33.6374, lng: 46.4227, x: 17.0, y: 38.0 },
  { id: 'shahrekord', lat: 32.3256, lng: 50.8644, x: 42.0, y: 40.0 },
  { id: 'yasuj', lat: 30.6684, lng: 51.5876, x: 46.0, y: 49.0 },
  { id: 'bojnord', lat: 37.4747, lng: 57.3290, x: 74.0, y: 27.0 },
  { id: 'zanjan', lat: 36.6736, lng: 48.4787, x: 31.0, y: 22.0 },
  { id: 'ramsar', lat: 36.9174, lng: 50.6432, x: 44.0, y: 21.5 },
  { id: 'lahijan', lat: 37.2072, lng: 50.0031, x: 41.0, y: 21.0 },
  { id: 'bandar-anzali', lat: 37.4727, lng: 49.4622, x: 36.0, y: 20.0 },
  { id: 'neyshabur', lat: 36.2133, lng: 58.7958, x: 76.0, y: 36.0 },
  { id: 'shushtar', lat: 32.0455, lng: 48.8567, x: 24.0, y: 44.0 },
  { id: 'dezful', lat: 32.3811, lng: 48.4058, x: 22.0, y: 42.0 },
  { id: 'abadan', lat: 30.3392, lng: 48.3043, x: 19.0, y: 53.0 },
  { id: 'baneh', lat: 35.9975, lng: 45.8853, x: 14.0, y: 24.0 },
  { id: 'maragheh', lat: 37.3921, lng: 46.2392, x: 15.0, y: 22.0 },
  { id: 'mahabad', lat: 36.7631, lng: 45.7222, x: 12.0, y: 23.5 },
  { id: 'shahroud', lat: 36.4182, lng: 54.9763, x: 67.0, y: 30.0 },
  { id: 'tabas', lat: 33.5959, lng: 56.9244, x: 71.0, y: 45.0 },
  { id: 'borujerd', lat: 33.8973, lng: 48.7516, x: 30.0, y: 35.0 },
  { id: 'saveh', lat: 35.0213, lng: 50.3566, x: 45.0, y: 27.5 },
  { id: 'babolsar', lat: 36.7024, lng: 52.6577, x: 55.0, y: 22.0 },
  { id: 'nowshahr', lat: 36.6496, lng: 51.4960, x: 49.0, y: 22.5 },
];

export function cityToHeroPosition(lat: number, lng: number, cityId?: string): { x: number; y: number } {
  // 1. Direct anchor match
  if (cityId) {
    const direct = HERO_3D_ANCHORS.find((a) => a.id === cityId);
    if (direct) {
      return { x: direct.x, y: direct.y };
    }
  }

  const directByCoord = HERO_3D_ANCHORS.find(
    (a) => Math.hypot(lat - a.lat, lng - a.lng) < 0.05
  );
  if (directByCoord) {
    return { x: directByCoord.x, y: directByCoord.y };
  }

  // 2. Inverse Distance Weighting (IDW) interpolation
  let sumWeight = 0;
  let sumX = 0;
  let sumY = 0;
  const power = 2.5;

  for (const anchor of HERO_3D_ANCHORS) {
    const dist = Math.hypot(lat - anchor.lat, lng - anchor.lng);
    const weight = 1 / Math.pow(Math.max(dist, 0.01), power);
    sumWeight += weight;
    sumX += weight * anchor.x;
    sumY += weight * anchor.y;
  }

  const x = Math.min(Math.max(sumX / sumWeight, 6), 94);
  const y = Math.min(Math.max(sumY / sumWeight, 10), 92);

  return { x, y };
}
