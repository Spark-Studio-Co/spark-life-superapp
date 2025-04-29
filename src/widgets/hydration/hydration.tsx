//@ts-nocheck

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Calendar, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HydrationBottle } from "@/entities/hydration/ui/hydration-bottle";
import { apiClient } from "@/shared/api/apiClient";
import { userService } from "@/entities/user/api/user.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HydrationWidgetProps {
  goal?: number;
  initialValue?: number;
}

interface WeeklyWaterData {
  date: string;
  water: number;
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

export const HydrationWidget = ({
  goal = 2500,
  initialValue = 500,
}: HydrationWidgetProps) => {
  const [hydration] = useState(initialValue);
  const [history, setHistory] = useState([
    { date: "Пн", value: 1800 },
    { date: "Вт", value: 2100 },
    { date: "Ср", value: 1600 },
    { date: "Чт", value: 2300 },
    { date: "Пт", value: 1900 },
    { date: "Сб", value: 2500 },
    { date: "Вс", value: initialValue },
  ]);
  const [weeklyData, setWeeklyData] = useState<WeeklyWaterData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hydraGoal, setHydraGoal] = useState<number>();
  const [error, setError] = useState<string | null>(null);

  // Calculate average from history
  const average = Math.round(
    history.reduce((sum, day) => sum + day.value, 0) / history.length
  );

  //@ts-ignore
  const todayPercentage =
    (hydration / (hydraGoal ? hydraGoal * 1000 : goal)) * 100;

  const fetchUserData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    setError(null);

    try {
      // Fetch AI stats for hydration goal
      const aiStatsResponse = await apiClient.get("/user/ai-stats");
      setHydraGoal(aiStatsResponse?.data?.daily_water);

      // Fetch user data which includes weekly water statistics
      const userData = await userService.getMe();
      if (
        userData?.weekly_water &&
        Array.isArray(userData.weekly_water) &&
        userData.weekly_water.length > 0
      ) {
        // Ensure the weekly_water data matches our expected type
        const typedWeeklyData = userData.weekly_water as WeeklyWaterData[];
        setWeeklyData(typedWeeklyData);

        // Convert API data to match our history format
        const apiHistory = userData.weekly_water.map(
          (item: WeeklyWaterData) => {
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
              date: dayName,
              value: item.water * 1000, // Convert to ml
            };
          }
        );

        // If we have data from API, use it; otherwise keep the default
        if (apiHistory.length > 0) {
          setHistory(apiHistory);
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

  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-400";
    if (percentage >= 75) return "bg-teal-400";
    if (percentage >= 50) return "bg-cyan-400";
    return "bg-sky-400";
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
        <HydrationBottle
          goal={Number(hydraGoal) * 1000 || goal}
          initialValue={hydration}
          incrementAmount={250}
          onUpdate={handleRefresh}
        />
        <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-blue-600/70 mb-1 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Среднее
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {`${(average / 1000).toFixed(1)}л`}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-emerald-600/70 mb-1 flex items-center gap-1">
                      <Droplet className="h-3.5 w-3.5" />
                      Цель
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">
                      {`${hydraGoal || goal / 1000}л`}
                    </p>
                  </>
                )}
              </div>
            </div>

            {weeklyData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-700">
                      Статистика по дням
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                  <AnimatePresence>
                    {weeklyData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex justify-between items-center py-1.5 border-b border-blue-100 last:border-0"
                      >
                        <span className="text-xs text-gray-600">
                          {item.date}
                        </span>
                        <span className="text-sm font-medium text-blue-700">
                          {item.water}л
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
              <div className="flex items-end h-[120px] gap-2 relative">
                <TooltipProvider>
                  {isLoading
                    ? Array(7)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center"
                          >
                            <Skeleton className="w-full h-[80px] mb-1" />
                            <Skeleton className="w-6 h-4" />
                          </div>
                        ))
                    : history.map((day, i) => {
                        const percentage =
                          (day.value / (Number(hydraGoal) * 1000 || goal)) *
                          100;
                        const barColor = getBarColor(percentage);

                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center pl-5"
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.div
                                  className="w-full relative h-[100px] flex items-end cursor-pointer"
                                  whileHover={{ scale: 1.05 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <div className="absolute bottom-0 left-0 right-0 rounded-full h-full"></div>
                                  <motion.div
                                    className={`absolute bottom-0 left-0 right-0 ${barColor} rounded-t-full shadow-lg`}
                                    initial={{ height: 0 }}
                                    animate={{
                                      height: `${Math.min(percentage, 100)}%`,
                                    }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                  >
                                    {/* Shine effect */}
                                    <div className="absolute top-0 left-0 right-0 h-1/4 bg-white/20 rounded-t-full"></div>
                                  </motion.div>

                                  {/* Achievement indicator */}
                                  {percentage >= 100 && (
                                    <motion.div
                                      className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        delay: i * 0.1 + 0.5,
                                        type: "spring",
                                      }}
                                    >
                                      <Award className="h-3 w-3 text-white" />
                                    </motion.div>
                                  )}
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-blue-800 text-white border-blue-900 shadow-xl"
                              >
                                <div className="text-center p-1">
                                  <p className="font-medium">
                                    {(day.value / 1000).toFixed(1)}л
                                  </p>
                                  <p className="text-xs text-blue-200">
                                    {percentage.toFixed(0)}% от цели
                                  </p>
                                  {percentage >= 100 && (
                                    <p className="text-xs text-yellow-300 mt-1 flex items-center justify-center gap-1">
                                      <Award className="h-3 w-3" /> Цель
                                      достигнута!
                                    </p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-xs mt-2 font-medium text-gray-600">
                              {day.date}
                            </span>
                          </div>
                        );
                      })}
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
