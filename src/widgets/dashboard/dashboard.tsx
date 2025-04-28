"use client";

import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Droplets,
  Mic,
  Pill,
  AlertCircle,
  BarChart2,
  TrendingUp,
  Moon,
  Bell
} from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuickAction } from "@/entities/quick-actions/model/types";
import { Reminder } from "@/entities/reminder/model/types";
import { AiRecommendationsWidget } from "../ai-recommendations/ai-recommendations";
import { QuickActionsWidget } from "../quick-actions/quick-actions";
import { RemindersWidget } from "../reminders/reminders";
import { WeeklyProgressWidget } from "../weekly-progress/weekly-progress";
import { MainLayout } from "@/shared/ui/layout";

export const DashboardPage = () => {

  // Данные для быстрых кнопок
  const quickActions: QuickAction[] = [
    {
      id: "sparkface",
      title: "Анализ лица",
      icon: Camera,
      color: "bg-orange-500",
      to: "/spark-face",
    },
    {
      id: "sparkvoice",
      title: "Анализ речи",
      icon: Mic,
      color: "bg-rose-500",
      to: "/spark-voice",
    },
    {
      id: "sparkwater",
      title: "Гидратация",
      icon: Droplets,
      color: "bg-cyan-500",
      to: "/hydration",
    },
    {
      id: "sparkcare",
      title: "AI-консультант",
      icon: MessageSquare,
      color: "bg-blue-500",
      to: "/ai-assistent",
    },
    {
      id: "sparksleep",
      title: "Трекер сна",
      icon: Moon,
      color: "bg-[#38bdf8]",
      to: "/sleep",
    },
    {
      id: "sparkremind",
      title: "Напоминания",
      icon: Bell,
      color: "bg-purple-500",
      to: "/reminder",
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
