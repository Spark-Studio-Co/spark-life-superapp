// @ts-nocheck

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
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reminder } from "@/entities/reminder/model/types";

export function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [completedReminders, setCompletedReminders] = useState<string[]>([]);

  // Mock data for reminders
  const reminders: Reminder[] = [
    {
      id: "1",
      title: "Амлодипин",
      description: "10мг, 1 таблетка",
      time: "08:00",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "2",
      title: "Метформин",
      description: "500мг, 1 таблетка",
      time: "13:00",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "3",
      title: "Аторвастатин",
      description: "20мг, 1 таблетка",
      time: "20:00",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "4",
      title: "Измерить давление",
      description: "Утренний замер",
      time: "09:00",
      icon: <Clock className="h-5 w-5 text-green-500" />,
    },
    {
      id: "5",
      title: "Измерить уровень сахара",
      description: "Натощак",
      time: "07:30",
      icon: <Clock className="h-5 w-5 text-green-500" />,
    },
    {
      id: "6",
      title: "Визит к кардиологу",
      description: "Клиника на ул. Ленина",
      time: "15:00",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "7",
      title: "Аспирин",
      description: "100мг, 1 таблетка",
      time: "вчера, 21:00",
      isAlert: true,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
  ];

  const toggleComplete = (id: string) => {
    setCompletedReminders((prev) =>
      prev.includes(id)
        ? prev.filter((reminderId) => reminderId !== id)
        : [...prev, id]
    );
  };

  const filteredReminders = reminders.filter((reminder) => {
    // Filter by search query
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "medications")
      return (
        matchesSearch &&
        !reminder.isAlert &&
        reminder.icon.type === Clock &&
        reminder.title !== "Измерить давление" &&
        reminder.title !== "Измерить уровень сахара"
      );
    if (activeTab === "measurements")
      return (
        matchesSearch &&
        (reminder.title === "Измерить давление" ||
          reminder.title === "Измерить уровень сахара")
      );
    if (activeTab === "appointments")
      return matchesSearch && reminder.icon.type === Calendar;
    if (activeTab === "missed") return matchesSearch && reminder.isAlert;
    if (activeTab === "completed")
      return matchesSearch && completedReminders.includes(reminder.id);

    return matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
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
            className="bg-white text-amber-600 hover:bg-white/90"
            asChild
          >
            <Link to="/reminders/new">
              <Plus className="h-4 w-4 mr-1" />
              Добавить
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-600" />
          <Input
            placeholder="Поиск напоминаний..."
            className="pl-9 bg-white/90 border-0 text-amber-900 placeholder:text-amber-400 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
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
                              : reminder.icon.type === Calendar
                              ? "bg-purple-100"
                              : reminder.title === "Измерить давление" ||
                                reminder.title === "Измерить уровень сахара"
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
                              : reminder.icon.type === Calendar
                              ? "bg-purple-50 text-purple-600 border-purple-200"
                              : reminder.title === "Измерить давление" ||
                                reminder.title === "Измерить уровень сахара"
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
        </TabsContent>

        {/* Other tab contents have the same structure */}
        <TabsContent value="medications" className="mt-0 p-4">
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
        </TabsContent>

        {/* Similar structure for other tabs */}
        <TabsContent value="measurements" className="mt-0 p-4">
          {/* Similar content */}
        </TabsContent>
        <TabsContent value="appointments" className="mt-0 p-4">
          {/* Similar content */}
        </TabsContent>
        <TabsContent value="missed" className="mt-0 p-4">
          {/* Similar content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
