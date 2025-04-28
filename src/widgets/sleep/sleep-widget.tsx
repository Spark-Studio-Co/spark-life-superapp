"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SleepCircleIndicator } from "@/entities/sleep/ui/sleep-indicator";

interface SleepData {
  day: string;
  hours: number;
}

export function SleepWidget() {
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
        <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-500" />
              Статистика сна
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Среднее за неделю</p>
                <p className="text-xl font-bold">{averageSleep.toFixed(1)}ч</p>
              </div>
              <div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{trendPercentage}%</span>
                </div>
                <p className="text-sm text-gray-500">от прошлой недели</p>
              </div>
            </div>

            <div className="flex items-end h-32 gap-1">
              {sleepData.map((day, index) => {
                const height = (day.hours / 10) * 100;
                const quality =
                  day.hours >= 8 ? "high" : day.hours >= 7 ? "medium" : "low";
                const color =
                  quality === "high"
                    ? "bg-purple-500"
                    : quality === "medium"
                    ? "bg-purple-400"
                    : "bg-purple-300";

                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full relative">
                      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-sm h-full"></div>
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 ${color} rounded-sm`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      ></motion.div>
                    </div>
                    <span className="text-xs mt-1 text-gray-500">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Подробная статистика <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
