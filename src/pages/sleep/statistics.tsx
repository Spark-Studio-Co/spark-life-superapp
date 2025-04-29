"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data for the detailed statistics
interface SleepEntry {
  date: string;
  hours: number;
  quality: "high" | "medium" | "low";
  bedTime: string;
  wakeTime: string;
}

interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  avgHours: number;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  bestDay: string;
  worstDay: string;
}

export default function SleepStatistics() {
  const navigation = useNavigate();
  const [activeTab, setActiveTab] = useState("weekly");

  // Mock data for the last 30 days
  const sleepData: SleepEntry[] = [
    { date: "29 апр", hours: 7.5, quality: "medium", bedTime: "23:30", wakeTime: "07:00" },
    { date: "28 апр", hours: 6.8, quality: "low", bedTime: "00:15", wakeTime: "07:00" },
    { date: "27 апр", hours: 8.2, quality: "high", bedTime: "22:45", wakeTime: "07:00" },
    { date: "26 апр", hours: 7.0, quality: "medium", bedTime: "23:30", wakeTime: "06:30" },
    { date: "25 апр", hours: 6.5, quality: "low", bedTime: "00:30", wakeTime: "07:00" },
    { date: "24 апр", hours: 8.5, quality: "high", bedTime: "22:30", wakeTime: "07:00" },
    { date: "23 апр", hours: 7.8, quality: "medium", bedTime: "23:00", wakeTime: "06:45" },
    { date: "22 апр", hours: 7.2, quality: "medium", bedTime: "23:15", wakeTime: "06:30" },
    { date: "21 апр", hours: 6.5, quality: "low", bedTime: "00:30", wakeTime: "07:00" },
    { date: "20 апр", hours: 7.9, quality: "high", bedTime: "22:45", wakeTime: "06:40" },
    { date: "19 апр", hours: 8.1, quality: "high", bedTime: "22:30", wakeTime: "06:35" },
    { date: "18 апр", hours: 7.0, quality: "medium", bedTime: "23:45", wakeTime: "06:45" },
    { date: "17 апр", hours: 6.7, quality: "low", bedTime: "00:15", wakeTime: "07:00" },
    { date: "16 апр", hours: 7.5, quality: "medium", bedTime: "23:00", wakeTime: "06:30" },
  ];

  // Weekly summaries
  const weeklySummaries: WeeklySummary[] = [
    {
      weekStart: "23 апр",
      weekEnd: "29 апр",
      avgHours: 7.5,
      trend: "up",
      trendPercentage: 3.2,
      bestDay: "24 апр",
      worstDay: "25 апр",
    },
    {
      weekStart: "16 апр",
      weekEnd: "22 апр",
      avgHours: 7.3,
      trend: "down",
      trendPercentage: 1.8,
      bestDay: "19 апр",
      worstDay: "17 апр",
    },
    {
      weekStart: "9 апр",
      weekEnd: "15 апр",
      avgHours: 7.4,
      trend: "stable",
      trendPercentage: 0.5,
      bestDay: "12 апр",
      worstDay: "14 апр",
    },
  ];

  // Calculate the average sleep hours for all data
  const averageSleep = sleepData.reduce((sum, entry) => sum + entry.hours, 0) / sleepData.length;

  // Calculate the optimal sleep time (between 7-9 hours)
  const optimalSleepPercentage = 
    (sleepData.filter(entry => entry.hours >= 7 && entry.hours <= 9).length / sleepData.length) * 100;

  // Calculate average bedtime
  const averageBedTimeMinutes = sleepData.reduce((sum, entry) => {
    const [hours, minutes] = entry.bedTime.split(":").map(Number);
    return sum + hours * 60 + minutes;
  }, 0) / sleepData.length;

  const averageBedTimeHours = Math.floor(averageBedTimeMinutes / 60);
  const averageBedTimeRemainingMinutes = Math.round(averageBedTimeMinutes % 60);
  const formattedAverageBedTime = `${averageBedTimeHours.toString().padStart(2, '0')}:${averageBedTimeRemainingMinutes.toString().padStart(2, '0')}`;

  // Find the best quality sleep day
  const bestQualitySleepDay = sleepData.find(entry => entry.quality === "high");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          onClick={() => navigation(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Подробная статистика сна
        </h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none rounded-2xl shadow-[0px_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0px_12px_36px_rgba(124,58,237,0.12)] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Moon className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">В среднем</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{averageSleep.toFixed(1)}ч</h3>
            <p className="text-sm text-gray-500 mt-1">сна за последние 30 дней</p>
          </CardContent>
        </Card>

        <Card className="border-none rounded-2xl shadow-[0px_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0px_12px_36px_rgba(124,58,237,0.12)] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Оптимальный сон</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{optimalSleepPercentage.toFixed(0)}%</h3>
            <p className="text-sm text-gray-500 mt-1">дней с 7-9 часами сна</p>
          </CardContent>
        </Card>

        <Card className="border-none rounded-2xl shadow-[0px_8px_30px_rgba(124,58,237,0.08)] hover:shadow-[0px_12px_36px_rgba(124,58,237,0.12)] transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Среднее время</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800">{formattedAverageBedTime}</h3>
            <p className="text-sm text-gray-500 mt-1">отхода ко сну</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different time periods */}
      <Tabs defaultValue="weekly" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="weekly">Недельная</TabsTrigger>
          <TabsTrigger value="monthly">Месячная</TabsTrigger>
          <TabsTrigger value="insights">Инсайты</TabsTrigger>
        </TabsList>

        {/* Weekly View */}
        <TabsContent value="weekly" className="space-y-6">
          {weeklySummaries.map((week, index) => (
            <Card key={index} className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)]">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="text-gray-700">
                    <Calendar className="h-4 w-4 inline mr-2 text-purple-600" />
                    {week.weekStart} - {week.weekEnd}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                      week.trend === "up"
                        ? "text-green-600 bg-green-50 border border-green-100"
                        : week.trend === "down"
                        ? "text-red-500 bg-red-50 border border-red-100"
                        : "text-blue-600 bg-blue-50 border border-blue-100"
                    }`}
                  >
                    {week.trend === "up" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : week.trend === "down" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <BarChart3 className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {week.trend !== "stable" ? `${week.trendPercentage}%` : "Стабильно"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-medium">Среднее за неделю</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                        {week.avgHours.toFixed(1)}
                      </p>
                      <p className="text-sm font-medium text-purple-600">часов</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50/50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-medium">Лучший день</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-lg font-bold text-green-600">
                        {week.bestDay}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50/50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 font-medium">Худший день</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-lg font-bold text-red-500">
                        {week.worstDay}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Monthly View */}
        <TabsContent value="monthly">
          <Card className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)]">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold">
                  Детальная статистика за месяц
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Дата</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Часы сна</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Качество</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Отбой</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Подъем</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleepData.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm font-medium text-gray-700">{entry.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div 
                              className={`w-2 h-8 rounded-full mr-3 ${
                                entry.quality === "high" 
                                  ? "bg-green-500" 
                                  : entry.quality === "medium" 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-800">{entry.hours} ч</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span 
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              entry.quality === "high" 
                                ? "bg-green-100 text-green-700" 
                                : entry.quality === "medium" 
                                ? "bg-yellow-100 text-yellow-700" 
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {entry.quality === "high" 
                              ? "Отличное" 
                              : entry.quality === "medium" 
                              ? "Среднее" 
                              : "Плохое"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{entry.bedTime}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{entry.wakeTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights View */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)]">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">
                    Рекомендации
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Оптимизируйте время отхода ко сну</p>
                      <p className="text-sm text-gray-600">Старайтесь ложиться спать до 23:00 для лучшего качества сна.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Поддерживайте регулярность</p>
                      <p className="text-sm text-gray-600">Ложитесь и вставайте в одно и то же время, даже в выходные.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Избегайте экранов перед сном</p>
                      <p className="text-sm text-gray-600">Отложите электронные устройства за 1 час до сна.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(124,58,237,0.08)]">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">
                    Анализ паттернов
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <div className="space-y-4">
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Лучшее время для сна</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">22:30 - 23:00</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Рекомендуется
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Дни с лучшим качеством сна</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">Вторник</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">Среда</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">Суббота</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50/50 p-4 rounded-xl">
                    <p className="text-sm font-medium text-gray-700 mb-2">Оптимальная продолжительность</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">7.5 - 8.5 часов</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        Для вашего возраста
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
