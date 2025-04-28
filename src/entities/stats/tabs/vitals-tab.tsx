import { motion } from "framer-motion";
import { Heart, Activity, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import { TrendingDown } from "lucide-react";
import { healthData } from "@/shared/data/health-data";

export const VitalsTab = () => {
  const { bloodPressureData, weightData, stressData } = healthData;
  const COLORS = ["#4ade80", "#facc15", "#f87171", "#a78bfa"];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Пульс и давление
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-red-700 mb-1">Средний пульс</div>
                <div className="text-2xl font-bold text-red-700">
                  {Math.round(
                    bloodPressureData.reduce(
                      (sum, item) => sum + (item.systolic + item.diastolic) / 2,
                      0
                    ) / bloodPressureData.length
                  )}
                </div>
                <div className="text-xs text-red-600">уд/мин</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Систолическое</div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(
                    bloodPressureData.reduce(
                      (sum, item) => sum + item.systolic,
                      0
                    ) / bloodPressureData.length
                  )}
                </div>
                <div className="text-xs text-blue-600">мм рт.ст.</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700 mb-1">
                  Диастолическое
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {Math.round(
                    bloodPressureData.reduce(
                      (sum, item) => sum + item.diastolic,
                      0
                    ) / bloodPressureData.length
                  )}
                </div>
                <div className="text-xs text-green-600">мм рт.ст.</div>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" domain={[60, 140]} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[60, 140]}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} ${
                        name === "heartRate" ? "уд/мин" : "мм рт.ст."
                      }`,
                      name === "heartRate"
                        ? "Пульс"
                        : name === "systolic"
                        ? "Систолическое"
                        : "Диастолическое",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="systolic"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                    name="Систолическое"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="diastolic"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
                    name="Диастолическое"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Вес и состав тела
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">
                  {weightData[weightData.length - 1].value} кг
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-medium">-1.5 кг</span>
                  <span className="text-gray-500">за 6 недель</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">ИМТ</div>
                <div className="text-xl font-bold">22.4</div>
                <div className="text-xs text-green-500">Нормальный</div>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[64, 66]} />
                  <Tooltip
                    formatter={(value) => [`${value} кг`, "Вес"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Уровень стресса
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xl font-bold">Низкий</div>
                <div className="text-sm text-gray-500">
                  Средний уровень за неделю
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Индекс стресса</div>
                <div className="text-xl font-bold">32</div>
              </div>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stressData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {stressData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Уровень"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};
