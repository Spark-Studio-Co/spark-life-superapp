"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepCircleIndicator } from "@/entities/sleep/ui/sleep-indicator";
import { apiClient } from "@/shared/api/apiClient";
import { userService } from "@/entities/user/api/user.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SleepData {
  day: string;
  hours: number;
}

interface WeeklySleepData {
  date: string;
  sleep?: number;
}

const dayTranslations: Record<string, string> = {
  "Mon": "Пн",
  "Tue": "Вт",
  "Wed": "Ср",
  "Thu": "Чт",
  "Fri": "Пт",
  "Sat": "Сб",
  "Sun": "Вс",
};

export function SleepWidget() {
  const [sleepData, setSleepData] = useState<SleepData[]>([
    { day: "Пн", hours: 7.5 },
    { day: "Вт", hours: 6.8 },
    { day: "Ср", hours: 8.2 },
    { day: "Чт", hours: 7.0 },
    { day: "Пт", hours: 6.5 },
    { day: "Сб", hours: 8.5 },
    { day: "Вс", hours: 7.8 },
  ]);

  const [sleepGoal, setSleepGoal] = useState<number>(8);
  const [weeklySleepData, setWeeklySleepData] = useState<WeeklySleepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to parse sleep goal from string like "7-8" to a number
  const parseSleepGoal = (goalString: string): number => {
    if (!goalString) return 8; // Default if no value

    // Check if it's a range like "7-8"
    if (goalString.includes('-')) {
      const [min, max] = goalString.split('-').map(num => parseFloat(num.trim()));
      // Take the average of the range
      return (min + max) / 2;
    }

    // If it's just a single number
    const parsed = parseFloat(goalString);
    return isNaN(parsed) ? 8 : parsed;
  };

  const fetchUserData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    setError(null);

    try {
      // Fetch AI stats for sleep goal
      const aiStatsResponse = await apiClient.get('/user/ai-stats');
      const sleepGoalValue = parseSleepGoal(aiStatsResponse?.data?.daily_sleep);
      setSleepGoal(sleepGoalValue);
      console.log('Sleep goal parsed:', sleepGoalValue, 'from:', aiStatsResponse.data.daily_sleep);

      // Fetch user data which includes weekly sleep statistics
      const userData = await userService.getMe();
      if (userData?.weekly_sleep && Array.isArray(userData.weekly_sleep) && userData.weekly_sleep.length > 0) {
        // Ensure the weekly_sleep data matches our expected type
        const typedWeeklySleepData = userData.weekly_sleep as WeeklySleepData[];
        setWeeklySleepData(typedWeeklySleepData);

        // Convert API data to match our history format
        const apiHistory = userData.weekly_sleep.map((item: WeeklySleepData) => {
          // Extract day from date (assuming format DD.MM.YYYY)
          const dateParts = item.date.split('.');
          const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
          const dayName = dayTranslations[date.toLocaleString('en-US', { weekday: 'short' })] ||
            date.toLocaleString('ru-RU', { weekday: 'short' });

          return {
            day: dayName,
            hours: item.sleep || 0 // Use 0 if sleep value is missing
          };
        });

        // If we have data from API, use it; otherwise keep the default
        if (apiHistory.length > 0) {
          setSleepData(apiHistory);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error?.response?.data || error);
      setError('Не удалось загрузить данные. Попробуйте позже.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    fetchUserData(true);
  };

  const averageSleep =
    sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;

  const previousWeekAverage = 7.2;
  const trend = averageSleep > previousWeekAverage ? "up" : "down";
  const trendPercentage = Math.abs(
    ((averageSleep - previousWeekAverage) / previousWeekAverage) * 100
  ).toFixed(1);

  const getQualityColor = (hours: number) => {
    if (hours >= sleepGoal) return "bg-gradient-to-t from-purple-600 to-indigo-500";
    if (hours >= sleepGoal * 0.9) return "bg-gradient-to-t from-purple-500 to-purple-400";
    return "bg-gradient-to-t from-purple-400 to-purple-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="ml-2 h-6 text-red-600 hover:text-red-700 hover:bg-red-100 p-0 px-2"
          >
            Повторить
          </Button>
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <SleepCircleIndicator initialHours={0} goalHours={sleepGoal} />
        </div>
        <Card className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0px_12px_36px_rgba(124,58,237,0.12)] transition-all duration-300">
          <CardHeader className="">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold">
                Статистика сна
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-purple-600/70 mb-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Среднее
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {`${averageSleep.toFixed(1)}ч`}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-indigo-600/70 mb-1 flex items-center gap-1">
                      <Moon className="h-3.5 w-3.5" />
                      Цель
                    </p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {`${sleepGoal.toFixed(1)}ч`}
                    </p>
                  </>
                )}
              </div>
            </div>

            {weeklySleepData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-medium text-purple-700">Статистика по дням</h3>
                  </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  <AnimatePresence>
                    {weeklySleepData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center py-1.5 border-b border-purple-100 last:border-0"
                      >
                        <span className="text-xs text-gray-600">{item.date}</span>
                        <span className="text-sm font-medium text-purple-700">{item.sleep || '-'}ч</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
              <TooltipProvider>
                <div className="flex items-end h-[120px] gap-2 relative">
                  {isLoading ? (
                    Array(7).fill(0).map((_, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <Skeleton className="w-full h-[80px] mb-1" />
                        <Skeleton className="w-6 h-4" />
                      </div>
                    ))
                  ) : (
                    sleepData.map((day, index) => {
                      const percentage = (day.hours / 10) * 100;
                      const quality = day.hours >= sleepGoal ? "high" : day.hours >= sleepGoal * 0.9 ? "medium" : "low";
                      const barColor = getQualityColor(day.hours);

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                className="w-full relative h-[100px] flex items-end cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <div className="absolute bottom-0 left-0 right-0 rounded-full h-full"></div>
                                <motion.div
                                  className={`absolute bottom-0 left-0 right-0 ${barColor} rounded-t-full shadow-lg`}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.min(percentage, 100)}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                >
                                  {/* Shine effect */}
                                  <div className="absolute top-0 left-0 right-0 h-1/4 bg-white/20 rounded-t-full"></div>
                                </motion.div>

                                {/* Achievement indicator */}
                                {day.hours >= sleepGoal && (
                                  <motion.div
                                    className="absolute -top-2 -right-2 bg-indigo-400 rounded-full p-1 shadow-md"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                                  >
                                    <Award className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-purple-800 text-white border-purple-900 shadow-xl">
                              <div className="text-center p-1">
                                <p className="font-medium">{day.hours.toFixed(1)}ч</p>
                                <p className="text-xs text-purple-200">{(day.hours / sleepGoal * 100).toFixed(0)}% от цели</p>
                                {day.hours >= sleepGoal && (
                                  <p className="text-xs text-yellow-300 mt-1 flex items-center justify-center gap-1">
                                    <Award className="h-3 w-3" /> Цель достигнута!
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-xs mt-2 font-medium text-gray-600">{day.day}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
