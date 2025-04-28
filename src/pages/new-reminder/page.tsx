"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Bell,
  Repeat,
  Pill,
  Stethoscope,
  Activity,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NewReminderPage() {
  const navigate = useNavigate();
  const [reminderType, setReminderType] = useState("medication");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [reminderDate, setReminderDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("daily");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!reminderTitle.trim()) {
      toast.error("Пожалуйста, введите название напоминания");
      return;
    }

    // Here you would typically save the reminder to your state/database
    toast.success("Напоминание успешно создано!");

    // Navigate back to reminders page
    setTimeout(() => {
      navigate("/reminders");
    }, 1000);
  };

  const reminderTypeOptions = [
    {
      id: "medication",
      label: "Лекарство",
      icon: <Pill className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      id: "appointment",
      label: "Прием врача",
      icon: <Stethoscope className="h-5 w-5 text-purple-500" />,
      color: "bg-purple-100",
    },
    {
      id: "measurement",
      label: "Измерение",
      icon: <Activity className="h-5 w-5 text-green-500" />,
      color: "bg-green-100",
    },
    {
      id: "hydration",
      label: "Питьевой режим",
      icon: <Droplet className="h-5 w-5 text-cyan-500" />,
      color: "bg-cyan-100",
    },
    {
      id: "other",
      label: "Другое",
      icon: <Bell className="h-5 w-5 text-amber-500" />,
      color: "bg-amber-100",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-4 text-white">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            asChild
          >
            <Link to="/reminder">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Новое напоминание</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reminder Type */}
          <Card className="border-none rounded-xl shadow-md overflow-hidden">
            <CardContent className="p-4">
              <Label className="text-sm text-gray-500 mb-3 block">
                Тип напоминания
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reminderTypeOptions.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 border ${reminderType === type.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200"
                      }`}
                    onClick={() => setReminderType(type.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center mb-2`}
                    >
                      {type.icon}
                    </div>
                    <span className="text-sm">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reminder Details */}
          <Card className="border-none rounded-xl shadow-md overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm text-gray-500 mb-1 block"
                >
                  Название
                </Label>
                <Input
                  id="title"
                  placeholder={
                    reminderType === "medication"
                      ? "Например: Амлодипин"
                      : reminderType === "appointment"
                        ? "Например: Визит к кардиологу"
                        : reminderType === "measurement"
                          ? "Например: Измерить давление"
                          : "Введите название напоминания"
                  }
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="border-gray-200"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm text-gray-500 mb-1 block"
                >
                  Описание (необязательно)
                </Label>
                <Textarea
                  id="description"
                  placeholder={
                    reminderType === "medication"
                      ? "Например: 10мг, 1 таблетка"
                      : reminderType === "appointment"
                        ? "Например: Клиника на ул. Ленина"
                        : reminderType === "measurement"
                          ? "Например: Утренний замер"
                          : "Введите описание"
                  }
                  value={reminderDescription}
                  onChange={(e) => setReminderDescription(e.target.value)}
                  className="border-gray-200 resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="time"
                    className="text-sm text-gray-500 mb-1 block"
                  >
                    Время
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="time"
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="pl-9 border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="date"
                    className="text-sm text-gray-500 mb-1 block"
                  >
                    Дата
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="pl-9 border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recurrence */}
          <Card className="border-none rounded-xl shadow-md overflow-hidden">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="h-5 w-5 text-gray-500" />
                  <Label
                    htmlFor="recurring"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Повторяющееся напоминание
                  </Label>
                </div>
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>

              {isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label
                    htmlFor="recurrence"
                    className="text-sm text-gray-500 mb-1 block"
                  >
                    Повторять
                  </Label>
                  <Select
                    value={recurrencePattern}
                    onValueChange={setRecurrencePattern}
                  >
                    <SelectTrigger id="recurrence" className="border-gray-200">
                      <SelectValue placeholder="Выберите частоту" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                      <SelectItem value="weekdays">По будням</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-4 pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-6 rounded-xl shadow-lg"
            >
              Создать напоминание
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
