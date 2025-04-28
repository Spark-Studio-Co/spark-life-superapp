"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-600" />
            Статистика сна
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          >
            Подробнее <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SleepCircleIndicator initialHours={6.5} goalHours={8} />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Среднее за неделю
                </span>
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
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {averageSleep.toFixed(1)} ч
              </div>
            </div>

            <div className="h-[180px] flex items-end gap-2">
              {sleepData.map((day, index) => {
                const height = (day.hours / 10) * 100;
                const quality =
                  day.hours >= 8 ? "high" : day.hours >= 7 ? "medium" : "low";
                const color =
                  quality === "high"
                    ? "bg-indigo-500"
                    : quality === "medium"
                    ? "bg-indigo-400"
                    : "bg-indigo-300";

                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <motion.div
                      className={`w-full rounded-t-md ${color}`}
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <div className="h-full w-full relative">
                        {/* Sleep quality indicator */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white/10 rounded-b-md" />
                      </div>
                    </motion.div>
                    <span className="text-xs font-medium text-gray-500">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 border-t border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-indigo-700">
            <span className="font-medium">Совет:</span> Старайтесь ложиться
            спать и просыпаться в одно и то же время
          </div>
          <Moon className="h-4 w-4 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}
