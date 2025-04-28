"use client"

import { motion } from "framer-motion"
import { Heart, Activity, Brain, TrendingDown, Info, ArrowDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const VitalsTab = () => {
  // Sample data
  const bloodPressureData = [
    { date: "01.05", systolic: 120, diastolic: 80 },
    { date: "02.05", systolic: 118, diastolic: 78 },
    { date: "03.05", systolic: 122, diastolic: 82 },
    { date: "04.05", systolic: 121, diastolic: 79 },
    { date: "05.05", systolic: 119, diastolic: 80 },
    { date: "06.05", systolic: 123, diastolic: 81 },
    { date: "07.05", systolic: 120, diastolic: 80 },
  ]

  const weightData = [
    { date: "01.04", value: 65.8 },
    { date: "08.04", value: 65.5 },
    { date: "15.04", value: 65.2 },
    { date: "22.04", value: 64.9 },
    { date: "29.04", value: 64.7 },
    { date: "06.05", value: 64.5 },
    { date: "13.05", value: 64.3 },
  ]

  const stressData = [
    { name: "Низкий", value: 60, color: "#4ade80" },
    { name: "Средний", value: 30, color: "#facc15" },
    { name: "Высокий", value: 10, color: "#f87171" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Уровень стресса</CardTitle>
            </div>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Данные о вашем уровне стресса за выбранный период
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardHeader>

          <CardContent className="px-4 pb-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">Низкий</div>
                  <div className="text-sm text-gray-500 mt-1">Средний уровень за неделю</div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Индекс стресса</div>
                  <div className="text-2xl font-bold text-purple-600">32</div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <ArrowDown className="h-3 w-3 text-green-500" />
                    <span className="text-sm text-green-500">-8% за месяц</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weight Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="pb-3 flex flex-row items-center space-y-0 gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">Вес и состав тела</CardTitle>
            </div>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">
                    Данные о вашем весе и индексе массы тела за выбранный период
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardHeader>

          <CardContent className="px-4 pb-5">
            {/* Weight Summary */}
            <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-600">64.3 кг</div>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowDown className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">-1.5 кг</span>
                    <span className="text-sm text-gray-500">за 6 недель</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">ИМТ</div>
                  <div className="text-2xl font-bold text-green-600">22.4</div>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mt-1">
                    Нормальный
                  </Badge>
                </div>
              </div>
            </div>

            {/* Weight Chart */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[64, 66]}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} кг`, "Вес"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
