"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AiRecommendationsWidgetProps {
  recommendations: string[];
}

export const AiRecommendationsWidget = ({
  recommendations,
}: AiRecommendationsWidgetProps) => {
  const [completed, setCompleted] = useState<number[]>([]);
  const allCompleted =
    completed.length === recommendations.length && recommendations.length > 0;

  const toggleRecommendation = (index: number) => {
    setCompleted((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        Сегодняшние советы
      </h2>
      <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6 space-y-4">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => toggleRecommendation(index)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="mt-0.5">
                {completed.includes(index) ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <p
                className={`flex-1 text-sm ${
                  completed.includes(index)
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
              >
                {recommendation}
              </p>
            </motion.div>
          ))}

          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t text-center"
            >
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center justify-center gap-2">
                <span>🎉</span> Отличная работа! Вы выполнили все рекомендации!
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
