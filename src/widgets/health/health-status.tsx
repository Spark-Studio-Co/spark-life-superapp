"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HealthMetric } from "@/entities/health/types/types";
import { HealthMetricsCard } from "@/entities/health/ui/health-metrics-card";

interface HealthStatusWidgetProps {
  status: string;
  metrics: HealthMetric[];
}

export const HealthStatusWidget = ({
  status,
  metrics,
}: HealthStatusWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-none shadow-[0px_8px_24px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-6 px-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Ваше текущее состояние
            </CardTitle>
          </div>
          <div
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium",
              status === "Норма"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {status}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <div className="grid grid-cols-2 gap-5">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <HealthMetricsCard metric={metric} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
