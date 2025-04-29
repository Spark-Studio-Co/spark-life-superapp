"use client"

//@ts-nocheck

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Droplet, Calendar, TrendingUp, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HydrationBottle } from "@/entities/hydration/ui/hydration-bottle"
import { apiClient } from "@/shared/api/apiClient"
import { userService } from "@/entities/user/api/user.api"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface HydrationWidgetProps {
  goal?: number
  initialValue?: number
}

interface WeeklyWaterData {
  date: string
  water: number
}

const dayTranslations: Record<string, string> = {
  Mon: "Пн",
  Tue: "Вт",
  Wed: "Ср",
  Thu: "Чт",
  Fri: "Пт",
  Sat: "Сб",
  Sun: "Вс",
}

export const HydrationWidget = ({ goal = 2500, initialValue = 500 }: HydrationWidgetProps) => {
  const [hydration] = useState(initialValue)
  const [history, setHistory] = useState([
    { date: "Пн", value: 1800 },
    { date: "Вт", value: 2100 },
    { date: "Ср", value: 1600 },
    { date: "Чт", value: 2300 },
    { date: "Пт", value: 1900 },
    { date: "Сб", value: 2500 },
    { date: "Вс", value: initialValue },
  ])
  const [weeklyData, setWeeklyData] = useState<WeeklyWaterData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hydraGoal, setHydraGoal] = useState<number>()
  const [error, setError] = useState<string | null>(null)

  // Calculate average from history
  const average = Math.round(history.reduce((sum, day) => sum + day.value, 0) / history.length)

  //@ts-ignore
  const todayPercentage = (hydration / (hydraGoal ? hydraGoal * 1000 : goal)) * 100

  const fetchUserData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    else setIsLoading(true)

    setError(null)

    try {
      // Fetch AI stats for hydration goal
      const aiStatsResponse = await apiClient.get("/user/ai-stats")
      setHydraGoal(aiStatsResponse?.data?.daily_water)

      // Fetch user data which includes weekly water statistics
      const userData = await userService.getMe()
      if (userData?.weekly_water && Array.isArray(userData.weekly_water) && userData.weekly_water.length > 0) {
        // Ensure the weekly_water data matches our expected type
        const typedWeeklyData = userData.weekly_water as WeeklyWaterData[]
        setWeeklyData(typedWeeklyData)

        // Convert API data to match our history format
        const apiHistory = userData.weekly_water.map((item: WeeklyWaterData) => {
          // Extract day from date (assuming format DD.MM.YYYY)
          const dateParts = item.date.split(".")
          const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)
          const dayName =
            dayTranslations[date.toLocaleString("en-US", { weekday: "short" })] ||
            date.toLocaleString("ru-RU", { weekday: "short" })

          return {
            date: dayName,
            value: item.water * 1000, // Convert to ml
          }
        })

        // If we have data from API, use it; otherwise keep the default
        if (apiHistory.length > 0) {
          setHistory(apiHistory)
        }
      }
    } catch (error: any) {
      console.error("Error fetching data:", error?.response?.data || error)
      setError("Не удалось загрузить данные. Попробуйте позже.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleRefresh = () => {
    fetchUserData(true)
  }

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
        <Card className="border-none rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100 shadow-sm">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-blue-600/80 mb-1 flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Среднее
                    </p>
                    <p className="text-2xl font-bold text-blue-700">{`${(average / 1000).toFixed(1)}л`}</p>
                  </>
                )}
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 shadow-sm">
                {isLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <>
                    <p className="text-sm text-emerald-600/80 mb-1 flex items-center gap-1.5">
                      <Droplet className="h-4 w-4" />
                      Цель
                    </p>
                    <p className="text-2xl font-bold text-emerald-700">{`${hydraGoal || goal / 1000}л`}</p>
                  </>
                )}
              </div>
            </div>

            {weeklyData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-medium text-blue-700">Статистика по дням</h3>
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
                        className="flex justify-between items-center py-2 px-2 border-b border-blue-100 last:border-0 hover:bg-blue-100/50 rounded-md transition-colors"
                      >
                        <span className="text-xs text-gray-600 font-medium">{item.date}</span>
                        <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          {item.water}л
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
    </motion.div >
  )
}
