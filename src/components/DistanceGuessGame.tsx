import React, { useState, useEffect } from 'react';
import { Gamepad2, Award, RotateCcw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { City } from '../types';
import { calculateAirDistance } from '../utils/calculations';
import { IranMap } from './IranMap';
import { formatNumber, toPersianDigits } from '../utils/persian';

interface DistanceGuessGameProps {
  cities: City[];
}

interface GameRound {
  cityA: City;
  cityB: City;
  actualDistanceKm: number;
}

export const DistanceGuessGame: React.FC<DistanceGuessGameProps> = ({ cities }) => {
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [guessKm, setGuessKm] = useState<number>(500);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Generate a random round
  const generateNewRound = () => {
    if (cities.length < 2) return;
    const idxA = Math.floor(Math.random() * cities.length);
    let idxB = Math.floor(Math.random() * cities.length);
    while (idxB === idxA) {
      idxB = Math.floor(Math.random() * cities.length);
    }

    const cityA = cities[idxA];
    const cityB = cities[idxB];
    const actualDistanceKm = calculateAirDistance(cityA.lat, cityA.lng, cityB.lat, cityB.lng);

    setCurrentRound({ cityA, cityB, actualDistanceKm });
    setGuessKm(500);
    setIsAnswerRevealed(false);
    setRoundScore(0);
  };

  useEffect(() => {
    if (cities.length >= 2 && !currentRound && !isGameOver) {
      generateNewRound();
    }
  }, [cities]);

  const handleSubmitGuess = () => {
    if (!currentRound) return;
    const actual = currentRound.actualDistanceKm;
    const errorPct = (Math.abs(guessKm - actual) / actual) * 100;
    // Score up to 1000 points
    const score = Math.max(0, Math.round(1000 * Math.max(0, 1 - errorPct / 100)));
    setRoundScore(score);
    setTotalScore((prev) => prev + score);
    setIsAnswerRevealed(true);
  };

  const handleNextRound = () => {
    if (roundNumber >= 5) {
      setIsGameOver(true);
    } else {
      setRoundNumber((prev) => prev + 1);
      generateNewRound();
    }
  };

  const handleRestartGame = () => {
    setRoundNumber(1);
    setTotalScore(0);
    setIsGameOver(false);
    setIsAnswerRevealed(false);
    generateNewRound();
  };

  const getRankTitle = (score: number) => {
    if (score >= 4200) return 'استاد بی‌بدیل جغرافیای ایران 🏆';
    if (score >= 3200) return 'ایران‌گرد با تجربه و مسلط 🚗';
    if (score >= 2000) return 'مسافر کنجکاو جاده‌ها 🎒';
    return 'گردشگر تازه‌کار (وقت سفر بیشتر است!) 🌱';
  };

  if (cities.length < 2) return null;

  return (
    <section id="game" className="py-8 lg:py-14 relative z-10 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Frame */}
        <div className="bg-white dark:bg-[#172634] border border-[#EADBCE] dark:border-[#24384A] rounded-3xl p-6 sm:p-8 shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#EADBCE]/60 dark:border-[#24384A] pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 text-[#1FA3A3] dark:text-[#2EC4C1] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#132238] dark:text-[#F1EADF]">
                  بازی: فاصله را حدس بزن!
                </h2>
                <span className="text-xs text-[#64748B] dark:text-[#9FB0BF]">
                  فاصله مستقیم هوایی بین دو شهر تصادفی را تخمین بزنید.
                </span>
              </div>
            </div>

            {/* Score & Round Counter */}
            {!isGameOver && (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-[#FAF6EF] dark:bg-[#1E3142] text-xs font-bold text-[#132238] dark:text-[#F1EADF] border border-[#EADBCE] dark:border-[#24384A]">
                  دور {toPersianDigits(roundNumber)} از ۵
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#1FA3A3]/10 dark:bg-[#2EC4C1]/15 text-xs font-bold text-[#1FA3A3] dark:text-[#2EC4C1]">
                  امتیاز: {formatNumber(totalScore)}
                </div>
              </div>
            )}
          </div>

          {/* Game Over Screen */}
          {isGameOver ? (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-18 h-18 rounded-3xl bg-[#F26A51]/10 dark:bg-[#FF7A5C]/15 text-[#F26A51] dark:text-[#FF7A5C] flex items-center justify-center mb-4">
                <Award className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-[#64748B] dark:text-[#9FB0BF] uppercase tracking-wider mb-1">
                پایان بازی ۵ دوره‌ای
              </span>
              <h3 className="text-3xl font-black text-[#132238] dark:text-[#F1EADF] mb-2">
                {getRankTitle(totalScore)}
              </h3>
              <div className="text-xl font-bold text-[#1FA3A3] dark:text-[#2EC4C1] mb-6">
                امتیاز نهایی: {formatNumber(totalScore)} از ۵٬۰۰۰
              </div>
              <button
                type="button"
                onClick={handleRestartGame}
                className="px-6 py-3 rounded-2xl bg-[#1FA3A3] hover:bg-[#198B8B] dark:bg-[#2EC4C1] dark:hover:bg-[#3BD4D1] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>دوباره بازی کن</span>
              </button>
            </div>
          ) : currentRound ? (
            <div>
              {/* Question: فاصله بین City A و City B چقدر است؟ */}
              <div className="text-center mb-6">
                <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                  فاصله هوایی بین این دو شهر چقدر است؟
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#132238] dark:text-[#F1EADF] flex items-center justify-center gap-3">
                  <span className="text-[#10B981]">{currentRound.cityA.name}</span>
                  <span className="text-[#64748B] text-lg font-normal">تا</span>
                  <span className="text-[#F26A51]">{currentRound.cityB.name}</span>
                </div>
              </div>

              {/* Slider for Guessing */}
              {!isAnswerRevealed ? (
                <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-5 sm:p-6 rounded-2xl border border-[#EADBCE]/70 dark:border-[#24384A] mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#64748B] dark:text-[#9FB0BF]">
                      حدس شما:
                    </span>
                    <div className="text-2xl font-black text-[#1FA3A3] dark:text-[#2EC4C1]">
                      {formatNumber(guessKm)}{' '}
                      <span className="text-xs font-normal text-[#64748B] dark:text-[#9FB0BF]">
                        کیلومتر
                      </span>
                    </div>
                  </div>

                  <input
                    aria-label="حدس فاصله"
                    type="range"
                    min={50}
                    max={2000}
                    step={25}
                    value={guessKm}
                    onChange={(e) => setGuessKm(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-[#EADBCE] dark:bg-[#24384A] rounded-lg appearance-none cursor-pointer accent-[#1FA3A3]"
                  />
                  <div className="flex justify-between text-[11px] text-[#64748B] dark:text-[#9FB0BF] mt-1.5">
                    <span>۵۰ کیلومتر</span>
                    <span>۱٬۰۰۰ کیلومتر</span>
                    <span>۲٬۰۰۰ کیلومتر</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitGuess}
                    className="w-full mt-5 py-3 rounded-xl bg-[#F26A51] hover:bg-[#DE553C] dark:bg-[#FF7A5C] dark:hover:bg-[#FF8F75] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    ثبت حدس
                  </button>
                </div>
              ) : (
                /* Revealed Answer State */
                <div className="flex flex-col gap-5 mb-6">
                  {/* Results badge */}
                  <div className="bg-[#FAF6EF] dark:bg-[#1E3142] p-5 rounded-2xl border border-[#EADBCE]/70 dark:border-[#24384A] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                        حدس شما
                      </span>
                      <span className="text-lg font-bold text-[#132238] dark:text-[#F1EADF]">
                        {formatNumber(guessKm)} کیلومتر
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                        فاصله واقعی
                      </span>
                      <span className="text-lg font-bold text-[#10B981]">
                        {formatNumber(currentRound.actualDistanceKm)} کیلومتر
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[#64748B] dark:text-[#9FB0BF] block mb-1">
                        امتیاز این دور
                      </span>
                      <span className="text-xl font-black text-[#F26A51] dark:text-[#FF7A5C]">
                        +{formatNumber(roundScore)}
                      </span>
                    </div>
                  </div>

                  {/* Mini Map showing the two cities and line */}
                  <IranMap
                    origin={currentRound.cityA}
                    dest={currentRound.cityB}
                    routeCoordinates={[
                      [currentRound.cityA.lat, currentRound.cityA.lng],
                      [currentRound.cityB.lat, currentRound.cityB.lng],
                    ]}
                    isEstimated={true}
                    interactiveCities={false}
                    zoomControl={false}
                    className="h-[240px] w-full"
                  />

                  {/* Next Round Button */}
                  <button
                    type="button"
                    onClick={handleNextRound}
                    className="w-full py-3.5 rounded-xl bg-[#1FA3A3] hover:bg-[#198B8B] dark:bg-[#2EC4C1] dark:hover:bg-[#3BD4D1] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{roundNumber >= 5 ? 'مشاهده نتیجه نهایی' : 'دور بعدی'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : null}

        </div>

      </div>
    </section>
  );
};
