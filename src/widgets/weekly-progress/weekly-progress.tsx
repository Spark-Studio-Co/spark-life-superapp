"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeeklyProgressWidgetProps {
  progress: number;
  completed: number;
  total: number;
}

export const WeeklyProgressWidget = ({
  progress,
  completed,
  total,
}: WeeklyProgressWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Прогресс недели
            </h3>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {progress}%
            </div>
          </div>

          <div className="mb-4">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Выполнено задач: {completed}/{total}
            </p>
            <p className="text-blue-500 font-medium">
              {completed === total
                ? "Все задачи выполнены! 🎉"
                : `Осталось: ${total - completed}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
