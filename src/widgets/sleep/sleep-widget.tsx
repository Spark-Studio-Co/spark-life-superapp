//@ts-nocheck

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

interface SleepData {
  day: string;
  hours: number;
}

interface WeeklySleepData {
  date: string;
  sleep?: number;
}

const dayTranslations: Record<string, string> = {
  Mon: "Пн",
  Tue: "Вт",
  Wed: "Ср",
  Thu: "Чт",
  Fri: "Пт",
  Sat: "Сб",
  Sun: "Вс",
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
  const [todaySleep, setTodaySleep] = useState<number>(0);

  // Function to parse sleep goal from string like "7-8" to a number
  const parseSleepGoal = (goalString: string): number => {
    if (!goalString) return 8; // Default if no value

    // Check if it's a range like "7-8"
    if (goalString.includes("-")) {
      const [min, max] = goalString
        .split("-")
        .map((num) => parseFloat(num.trim()));
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
      const aiStatsResponse = await apiClient.get("/user/ai-stats");
      const sleepGoalValue = parseSleepGoal(aiStatsResponse?.data?.daily_sleep);
      setSleepGoal(sleepGoalValue);
      console.log(
        "Sleep goal parsed:",
        sleepGoalValue,
        "from:",
        aiStatsResponse.data.daily_sleep
      );

      // Fetch user data which includes weekly sleep statistics
      const userData = await userService.getMe();
      if (
        userData?.weekly_sleep &&
        Array.isArray(userData.weekly_sleep) &&
        userData.weekly_sleep.length > 0
      ) {
        // Ensure the weekly_sleep data matches our expected type
        const typedWeeklySleepData = userData.weekly_sleep as WeeklySleepData[];
        setWeeklySleepData(typedWeeklySleepData);

        // Set today's sleep value if available
        const today = new Date().toISOString().split('T')[0];
        const todayData = userData.weekly_sleep.find((item: WeeklySleepData) => {
          if (!item.date) return false;
          const dateParts = item.date.split(".");
          const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          return formattedDate.includes(today);
        });
        
        if (todayData && todayData.sleep) {
          setTodaySleep(todayData.sleep);
        }

        // Convert API data to match our history format
        const apiHistory = userData.weekly_sleep.map(
          (item: WeeklySleepData) => {
            // Extract day from date (assuming format DD.MM.YYYY)
            const dateParts = item.date.split(".");
            const date = new Date(
              `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            );
            const dayName =
              dayTranslations[
                date.toLocaleString("en-US", { weekday: "short" })
              ] || date.toLocaleString("ru-RU", { weekday: "short" });

            return {
              day: dayName,
              hours: item.sleep || 0, // Use 0 if sleep value is missing
            };
          }
        );

        // If we have data from API, use it; otherwise keep the default
        if (apiHistory.length > 0) {
          setSleepData(apiHistory);
        }
      }
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error);
      setError("Не удалось загрузить данные. Попробуйте позже.");
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

  const getQualityColor = (hours: number) => {
    if (hours >= sleepGoal)
      return "bg-gradient-to-t from-purple-600 to-indigo-500";
    if (hours >= sleepGoal * 0.9)
      return "bg-gradient-to-t from-purple-500 to-purple-400";
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
        <SleepCircleIndicator 
          initialHours={todaySleep} 
          goalHours={sleepGoal} 
          onUpdate={handleRefresh}
        />
        <Card className="border-none rounded-2xl shadow-[0px_8px_30px_rgba(124,58,237,0.08)] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              <span className="text-purple-700">
                Статистика
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100 shadow-sm">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-purple-600/80 mb-1 flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Среднее
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {`${averageSleep.toFixed(1)}ч`}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-indigo-600/80 mb-1 flex items-center gap-1.5">
                      <Moon className="h-4 w-4" />
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
                className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <h3 className="text-sm font-medium text-purple-700">
                      Статистика по дням
                    </h3>
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
                        className="flex justify-between items-center py-2 px-2 border-b border-purple-100 last:border-0 hover:bg-purple-100/50 rounded-md transition-colors"
                      >
                        <span className="text-xs text-gray-600 font-medium">
                          {item.date}
                        </span>
                        <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          {item.sleep || "-"}ч
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}


          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
