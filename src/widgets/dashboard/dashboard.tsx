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
  Bell,
  User,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/entities/quick-actions/model/types";
import type { Reminder } from "@/entities/reminder/model/types";
import { AiRecommendationsWidget } from "../ai-recommendations/ai-recommendations";
import { QuickActionsWidget } from "../quick-actions/quick-actions";
import { RemindersWidget } from "../reminders/reminders";
import { WeeklyProgressWidget } from "../weekly-progress/weekly-progress";
import { MainLayout } from "@/shared/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/entities/user/hooks/use-user";

export const DashboardPage = () => {
  // Получаем данные пользователя
  const { user, isLoading, isError, refetch, getInitials } = useUser();

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

  // Получаем приветствие в зависимости от времени суток
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-6 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-64 bg-white/30 mb-2" />
                <Skeleton className="h-5 w-80 bg-white/20" />
              </>
            ) : isError ? (
              <div className="text-white">
                <p className="text-xl font-medium">
                  Не удалось загрузить данные
                </p>
                <button
                  onClick={() => refetch()}
                  className="flex items-center text-blue-100 hover:text-white mt-1"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Повторить загрузку
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">
                  {getGreeting()}, {user?.first_name || "Пользователь"}!
                </h1>
                <p className="text-blue-100 mt-1">
                  Забота о здоровье — это инвестиция в ваше будущее
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/profile">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Skeleton className="h-12 w-12 rounded-full bg-white/30" />
                ) : (
                  <Avatar className="h-12 w-12 border-2 border-white/50">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image || "/placeholder.svg"}
                        alt={user.first_name}
                      />
                    ) : (
                      <AvatarFallback className="bg-white/25 text-white">
                        {getInitials() || <User className="h-6 w-6" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="px-6 mt-8 mb-8 space-y-[48px]">
        <RemindersWidget reminders={reminders} />
        <QuickActionsWidget actions={quickActions} />
        <AiRecommendationsWidget recommendations={aiRecommendations} />
      </div>
    </MainLayout>
  );
};
