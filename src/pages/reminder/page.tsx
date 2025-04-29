//@ts-nocheck

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  AlertCircle,
  Pill,
  Stethoscope,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationSocket } from "@/entities/notification/hooks/use-notification";

export function RemindersPage() {
  // In a real application, you would get the userId from authentication
  const userId = 1;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const {
    notifications,
    isConnected,
    isLoading,
    error,
    reconnect,
    markAsCompleted,
    fetchNotifications,
  } = useNotificationSocket();

  // Create a stable reference to the icons to prevent re-renders
  const iconMap = {
    appointment: <Calendar className="h-5 w-5 text-purple-500" />,
    measurement: <Stethoscope className="h-5 w-5 text-green-500" />,
    alert: <AlertCircle className="h-5 w-5 text-red-500" />,
    medication: <Pill className="h-5 w-5 text-blue-500" />,
    default: <Clock className="h-5 w-5 text-blue-500" />,
  };

  // Filter notifications based on search query and active tab
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by search query
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "medications")
      return matchesSearch && notification.type === "medication";
    if (activeTab === "measurements")
      return matchesSearch && notification.type === "measurement";
    if (activeTab === "appointments")
      return matchesSearch && notification.type === "appointment";
    if (activeTab === "missed")
      return matchesSearch && notification.type === "alert";
    if (activeTab === "completed")
      return matchesSearch && notification.isCompleted;

    return matchesSearch;
  });

  const handleRetry = () => {
    reconnect();
    fetchNotifications();
  };

  const ReminderCard = ({ notification }: { notification: any }) => {
    const getColors = () => {
      if (notification.type === "alert") {
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          badge: "bg-red-50 text-red-600 border-red-200",
        };
      }
      switch (notification.type) {
        case "appointment":
          return {
            bg: "bg-purple-100",
            text: "text-purple-600",
            badge: "bg-purple-50 text-purple-600 border-purple-200",
          };
        case "measurement":
          return {
            bg: "bg-green-100",
            text: "text-green-600",
            badge: "bg-green-50 text-green-600 border-green-200",
          };
        case "medication":
        default:
          return {
            bg: "bg-blue-100",
            text: "text-blue-600",
            badge: "bg-blue-50 text-blue-600 border-blue-200",
          };
      }
    };

    const colors = getColors();
    const icon =
      iconMap[notification.type as keyof typeof iconMap] || iconMap.default;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 rounded-xl">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${colors.bg}`}
          >
            <div className="h-6 w-6 ml-0.5 mt-0.5">{icon}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-semibold truncate ${colors.text}`}>
                {notification.title}
              </h3>
              <Badge variant="outline" className={`${colors.badge} text-xs`}>
                {notification.time}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {notification.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Напоминания
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-blue-600 hover:bg-white/90 shadow-sm"
            asChild
          >
            <Link to="/reminders/new">
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </Link>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
          <Input
            placeholder="Поиск напоминаний..."
            className="pl-9 bg-white/90 border-0 text-blue-600 rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Tabs
        defaultValue="all"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-4">
          <TabsList className="w-full bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="all" className="text-xs rounded-lg font-medium">
              Все
            </TabsTrigger>
            <TabsTrigger
              value="medications"
              className="text-xs rounded-lg font-medium"
            >
              Лекарства
            </TabsTrigger>
            <TabsTrigger
              value="measurements"
              className="text-xs rounded-lg font-medium"
            >
              Измерения
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="text-xs rounded-lg font-medium"
            >
              Приемы
            </TabsTrigger>
            <TabsTrigger
              value="missed"
              className="text-xs rounded-lg font-medium"
            >
              Пропущенные
            </TabsTrigger>
          </TabsList>
        </div>
        {["all", "medications", "measurements", "appointments", "missed"].map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 p-4">
              {isLoading ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                  <p className="text-gray-500">Загрузка напоминаний...</p>
                </div>
              ) : !isConnected ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
                  <p className="text-gray-500">Подключение к серверу...</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleRetry}
                  >
                    Повторить
                  </Button>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500">Ошибка загрузки напоминаний</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Повторить
                  </Button>
                </div>
              ) : (
                <div className="border-none rounded-xl overflow-hidden">
                  {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification) => (
                        <Card key={notification.id} className="rounded-xl p-4">
                          <ReminderCard notification={notification} />
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Напоминания не найдены</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
