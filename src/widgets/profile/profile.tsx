"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import { Link } from "react-router-dom";

export const ProfileWidget = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Здесь должна быть логика переключения темы
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4">
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

      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Медицинская информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Link to="/profile/settings">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span>Настройки</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </Link>

        <Link to="/profile/notifications">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center">
              <Bell className="mr-2 h-4 w-4 text-gray-500" />
              <span>Уведомления</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </Link>

        <Link to="/profile/payment">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
              <span>Способы оплаты</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </Link>

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

        <Link to="/help">
          <Button variant="ghost" className="w-full justify-between">
            <div className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4 text-gray-500" />
              <span>Помощь и поддержка</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Button>
        </Link>

        <Separator className="my-2" />

        <Button variant="ghost" className="w-full justify-start text-red-500">
          <div className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
};
