//@ts-nocheck

"use client";

import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Droplets,
  Mic,
  Moon,
  Bell,
  RefreshCw,
  File,
} from "lucide-react";

import type { QuickAction } from "@/entities/quick-actions/model/types";
import { AiRecommendationsWidget } from "../ai-recommendations/ai-recommendations";
import { QuickActionsWidget } from "../quick-actions/quick-actions";
import { MainLayout } from "@/shared/ui/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/entities/user/hooks/use-user";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNotificationSocket } from "@/entities/notification/hooks/use-notification";
import { RemindersWidget } from "../reminders/reminders";

import ToothIcon from "@/pages/modules/tooth-icon";

export const DashboardPage = () => {
  // Получаем данные пользователя
  const { user, isLoading: isUserLoading, isError: isUserError } = useUser();

  // Получаем данные уведомлений через WebSocket
  const {
    notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
    deleteNotification,
  } = useNotificationSocket();

  // Преобразуем уведомления в формат напоминаний
  const remindersFromNotifications: any = notifications.map((notification) => {
    const isAlert = notification.type === "alert";

    return {
      id: notification.id.toString(),
      title: notification.title,
      description: notification.isCompleted
        ? "Выполнено"
        : isAlert
        ? `Вчера вы пропустили приём ${notification.title}`
        : `Следующий приём через ${notification.time}`,
      time: notification.time,
      isAlert,
      isCompleted: notification.isCompleted,
      type: notification.type,
    };
  });

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
      id: "sparkteeth",
      title: "Анализ полости рта",
      icon: ToothIcon,
      color: "bg-blue-500",
      to: "/spark-teeth",
    },
    {
      id: "sparkdoctor",
      title: "Анализ документов",
      icon: File,
      color: "bg-green-500",
      to: "/spark-doctor",
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
  ];

  // Данные для рекомендаций AI
  const aiRecommendations = [
    "Сделайте перерыв и выполните дыхательную практику",
    "Выпейте стакан воды, вы немного обезвожены",
    "Пройдитесь 10 минут для улучшения кровообращения",
  ];

  // Получаем приветствие в зависимости от времени суток
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Доброй ночи";
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
  };

  // Обработчик для удаления напоминания
  const handleDeleteReminder = async (id: string) => {
    await deleteNotification(Number(id));
  };

  // Обработчик для отметки напоминания как выполненного
  const handleCompleteReminder = async (id: string) => {
    // Здесь можно добавить логику для отметки напоминания как выполненного
    console.log("Reminder completed:", id);
    // Например:
    // await markAsCompleted(Number(id))
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
            {isUserLoading ? (
              <>
                <Skeleton className="h-8 w-64 bg-white/30 mb-2" />
                <Skeleton className="h-5 w-80 bg-white/20" />
              </>
            ) : isUserError ? (
              <div className="text-white">
                <p className="text-xl font-medium">
                  Не удалось загрузить данные
                </p>
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
        </motion.div>
      </div>
      <div className="px-6 mt-8 mb-8 space-y-[48px]">
        {/* {notificationsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="flex items-center gap-2">
              Ошибка соединения
            </AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>Не удалось подключиться к серверу уведомлений.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={reconnect}
                className="self-start"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Повторить подключение
              </Button>
            </AlertDescription>
          </Alert>
        )} */}
        <QuickActionsWidget actions={quickActions} />
        <RemindersWidget
          reminders={remindersFromNotifications}
          isLoading={isNotificationsLoading}
          onCompleteReminder={handleCompleteReminder}
          onDeleteReminder={handleDeleteReminder}
        />
        <AiRecommendationsWidget recommendations={aiRecommendations} />
      </div>
    </MainLayout>
  );
};
