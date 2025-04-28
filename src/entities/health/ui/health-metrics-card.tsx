// @ts-nocheck

"use client";

import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface HealthMetricCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  unit: string;
  trend: "increase" | "decrease";
  trendValue: string;
  goalPercent?: number;
  data: any[];
  dataKey?: string;
  chartType: "line" | "bar" | "area";
  color: string;
  isStackedData?: boolean;
}

export const HealthMetricsCard = ({
  title,
  icon,
  value,
  unit,
  trend,
  trendValue,
  goalPercent,
  data,
  dataKey = "value",
  chartType,
  color,
  isStackedData = false,
}: HealthMetricCardProps) => {
  // Determine if trend is positive based on the metric type
  // For most metrics, increase is good, but for some (like heart rate), decrease might be better
  const isPositiveTrend =
    (trend === "increase" && title !== "Пульс") ||
    (trend === "decrease" && title === "Пульс");

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <div className="flex items-center">
            <span className="text-xl font-bold">{value}</span>
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                isPositiveTrend
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }
            >
              {trend === "increase" ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {trendValue}
            </Badge>
            <span className="text-xs text-gray-500">за неделю</span>
          </div>
          {goalPercent && (
            <div className="text-xs text-gray-500">{goalPercent}% от цели</div>
          )}
        </div>

        {goalPercent && <Progress value={goalPercent} className="h-1.5 mb-2" />}

        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" && (
              <LineChart data={data}>
                <YAxis domain={[60, 80]} hide />
                <Tooltip
                  formatter={(value) => [`${value} ${unit}`, title]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: color, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
                />
              </LineChart>
            )}

            {chartType === "bar" && (
              <BarChart data={data}>
                <Tooltip
                  formatter={(value) => [
                    `${
                      typeof value === "number" ? value.toLocaleString() : value
                    } ${unit}`,
                    title,
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}

            {chartType === "area" && !isStackedData && (
              <AreaChart data={data}>
                <Tooltip
                  formatter={(value) => [`${value} ${unit}`, title]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                  activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
                />
              </AreaChart>
            )}

            {chartType === "area" && isStackedData && (
              <AreaChart data={data}>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} ч`,
                    name === "deep"
                      ? "Глубокий сон"
                      : name === "light"
                      ? "Легкий сон"
                      : name === "rem"
                      ? "REM сон"
                      : "Пробуждения",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="deep"
                  stackId="1"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="light"
                  stackId="1"
                  stroke="#a5b4fc"
                  fill="#a5b4fc"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="rem"
                  stackId="1"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="awake"
                  stackId="1"
                  stroke="#e0e7ff"
                  fill="#e0e7ff"
                  fillOpacity={0.2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
