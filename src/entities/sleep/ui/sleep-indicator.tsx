"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SleepGoalCelebration } from "./sleep-goal-celebration";

interface SleepCircleIndicatorProps {
  initialHours?: number;
  goalHours?: number;
}

export function SleepCircleIndicator({
  initialHours = 0,
  goalHours = 8,
}: SleepCircleIndicatorProps) {
  const [sleepHours, setSleepHours] = useState(initialHours);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate percentage of goal reached
  const percentage = Math.min((sleepHours / goalHours) * 100, 100);

  // Circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Add sleep hours
  const addSleepHours = (hours: number) => {
    setIsAnimating(true);

    // Animate the addition of sleep hours
    const targetHours = Math.min(sleepHours + hours, goalHours);
    let current = sleepHours;
    const step = hours / 20; // Divide the animation into 20 steps

    const interval = setInterval(() => {
      current = Math.min(current + step, targetHours);
      setSleepHours(Number(current.toFixed(1)));

      if (current >= targetHours) {
        clearInterval(interval);
        setIsAnimating(false);

        // Show celebration if goal reached
        if (targetHours >= goalHours && sleepHours < goalHours) {
          setTimeout(() => setShowCelebration(true), 500);
        }
      }
    }, 50);
  };

  // Reset sleep hours
  const resetSleepHours = () => {
    setSleepHours(0);
  };

  // Close celebration modal
  const closeCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6 text-purple-700 flex items-center gap-2">
        <Moon className="h-5 w-5" />
        Трекер сна
      </h2>

      <div className="relative w-64 h-64 mb-6">
        {/* Background circle with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-50 to-indigo-50"></div>

        {/* SVG Circle */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />

          {/* Progress circle with gradient */}
          <defs>
            <linearGradient
              id="sleepGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            fill="none"
            stroke="url(#sleepGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            transform="rotate(-90 128 128)"
          />

          {/* Sleep icons around the circle */}
          <g className="sleep-icons">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
              const isActive = (index / 8) * 100 <= percentage;
              const x = 128 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 128 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <motion.g
                  key={angle}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    scale: isActive ? 1 : 0.8,
                  }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {index % 2 === 0 ? (
                    <Moon
                      x={x - 10}
                      y={y - 10}
                      className={`w-5 h-5 ${
                        isActive ? "text-purple-500" : "text-gray-300"
                      }`}
                    />
                  ) : (
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill={isActive ? "#8b5cf6" : "#cbd5e1"}
                    />
                  )}
                </motion.g>
              );
            })}
          </g>

          {/* Center text */}
          <text
            x="128"
            y="118"
            textAnchor="middle"
            fontSize="36"
            fontWeight="bold"
            fill="#1e293b"
          >
            {sleepHours}
          </text>
          <text
            x="128"
            y="148"
            textAnchor="middle"
            fontSize="18"
            fill="#64748b"
          >
            / {goalHours} ч
          </text>
        </svg>

        {/* Animated stars */}
        <AnimatePresence>
          {isAnimating && (
            <>
              {[...Array(5)].map((_, i) => {
                const randomX = Math.random() * 200 + 28;
                const randomY = Math.random() * 200 + 28;
                const randomDelay = Math.random() * 0.5;
                const randomDuration = 0.5 + Math.random() * 1;

                return (
                  <motion.div
                    key={`star-${i}`}
                    className="absolute z-20"
                    style={{ left: randomX, top: randomY }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [0, -20, -40],
                    }}
                    transition={{
                      delay: randomDelay,
                      duration: randomDuration,
                      times: [0, 0.5, 1],
                    }}
                  >
                    <Moon className="text-purple-300 h-3 w-3" />
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mb-4">
        <Button
          onClick={() => addSleepHours(1)}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          disabled={sleepHours >= goalHours || isAnimating}
        >
          <Plus className="h-4 w-4" />
          Добавить 1ч
        </Button>

        <Button
          onClick={resetSleepHours}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
          disabled={sleepHours === 0 || isAnimating}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Goal reached celebration */}
      <SleepGoalCelebration
        isOpen={showCelebration}
        onClose={closeCelebration}
        hours={sleepHours}
      />
    </div>
  );
}
