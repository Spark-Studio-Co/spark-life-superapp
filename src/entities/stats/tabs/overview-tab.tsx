// @ts-nocheck

"use client";

import { healthData } from "@/shared/data/health-data";
import { motion } from "framer-motion";
import { Heart, Activity, Moon, Droplet } from "lucide-react";
import { HealthScoreCard } from "../cards/health-score-tab";
import { InsightsCard } from "../cards/insights-card";
import { MedicationCard } from "../cards/medication-card";
import { HealthMetricsCard } from "@/entities/health/ui/health-metrics-card";

export const OverviewTab = () => {
  const {
    heartRateData,
    stepsData,
    sleepData,
    hydrationData,
    medicationAdherenceData,
    healthScoreData,
  } = healthData;

  // Расчет средних значений
  const avgHeartRate = Math.round(
    heartRateData.reduce((sum, item) => sum + item.value, 0) /
      heartRateData.length
  );

  const avgSteps = Math.round(
    stepsData.reduce((sum, item) => sum + item.value, 0) / stepsData.length
  );

  const avgSleep = (
    sleepData.reduce(
      (sum, item) => sum + item.deep + item.light + item.rem + item.awake,
      0
    ) / sleepData.length
  ).toFixed(1);

  const avgHydration = (
    hydrationData.reduce((sum, item) => sum + item.value, 0) /
    hydrationData.length
  ).toFixed(1);

  // Расчет трендов
  const heartRateTrend =
    heartRateData[heartRateData.length - 1].value > heartRateData[0].value
      ? "increase"
      : "decrease";

  const stepsTrend =
    stepsData[stepsData.length - 1].value > stepsData[0].value
      ? "increase"
      : "decrease";

  const sleepTrend =
    sleepData[sleepData.length - 1].deep +
      sleepData[sleepData.length - 1].light >
    sleepData[0].deep + sleepData[0].light
      ? "increase"
      : "decrease";

  const hydrationTrend =
    hydrationData[hydrationData.length - 1].value > hydrationData[0].value
      ? "increase"
      : "decrease";

  // Расчет процента достижения целей
  const stepsGoalPercent = Math.round((avgSteps / 10000) * 100);
  const hydrationGoalPercent = Math.round(
    (Number.parseFloat(avgHydration) / 2.5) * 100
  );
  const sleepGoalPercent = Math.round((Number.parseFloat(avgSleep) / 8) * 100);

  return (
    <>
      {/* Сводка показателей */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-2"
        >
          <HealthScoreCard data={healthScoreData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <HealthMetricsCard
            title="Пульс"
            icon={<Heart className="h-4 w-4 text-red-500" />}
            value={avgHeartRate}
            unit="уд/мин"
            trend={heartRateTrend}
            trendValue={heartRateTrend === "increase" ? "+3%" : "-2%"}
            data={heartRateData}
            dataKey="value"
            color="#ef4444"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <HealthMetricsCard
            title="Шаги"
            icon={<Activity className="h-4 w-4 text-blue-500" />}
            value={avgSteps.toLocaleString()}
            unit="шагов"
            trend={stepsTrend}
            trendValue={stepsTrend === "increase" ? "+5%" : "-3%"}
            goalPercent={stepsGoalPercent}
            data={stepsData}
            dataKey="value"
            chartType="bar"
            color="#3b82f6"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <HealthMetricsCard
            title="Сон"
            icon={<Moon className="h-4 w-4 text-indigo-500" />}
            value={avgSleep}
            unit="ч"
            trend={sleepTrend}
            trendValue={sleepTrend === "increase" ? "+7%" : "-4%"}
            goalPercent={sleepGoalPercent}
            data={sleepData}
            chartType="area"
            isStackedData
            color="#6366f1"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <HealthMetricsCard
            title="Гидратация"
            icon={<Droplet className="h-4 w-4 text-cyan-500" />}
            value={avgHydration}
            unit="л"
            trend={hydrationTrend}
            trendValue={hydrationTrend === "increase" ? "+8%" : "-5%"}
            goalPercent={hydrationGoalPercent}
            data={hydrationData}
            dataKey="value"
            chartType="area"
            color="#06b6d4"
          />
        </motion.div>
      </div>

      {/* Инсайты и рекомендации */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <InsightsCard />
      </motion.div>

      {/* Прием лекарств */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <MedicationCard data={medicationAdherenceData} />
      </motion.div>
    </>
  );
};
