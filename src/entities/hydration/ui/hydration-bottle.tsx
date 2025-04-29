"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GoalReachedCelebration } from "./goal-reached-button";

import { apiClient } from "@/shared/api/apiClient";

interface HydrationBottleProps {
  goal?: any; // Goal in ml
  initialValue?: number; // Initial value in ml
  incrementAmount?: number; // Amount to add per click in ml
  onUpdate?: () => void; // Callback to refetch data after update
}

export const HydrationBottle = ({
  goal = 2500, // Default goal: 2.5L
  initialValue = 0,
  incrementAmount = 250, // Default increment: 250ml
  onUpdate,
}: HydrationBottleProps) => {
  const [hydration, setHydration] = useState(initialValue);
  const [showSplash, setShowSplash] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDataSentToday, setIsDataSentToday] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if data was already sent today when component mounts
  useEffect(() => {
    const checkDataStatus = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/user/weekly-statistic');
        // If water data exists for today, disable the component
        if (response.data && response.data.water) {
          setIsDataSentToday(true);
          // Convert liters back to ml for display
          const waterInMl = response.data.water * 1000;
          setHydration(waterInMl); // Update hydration to match server data
        }
      } catch (error) {
        console.error('Error checking hydration data status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDataStatus();
  }, []);

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

  // Function to send hydration data to API
  const sendHydrationData = async () => {
    try {
      setIsLoading(true);
      // Convert to liters for the API
      const totalWaterAmount = hydration / 1000;
      await apiClient.post('/user/weekly-statistic', { water: totalWaterAmount });
      console.log(`Updated water statistics to ${totalWaterAmount}L`);
      setIsSaved(true);
      setIsDataSentToday(true); // Mark that data has been sent today
      
      // Keep the saved state visible for a moment
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      
      // Call the refetch callback if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update water statistics:', error);
      setIsSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Track last sent value to avoid duplicate requests
  const lastSentValueRef = useRef(initialValue);

  // Setup debounce effect
  useEffect(() => {
    // Don't set up debounce if data was already sent today
    if (isDataSentToday) {
      return;
    }
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only set up debounce if hydration has changed from last sent value
    if (hydration !== lastSentValueRef.current && hydration > 0) {
      setIsSaved(false);
      debounceTimerRef.current = setTimeout(() => {
        sendHydrationData();
        lastSentValueRef.current = hydration; // Update last sent value
      }, 5000); // 5 seconds debounce
    }

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [hydration, onUpdate, isDataSentToday]);

  // Add water function
  const addWater = () => {
    setShowSplash(true);

    // Update local state
    const newHydration = Math.min(hydration + incrementAmount, Number(goal));
    setHydration(newHydration);

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
              / {goal / 1000} л
            </div>
          </div>

          <div className="relative w-full h-80 mb-8">
            <svg
              viewBox="0 0 100 180"
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
              disabled={hydration >= goal || isLoading || isDataSentToday}
              className={cn(
                "flex-1 gap-2",
                hydration >= goal || isLoading || isDataSentToday
                  ? "bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              )}
            >
              {isLoading ? (
                'Сохранение...'
              ) : isDataSentToday ? (
                'Данные отправлены'
              ) : isSaved ? (
                '✓ Сохранено'
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Добавить {incrementAmount}мл
                </>
              )}
            </Button>

            <Button
              onClick={resetHydration}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              disabled={isLoading || isDataSentToday}
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
