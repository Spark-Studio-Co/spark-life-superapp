"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { MainLayout } from "@/shared/ui/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  FileImage,
  Activity,
  RefreshCw,
  LogOut,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUser } from "@/entities/user/hooks/use-user";
import { useAuth } from "@/entities/auth/hooks/use-auth";
import { useState } from "react";

export const ProfilePage = () => {
  const { user, isLoading, isError, refetch } = useUser();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Получаем инициалы пользователя для аватара
  const getInitials = () => {
    if (!user) return "ПП";
    return `${user.first_name.charAt(0)}${user.last_name.charAt(
      0
    )}`.toUpperCase();
  };


  // Обработчик выхода из системы
  const handleLogout = () => {
    setIsLoggingOut(true);
    // Вызываем функцию logout из хука useAuth, которая:
    // 1. Вызывает API для выхода из системы
    // 2. Удаляет токены из localStorage
    // 3. Перенаправляет на страницу входа
    logout();
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Профиль</h1>
            <p className="text-blue-100">
              Управляйте своими данными и настройками
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {isError ? (
            <motion.div variants={itemVariants} className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Не удалось загрузить данные профиля
              </p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="mx-auto flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Повторить загрузку
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                      <AvatarImage
                        src="/thoughtful-woman-profile.png"
                        alt={user?.first_name}
                      />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">
                        {user
                          ? `${user.first_name} ${user.last_name}`
                          : "Загрузка..."}
                      </h2>
                      <p className="text-gray-500">
                        {user?.email || "Загрузка..."}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Медицинская информация</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isLoading ? (
                      <>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="py-2">
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Возраст</span>
                          <span className="font-medium">
                            {user?.age || "Не указан"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Пол</span>
                          <span className="font-medium">
                            {user?.gender || "Не указан"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Рост</span>
                          <span className="font-medium">
                            {user?.height ? `${user.height} см` : "Не указан"}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500">Вес</span>
                          <span className="font-medium">
                            {user?.weight ? `${user.weight} кг` : "Не указан"}
                          </span>
                        </div>
                        <Separator />
                        <div className="py-2">
                          <span className="block text-gray-500 mb-1">Заболевания:</span>
                          <div className="flex flex-wrap gap-2">
                            {user?.diseases && user.diseases.length > 0 ? (
                              user.diseases.map((disease, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                >
                                  {disease}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">Не указано</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="hover:bg-transparent text-red-400 border-red-400 hover:text-red-400 mt-4"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Выход..." : "Выйти"}
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link to="/health-stats" className="block">
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all duration-300">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-md">
                            <Activity className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              Моя статистика
                            </h3>
                            <p className="text-sm text-gray-500">
                              Просмотр показателей здоровья
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link to="/documents" className="block">
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all duration-300">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-md">
                            <FileImage className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              Мои документы
                            </h3>
                            <p className="text-sm text-gray-500">
                              Управление медицинскими файлами
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group mb-16"
                >
                  <Link to="/settings" className="block">
                    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all duration-300">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-md">
                            <Settings className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">Настройки</h3>
                            <p className="text-sm text-gray-500">
                              Редактирование медицинской информации
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};
