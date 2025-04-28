import { useState } from "react";
import { motion } from "framer-motion";
import { Droplet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HydrationBottle } from "@/entities/hydration/ui/hydration-bottle";

interface HydrationWidgetProps {
  goal?: number;
  initialValue?: number;
}

export const HydrationWidget = ({
  goal = 2500,
  initialValue = 500,
}: HydrationWidgetProps) => {
  const [hydration, setHydration] = useState(initialValue);
  const [history] = useState([
    { date: "Пн", value: 1800 },
    { date: "Вт", value: 2100 },
    { date: "Ср", value: 1600 },
    { date: "Чт", value: 2300 },
    { date: "Пт", value: 1900 },
    { date: "Сб", value: 2500 },
    { date: "Вс", value: initialValue },
  ]);

  // Calculate average from history
  const average = Math.round(
    history.reduce((sum, day) => sum + day.value, 0) / history.length
  );

  // Calculate trend (compared to yesterday)
  const trend =
    initialValue > history[history.length - 2].value ? "up" : "down";
  const trendPercent = Math.round(
    Math.abs(
      (initialValue - history[history.length - 2].value) /
        history[history.length - 2].value
    ) * 100
  );

  // Update hydration when bottle component changes
  const handleHydrationChange = (value: number) => {
    setHydration(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HydrationBottle
          goal={goal}
          initialValue={hydration}
          incrementAmount={250}
        />

        <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Среднее за неделю</p>
                <p className="text-xl font-bold">
                  {(average / 1000).toFixed(1)}л
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Цель</p>
                <p className="text-xl font-bold">{(goal / 1000).toFixed(1)}л</p>
              </div>
            </div>

            <div className="flex items-end h-32 gap-1">
              {history.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative">
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-100 rounded-sm h-full"></div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-blue-400 rounded-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.value / goal) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs mt-1 text-gray-500">{day.date}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Подробная статистика
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
