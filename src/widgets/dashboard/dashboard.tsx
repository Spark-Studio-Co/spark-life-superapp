"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Droplets,
  Smile,
  Brain,
  Mic,
  Activity,
  Moon,
  Pill,
  AlertCircle,
  ChevronRight,
  BarChart2,
  TrendingUp,
  Calendar,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HealthMetric } from "@/entities/health/types/types";
import { QuickAction } from "@/entities/quick-actions/model/types";
import { Reminder } from "@/entities/reminder/model/types";
import { HealthStatusWidget } from "../health/health-status";
import { AiRecommendationsWidget } from "../ai-recommendations/ai-recommendations";
import { QuickActionsWidget } from "../quick-actions/quick-actions";
import { RemindersWidget } from "../reminders/reminders";
import { WeeklyProgressWidget } from "../weekly-progress/weekly-progress";
import { MainLayout } from "@/shared/ui/layout";

export const DashboardPage = () => {
  const [healthStatus] = useState("Норма");
  const [activeTab, setActiveTab] = useState("home");

  // Данные для мини-графиков
  const healthMetrics: HealthMetric[] = [
    {
      id: "sleep",
      title: "Сон",
      value: "7ч 20м",
      icon: Moon,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      progress: 85,
    },
    {
      id: "stress",
      title: "Стресс",
      value: "Низкий",
      icon: Brain,
      color: "text-green-500",
      bgColor: "bg-green-100",
      progress: 25,
    },
    {
      id: "activity",
      title: "Активность",
      value: "7,234",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      progress: 72,
    },
    {
      id: "medication",
      title: "Лекарства",
      value: "2/3",
      icon: Pill,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      progress: 66,
    },
  ];

  // Данные для быстрых кнопок
  const quickActions: QuickAction[] = [
    {
      id: "sparkface",
      title: "Сканировать лицо",
      icon: Camera,
      color: "bg-orange-500",
      to: "/modules/sparkface",
    },
    {
      id: "sparkvoice",
      title: "Анализ речи",
      icon: Mic,
      color: "bg-rose-500",
      to: "/modules/sparkvoice",
    },
    {
      id: "sparkwater",
      title: "Проверка воды",
      icon: Droplets,
      color: "bg-cyan-500",
      to: "/modules/sparkwater",
    },
    {
      id: "sparkcare",
      title: "AI-консультант",
      icon: MessageSquare,
      color: "bg-blue-500",
      to: "/modules/sparkcare",
    },
    {
      id: "sparkskin",
      title: "Диагностика кожи",
      icon: Smile,
      color: "bg-amber-500",
      to: "/modules/sparkskin",
    },
    {
      id: "sparkmind",
      title: "Стресс-опрос",
      icon: Brain,
      color: "bg-indigo-500",
      to: "/modules/sparkmind",
    },
  ];

  // Данные для рекомендаций AI
  const aiRecommendations = [
    "Сделайте перерыв и выполните дыхательную практику",
    "Выпейте стакан воды, вы немного обезвожены",
    "Пройдитесь 10 минут для улучшения кровообращения",
  ];

  // Данные для напоминаний
  const reminders: Reminder[] = [
    {
      id: "metformin",
      title: "Метформин",
      description: "Следующий приём через 2 часа",
      time: "2 часа",
      icon: (
        <div className="p-2 rounded-full bg-amber-100">
          <Pill className="h-4 w-4 text-amber-500" />
        </div>
      ),
    },
    {
      id: "missed",
      title: "Пропущенный приём",
      description: "Вчера вы пропустили приём Амлодипина",
      time: "вчера",
      isAlert: true,
      icon: (
        <div className="p-2 rounded-full bg-red-100">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-6 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Добро пожаловать, Сара!
            </h1>
            <p className="text-blue-100 mt-1">
              Забота о здоровье — это инвестиция в ваше будущее
            </p>
          </div>
          <Link to="/health-stats">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/25 p-3 rounded-full backdrop-blur-sm"
            >
              <BarChart2 className="h-6 w-6 text-white" />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      <div className="px-6 -mt-12">
        <HealthStatusWidget status={healthStatus} metrics={healthMetrics} />
      </div>
      <div className="px-6 mt-8 space-y-[48px]">
        <QuickActionsWidget actions={quickActions} />
        <AiRecommendationsWidget recommendations={aiRecommendations} />
        <RemindersWidget reminders={reminders} />
        <WeeklyProgressWidget progress={60} completed={3} total={5} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            asChild
            variant="outline"
            className="w-full max-w-xs py-6 rounded-xl transition-all hover:bg-blue-50 hover:border-blue-200"
          >
            <Link to="/modules">
              <TrendingUp className="h-5 w-5 mr-2" />
              Все модули здоровья
            </Link>
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
