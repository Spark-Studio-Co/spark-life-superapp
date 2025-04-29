"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, TrendingUp, TrendingDown, ArrowRight, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SleepCircleIndicator } from "@/entities/sleep/ui/sleep-indicator";
import { useNavigate } from "react-router-dom";

interface SleepData {
  day: string;
  hours: number;
}

export function SleepWidget() {
  const navigation = useNavigate()
  const [sleepData] = useState<SleepData[]>([
    { day: "Пн", hours: 7.5 },
    { day: "Вт", hours: 6.8 },
    { day: "Ср", hours: 8.2 },
    { day: "Чт", hours: 7.0 },
    { day: "Пт", hours: 6.5 },
    { day: "Сб", hours: 8.5 },
    { day: "Вс", hours: 7.8 },
  ]);

  // Calculate average sleep hours
  const averageSleep =
    sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;

  // Determine trend (compared to previous week)
  const previousWeekAverage = 7.2; // This would come from actual data
  const trend = averageSleep > previousWeekAverage ? "up" : "down";
  const trendPercentage = Math.abs(
    ((averageSleep - previousWeekAverage) / previousWeekAverage) * 100
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <SleepCircleIndicator initialHours={6.5} goalHours={8} />
        </div>
        <Card className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0px_12px_36px_rgba(124,58,237,0.12)] transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold">
                Статистика сна
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <div className="flex justify-between items-center mb-6 bg-purple-50/50 p-4 rounded-xl">
              <div>
                <p className="text-sm text-gray-500 font-medium">Среднее за неделю</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                    {averageSleep.toFixed(1)}
                  </p>
                  <p className="text-sm font-medium text-purple-600">часов</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div
                  className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${trend === "up"
                    ? "text-green-600 bg-green-50 border border-green-100"
                    : "text-red-500 bg-red-50 border border-red-100"
                    }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{trendPercentage}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">от прошлой недели</p>
              </div>
            </div>

            <div className="flex items-end h-36 gap-2 mb-2 mt-4">
              {sleepData.map((day, index) => {
                const height = (day.hours / 10) * 100;
                const quality =
                  day.hours >= 8 ? "high" : day.hours >= 7 ? "medium" : "low";

                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full relative h-full">
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-lg h-full"></div>
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 rounded-lg overflow-hidden`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        whileHover={{ opacity: 0.9 }}
                      >
                        <div className={`h-full w-full ${quality === "high"
                          ? "bg-gradient-to-t from-purple-600 to-indigo-500"
                          : quality === "medium"
                            ? "bg-gradient-to-t from-purple-500 to-purple-400"
                            : "bg-gradient-to-t from-purple-400 to-purple-300"
                          }`}>
                          <motion.div
                            className="w-full h-1/4 bg-white/20 absolute top-0 left-0 right-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                          />
                        </div>
                      </motion.div>
                    </div>
                    <div className="flex flex-col items-center mt-2">
                      <span className="text-xs font-medium text-gray-700">
                        {day.day}
                      </span>
                      <span className="text-xs text-gray-500">
                        {day.hours}ч
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 font-medium rounded-xl py-5 transition-all duration-300 hover:shadow-md group"
                onClick={() => navigation('/sleep-statistics')}              >
                <span className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Подробная статистика
                  <motion.div
                    className="ml-2 h-4 w-4"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight className="h-4 w-4 group-hover:text-indigo-600 transition-colors" />
                  </motion.div>
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
