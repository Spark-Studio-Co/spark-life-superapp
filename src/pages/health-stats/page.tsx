"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Download, ChevronLeft, Moon, Droplet, Activity, Brain, ArrowDown, Info } from "lucide-react"
import { Link } from "react-router-dom"
import { MainLayout } from "@/shared/ui/layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Area,
} from "recharts"

export interface HealthStatsPageProps {
  className?: string
}

export const HealthStatsPage = ({ className }: HealthStatsPageProps = {}) => {
  const [timeRange, setTimeRange] = useState("7d")

  // Sample data
  const weightData = [
    { date: "01.04", value: 65.8 },
    { date: "08.04", value: 65.5 },
    { date: "15.04", value: 65.2 },
    { date: "22.04", value: 64.9 },
    { date: "29.04", value: 64.7 },
    { date: "06.05", value: 64.5 },
    { date: "13.05", value: 64.3 },
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
    <MainLayout>
      {/* Header */}
      <div className="bg-[#4169E1] text-white px-4 pt-6 pb-6">
        <div className="flex items-center mb-2">
          <Link to="/" className="mr-3">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Статистика здоровья</h1>
        </div>
        <p className="text-blue-100">Подробный анализ ваших показателей</p>
      </div>

      <motion.div
        className={`p-4 space-y-6 pb-16 ${className || ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Filter and Export Controls */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-white shadow-sm border-none">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <SelectValue placeholder="Период" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 дней</SelectItem>
              <SelectItem value="14d">14 дней</SelectItem>
              <SelectItem value="30d">30 дней</SelectItem>
              <SelectItem value="90d">90 дней</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="bg-white shadow-sm border-none">
            <Download className="h-4 w-4 mr-2 text-blue-500" />
            Экспорт
          </Button>
        </motion.div>

        {/* Health Score Card */}
        <motion.div variants={itemVariants}>
          <HealthScoreCard />
        </motion.div>

        {/* Stress Level Card */}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Данные о вашем уровне стресса за выбранный период</p>
                  </TooltipContent>
                </Tooltip>
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

        {/* Health Metrics Grid */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={<Moon className="h-5 w-5 text-indigo-500" />}
              title="Сон"
              value="9.2"
              unit="ч"
              trend="+7%"
              trendDirection="up"
              period="за неделю"
              progress={115}
              progressLabel="от цели"
              chart="sleep"
            />

            <MetricCard
              icon={<Droplet className="h-5 w-5 text-cyan-500" />}
              title="Гидратация"
              value="2.0"
              unit="л"
              trend="+8%"
              trendDirection="up"
              period="за неделю"
              progress={80}
              progressLabel="от цели"
              chart="hydration"
            />
          </div>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Данные о вашем весе и индексе массы тела за выбранный период</p>
                  </TooltipContent>
                </Tooltip>
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
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[64, 66]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <ChartTooltip
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
    </MainLayout>
  )
}

const HealthScoreCard = () => {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-1">Общий индекс здоровья</h2>
        <p className="text-gray-500 mb-6">Комплексная оценка вашего здоровья</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold">82</span>
            <span className="ml-3 text-sm font-medium px-2 py-1 bg-green-100 text-green-700 rounded-md flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 19V5M12 5L5 12M12 5L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              +3%
            </span>
          </div>
          <span className="text-xl text-gray-600">Хороший</span>
        </div>

        <div className="w-full bg-blue-100 rounded-full h-2.5 mb-6">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "82%" }}></div>
        </div>

        {/* Radar Chart */}
        <div className="aspect-square max-h-[300px] mx-auto">
          <ModernHealthChart />
        </div>
      </CardContent>
    </Card>
  )
}

interface HealthMetric {
  name: string
  value: number
  color: string
  icon?: React.ReactNode
}

const ModernHealthChart = () => {
  // Health metrics data
  const metrics: HealthMetric[] = [
    { name: "Сон", value: 75, color: "#4f46e5" },
    { name: "Стресс", value: 68, color: "#8b5cf6" },
    { name: "Гидратация", value: 82, color: "#0ea5e9" },
  ]

  // Calculate positions for each metric
  const centerX = 150
  const centerY = 150
  const radius = 100
  const angleStep = (2 * Math.PI) / metrics.length

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      {/* Background circles */}
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.75}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.5}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.25}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Center point */}
      <circle cx={centerX} cy={centerY} r={4} fill="#e5e7eb" />

      {/* Metric spokes and indicators */}
      {metrics.map((metric, index) => {
        const angle = index * angleStep - Math.PI / 2 // Start from top (subtract PI/2)
        const metricRadius = (metric.value / 100) * radius
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        const metricX = centerX + Math.cos(angle) * metricRadius
        const metricY = centerY + Math.sin(angle) * metricRadius

        // Calculate label position
        const labelRadius = radius + 20
        const labelX = centerX + Math.cos(angle) * labelRadius
        const labelY = centerY + Math.sin(angle) * labelRadius

        // Determine text anchor based on position
        let textAnchor = "middle"
        if (Math.abs(angle) < 0.1 || Math.abs(angle - Math.PI) < 0.1) {
          textAnchor = "middle"
        } else if (angle > 0 && angle < Math.PI) {
          textAnchor = "start"
        } else {
          textAnchor = "end"
        }

        return (
          <g key={index}>
            {/* Spoke line */}
            <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />

            {/* Value indicator */}
            <g>
              {/* Gradient for glow effect */}
              <defs>
                <radialGradient id={`glow-${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor={metric.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glow effect */}
              <circle cx={metricX} cy={metricY} r={10} fill={`url(#glow-${index})`} opacity="0.6" />

              {/* Value line with gradient */}
              <line
                x1={centerX}
                y1={centerY}
                x2={metricX}
                y2={metricY}
                stroke={metric.color}
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Value indicator circle */}
              <circle cx={metricX} cy={metricY} r={6} fill="white" stroke={metric.color} strokeWidth="3" />
            </g>

            {/* Label */}
            <text
              x={labelX}
              y={labelY}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fontSize="12"
              fill="#6b7280"
              fontWeight="500"
            >
              {metric.name}
            </text>

            {/* Value label */}
            <text
              x={metricX + Math.cos(angle) * 15}
              y={metricY + Math.sin(angle) * 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill={metric.color}
              fontWeight="bold"
            >
              {metric.value}
            </text>
          </g>
        )
      })}

      {/* Scale labels */}
      <text x={centerX} y={centerY - radius * 0.25} textAnchor="middle" fontSize="9" fill="#9ca3af">
        25
      </text>
      <text x={centerX} y={centerY - radius * 0.5} textAnchor="middle" fontSize="9" fill="#9ca3af">
        50
      </text>
      <text x={centerX} y={centerY - radius * 0.75} textAnchor="middle" fontSize="9" fill="#9ca3af">
        75
      </text>
      <text x={centerX} y={centerY - radius - 5} textAnchor="middle" fontSize="9" fill="#9ca3af">
        100
      </text>
    </svg>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  title: string
  value: string
  unit: string
  trend: string
  trendDirection: "up" | "down"
  period: string
  progress?: number
  progressLabel?: string
  chart?: "sleep" | "hydration"
}

const MetricCard = ({
  icon,
  title,
  value,
  unit,
  trend,
  trendDirection,
  period,
  progress,
  progressLabel,
  chart,
}: MetricCardProps) => {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-gray-700 font-medium">{title}</span>
        </div>

        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-gray-500 ml-1">{unit}</span>
        </div>

        <div className="flex items-center mb-3">
          <span
            className={`text-sm px-2 py-0.5 rounded-md flex items-center mr-2 ${trendDirection === "up" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
          >
            {trendDirection === "up" ? (
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 19V5M12 5L5 12M12 5L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M12 19L5 12M12 19L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {trend}
          </span>
          <span className="text-xs text-gray-500">{period}</span>

          {progress && (
            <span className="ml-auto text-xs text-gray-500">
              {progress}% {progressLabel}
            </span>
          )}
        </div>

        {progress && (
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div
              className={`h-1.5 rounded-full ${title === "Сон" ? "bg-indigo-500" : "bg-cyan-500"}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        )}

        {chart && (
          <div className="h-[60px] mt-2">
            {chart === "sleep" && (
              <div className="w-full h-full bg-indigo-50 rounded-md overflow-hidden">
                <div
                  className="w-full h-2/3 bg-indigo-200 rounded-t-md"
                  style={{
                    clipPath: "url(#sleepWave)",
                  }}
                ></div>
                <svg width="0" height="0">
                  <defs>
                    <clipPath id="sleepWave">
                      <path d="M0,30 C40,10 80,40 120,20 C160,0 200,30 240,20 L240,100 L0,100 Z" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}

            {chart === "hydration" && (
              <div className="w-full h-full bg-cyan-50 rounded-md overflow-hidden">
                <div
                  className="w-full h-2/3 bg-cyan-200 rounded-t-md"
                  style={{
                    clipPath: "url(#hydrationWave)",
                  }}
                ></div>
                <svg width="0" height="0">
                  <defs>
                    <clipPath id="hydrationWave">
                      <path d="M0,20 C30,30 60,10 90,25 C120,40 150,15 180,30 C210,45 240,20 270,30 L270,100 L0,100 Z" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
