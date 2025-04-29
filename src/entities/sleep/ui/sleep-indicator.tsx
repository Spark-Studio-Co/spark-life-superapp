"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Props {
  initialHours: number;
  goalHours: number;
}

export function SleepCircleIndicator({ initialHours, goalHours }: Props) {
  const [hours, setHours] = useState(initialHours);
  const percentage = Math.min((hours / goalHours) * 100, 100);

  const moonCount = 8;
  const angleStep = 360 / moonCount;

  const addHour = () => {
    setHours((prev) => Math.min(prev + 1, goalHours));
  };

  const reset = () => {
    setHours(0);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl px-6 py-8 w-72 transition-all duration-300 hover:shadow-2xl">
      <h3 className="text-center text-lg font-semibold text-purple-600 mb-4">🌙 Трекер сна</h3>

      <div className="relative w-56 h-56 mx-auto">
        {/* Маленькие луны по кругу */}
        {[...Array(moonCount)].map((_, i) => {
          const angle = i * angleStep - 90; // смещение на -90 чтобы начать сверху
          const radius = 100; // чуть меньше чтобы иконки не выходили
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{ opacity: percentage >= (i / moonCount) * 100 ? 1 : 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                top: `calc(50% + ${y}px - 8px)`,
                left: `calc(50% + ${x}px - 8px)`,
                transform: `rotate(${angle + 90}deg)`, // поворот в нужную сторону
              }}
            >
              <Moon className={`w-4 h-4 ${percentage >= (i / moonCount) * 100 ? 'text-purple-500' : 'text-purple-200'}`} />
            </motion.div>
          );
        })}

        {/* Прогресс */}
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="90"
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 90}
            strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 90}
            initial={{ strokeDashoffset: 2 * Math.PI * 90 }}
            animate={{ strokeDashoffset: (1 - percentage / 100) * 2 * Math.PI * 90 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            transform="rotate(-90 140 140)"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Часы */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p 
            className="text-4xl font-bold text-gray-800"
            key={hours} // Для анимации при изменении
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {hours}
          </motion.p>
          <p className="text-gray-500 text-sm">/ {goalHours} ч</p>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 mt-6">
        <Button 
          onClick={addHour} 
          className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-300"
          disabled={hours >= goalHours}
        >
          + Добавить 1ч
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          className="w-12 p-0 border-purple-200 text-purple-500 hover:bg-purple-50 transition-all duration-300"
          disabled={hours === 0}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}