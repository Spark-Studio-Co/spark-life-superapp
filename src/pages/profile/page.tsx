"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { MainLayout } from "@/shared/ui/layout";

export const ProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Здесь должна быть логика переключения темы
  };

  return (
    <MainLayout>
      <div className="bg-blue-500 px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white">Профиль</h1>
        <p className="text-blue-100">Управляйте своими данными и настройками</p>
      </div>

      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4"
        >
          <Avatar className="h-16 w-16 border-2 border-white shadow-md">
            <AvatarImage
              src="/thoughtful-woman-profile.png"
              alt="Sarah Johnson"
            />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">Сара Джонсон</h2>
            <p className="text-gray-500">sarah.johnson@example.com</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-4">
            <h3 className="font-semibold mb-2">Медицинская информация</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Дата рождения</span>
                <span className="font-medium">12 мая 1985</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Группа крови</span>
                <span className="font-medium">O+</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Рост</span>
                <span className="font-medium">170 см</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Вес</span>
                <span className="font-medium">65.8 кг</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Аллергии</span>
                <span className="font-medium">Пенициллин</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <Button variant="ghost" className="w-full justify-between" asChild>
            <div className="flex items-center">
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4 text-gray-500" />
                <span>Настройки</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button variant="ghost" className="w-full justify-between" asChild>
            <div className="flex items-center">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4 text-gray-500" />
                <span>Уведомления</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button variant="ghost" className="w-full justify-between" asChild>
            <div className="flex items-center">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                <span>Способы оплаты</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={toggleDarkMode}
          >
            <div className="flex items-center">
              {isDarkMode ? (
                <Moon className="mr-2 h-4 w-4 text-gray-500" />
              ) : (
                <Sun className="mr-2 h-4 w-4 text-gray-500" />
              )}
              <span>Тёмная тема</span>
            </div>
            <div
              className={`w-10 h-5 rounded-full relative ${
                isDarkMode ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white absolute top-0.5"
                initial={false}
                animate={{ left: isDarkMode ? "calc(100% - 18px)" : "2px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </Button>

          <Button variant="ghost" className="w-full justify-between" asChild>
            <div className="flex items-center">
              <div className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4 text-gray-500" />
                <span>Помощь и поддержка</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Button>

          <Separator className="my-2" />

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500"
            asChild
          >
            <div className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </div>
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
