"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Plus,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Reminder } from "@/entities/reminder/model/types";
import { notificationService } from "@/entities/notification/api/notification.api";
import { useNotifications } from "@/entities/notification/hooks/use-notification";

export function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [completedReminders, setCompletedReminders] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Use the notifications hook
  const { notifications, isLoading, error, refetch } = useNotifications();

  // Convert notifications to reminders format
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const mappedReminders = notifications
        .map((notification) => {
          if (!notification) {
            console.error("Notification is undefined", notifications);
            return null;
          }

          let icon;

          switch (notification.type) {
            case "appointment":
              icon = <Calendar className="h-5 w-5 text-purple-500" />;
              break;
            case "measurement":
              icon = <Clock className="h-5 w-5 text-green-500" />;
              break;
            case "alert":
              icon = <AlertCircle className="h-5 w-5 text-red-500" />;
              break;
            case "medication":
            default:
              icon = <Clock className="h-5 w-5 text-blue-500" />;
              break;
          }

          return {
            id: notification.id ? notification.id.toString() : "", // Safely convert id to string
            title: notification.title || "",
            description: notification.description || "",
            time: notification.time || "",
            icon,
            isAlert: notification.type === "alert",
            type: notification.type,
            isCompleted: notification.isCompleted || false,
            end_date: notification.end_date,
            is_recurring: notification.is_recurring,
            recurrence_pattern: notification.recurrence_pattern,
          };
        })
        .filter(Boolean); // Remove any null items

      setReminders(mappedReminders);

      // Update completedReminders state based on notification data
      const completed = mappedReminders
        .filter((reminder) => reminder.isCompleted)
        .map((reminder) => reminder.id);

      setCompletedReminders(completed);
    } else {
      setReminders([]);
      setCompletedReminders([]);
    }
  }, [notifications]);

  const toggleComplete = async (id: string) => {
    try {
      const isCompleted = !completedReminders.includes(id);

      // Optimistically update UI
      setCompletedReminders((prev) =>
        isCompleted
          ? [...prev, id]
          : prev.filter((reminderId) => reminderId !== id)
      );

      // Call API to update notification status
      await notificationService.toggleNotificationStatus(id, isCompleted);

      // Refetch to ensure data consistency
      refetch();
    } catch (error) {
      console.error("Error toggling reminder completion:", error);
      // Revert optimistic update on error
      setCompletedReminders((prev) =>
        completedReminders.includes(id)
          ? prev
          : prev.filter((reminderId) => reminderId !== id)
      );
    }
  };

  const filteredReminders = reminders.filter((reminder) => {
    // Filter by search query
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "medications")
      return matchesSearch && reminder.type === "medication";
    if (activeTab === "measurements")
      return matchesSearch && reminder.type === "measurement";
    if (activeTab === "appointments")
      return matchesSearch && reminder.type === "appointment";
    if (activeTab === "missed") return matchesSearch && reminder.isAlert;
    if (activeTab === "completed")
      return matchesSearch && completedReminders.includes(reminder.id);

    return matchesSearch;
  });

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
            className="bg-white text-blue-600 hover:bg-white/90"
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
            className="pl-9 bg-white/90 border-0 text-blue-600 rounded-lg"
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
            <TabsTrigger value="all" className="text-xs rounded-lg">
              Все
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-xs rounded-lg">
              Лекарства
            </TabsTrigger>
            <TabsTrigger value="measurements" className="text-xs rounded-lg">
              Измерения
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-xs rounded-lg">
              Приемы
            </TabsTrigger>
            <TabsTrigger value="missed" className="text-xs rounded-lg">
              Пропущенные
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-0 p-4">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Загрузка напоминаний...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">Ошибка загрузки напоминаний</p>
            </div>
          ) : (
            <Card className="border-none rounded-xl overflow-hidden shadow-md">
              <CardContent className="p-0 divide-y divide-gray-100">
                {filteredReminders.length > 0 ? (
                  filteredReminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group"
                    >
                      <div
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleComplete(reminder.id)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              completedReminders.includes(reminder.id)
                                ? "bg-green-100"
                                : reminder.isAlert
                                ? "bg-red-100"
                                : reminder.type === "appointment"
                                ? "bg-purple-100"
                                : reminder.type === "measurement"
                                ? "bg-green-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {completedReminders.includes(reminder.id) ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              reminder.icon
                            )}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                completedReminders.includes(reminder.id)
                                  ? "line-through text-gray-400"
                                  : reminder.isAlert
                                  ? "text-red-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {reminder.title}
                            </h3>
                            <p
                              className={`text-sm ${
                                completedReminders.includes(reminder.id)
                                  ? "text-gray-400"
                                  : reminder.isAlert
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {reminder.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${
                              completedReminders.includes(reminder.id)
                                ? "bg-green-50 text-green-600 border-green-200"
                                : reminder.isAlert
                                ? "bg-red-50 text-red-600 border-red-200"
                                : reminder.type === "appointment"
                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                : reminder.type === "measurement"
                                ? "bg-green-50 text-green-600 border-green-200"
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            }`}
                          >
                            {reminder.time}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Напоминания не найдены</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tab contents have the same structure */}
        {["medications", "measurements", "appointments", "missed"].map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 p-4">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Загрузка напоминаний...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-500">Ошибка загрузки напоминаний</p>
                </div>
              ) : (
                <Card className="border-none rounded-xl overflow-hidden shadow-md">
                  <CardContent className="p-0 divide-y divide-gray-100">
                    {filteredReminders.length > 0 ? (
                      filteredReminders.map((reminder) => (
                        <motion.div
                          key={reminder.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group"
                        >
                          <div
                            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleComplete(reminder.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  completedReminders.includes(reminder.id)
                                    ? "bg-green-100"
                                    : reminder.isAlert
                                    ? "bg-red-100"
                                    : reminder.type === "appointment"
                                    ? "bg-purple-100"
                                    : reminder.type === "measurement"
                                    ? "bg-green-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                {completedReminders.includes(reminder.id) ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                  reminder.icon
                                )}
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`font-medium ${
                                    completedReminders.includes(reminder.id)
                                      ? "line-through text-gray-400"
                                      : reminder.isAlert
                                      ? "text-red-700"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {reminder.title}
                                </h3>
                                <p
                                  className={`text-sm ${
                                    completedReminders.includes(reminder.id)
                                      ? "text-gray-400"
                                      : reminder.isAlert
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {reminder.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${
                                  completedReminders.includes(reminder.id)
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : reminder.isAlert
                                    ? "bg-red-50 text-red-600 border-red-200"
                                    : reminder.type === "appointment"
                                    ? "bg-purple-50 text-purple-600 border-purple-200"
                                    : reminder.type === "measurement"
                                    ? "bg-green-50 text-green-600 border-green-200"
                                    : "bg-blue-50 text-blue-600 border-blue-200"
                                }`}
                              >
                                {reminder.time}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">Напоминания не найдены</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
