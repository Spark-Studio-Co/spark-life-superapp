"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GoalReachedCelebration } from "./goal-reached-button";

interface HydrationBottleProps {
  goal?: number; // Goal in ml
  initialValue?: number; // Initial value in ml
  incrementAmount?: number; // Amount to add per click in ml
}

export const HydrationBottle = ({
  goal = 2500, // Default goal: 2.5L
  initialValue = 0,
  incrementAmount = 250, // Default increment: 250ml
}: HydrationBottleProps) => {
  const [hydration, setHydration] = useState(initialValue);
  const [showSplash, setShowSplash] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate fill percentage (max 100%)
  const fillPercentage = Math.min((hydration / goal) * 100, 100);

  // Check if goal is reached
  useEffect(() => {
    if (hydration >= goal && !isGoalReached) {
      setIsGoalReached(true);
      setShowCelebration(true);
    } else if (hydration < goal && isGoalReached) {
      setIsGoalReached(false);
    }
  }, [hydration, goal, isGoalReached]);

  // Add water function
  const addWater = () => {
    setShowSplash(true);
    setHydration((prev) => Math.min(prev + incrementAmount, goal));

    // Hide splash after animation
    setTimeout(() => setShowSplash(false), 1000);
  };

  // Reset function
  const resetHydration = () => {
    setHydration(0);
    setIsGoalReached(false);
  };

  return (
    <>
      <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Гидратация
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 flex flex-col items-center">
          <div className="flex items-end justify-center mb-4">
            <div className="text-3xl font-bold">
              {(hydration / 1000).toFixed(1)}
            </div>
            <div className="text-lg text-gray-500 ml-1">
              / {(goal / 1000).toFixed(1)}л
            </div>
          </div>

          <div className="relative w-full h-64 mb-6">
            <svg
              viewBox="0 0 100 160"
              className="w-full h-full"
              style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.1))" }}
            >
              <path
                d="M40,0 L60,0 L60,10 C70,15 75,20 75,30 L75,40 L25,40 L25,30 C25,20 30,15 40,10 Z"
                fill="#e6f7ff"
                stroke="#90cdf4"
                strokeWidth="1.5"
              />
              <path
                d="M25,40 L75,40 L80,150 C80,155 75,160 70,160 L30,160 C25,160 20,155 20,150 Z"
                fill="#e6f7ff"
                stroke="#90cdf4"
                strokeWidth="1.5"
              />
              <motion.path
                initial={{ d: `M25,160 L75,160 L75,160 L25,160 Z` }}
                animate={{
                  d: `M${20 + 5},${160 - (120 * fillPercentage) / 100} 
                         C${20 + 5},${160 - (120 * fillPercentage) / 100} 
                         ${75},${160 - (120 * fillPercentage) / 100} 
                         ${75},${160 - (120 * fillPercentage) / 100} 
                         L80,150 
                         C80,155 75,160 70,160 
                         L30,160 
                         C25,160 20,155 20,150 Z`,
                }}
                transition={{ duration: 1, type: "spring", stiffness: 50 }}
                fill="#3b82f6"
              />
              {[0, 25, 50, 75, 100].map((percent) => (
                <g key={percent}>
                  <line
                    x1="25"
                    y1={160 - (120 * percent) / 100}
                    x2="30"
                    y2={160 - (120 * percent) / 100}
                    stroke="#90cdf4"
                    strokeWidth="1"
                  />
                  <text
                    x="15"
                    y={160 - (120 * percent) / 100 + 4}
                    fontSize="8"
                    fill="#64748b"
                    textAnchor="end"
                  >
                    {percent}%
                  </text>
                </g>
              ))}
              <circle cx="50" cy="0" r="8" fill="#90cdf4" />
            </svg>
            <AnimatePresence>
              {showSplash && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-blue-400"
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: Math.sin((i * Math.PI) / 4) * 50,
                        y: Math.cos((i * Math.PI) / 4) * 50,
                        opacity: 0,
                      }}
                      transition={{ duration: 1 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              onClick={addWater}
              disabled={hydration >= goal}
              className={cn(
                "flex-1 gap-2",
                hydration >= goal
                  ? "bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              <Plus className="h-4 w-4" />
              Добавить {incrementAmount}мл
            </Button>

            <Button
              onClick={resetHydration}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <GoalReachedCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        goal={goal}
      />
    </>
  );
};
