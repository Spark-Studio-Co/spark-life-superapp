"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { MainLayout } from "@/shared/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"

import { ChevronRight, FileImage, Activity } from "lucide-react"

export const ProfilePage = () => {
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
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white">Профиль</h1>
        <p className="text-blue-100">Управляйте своими данными и настройками</p>
      </div>
      <div className="px-4 py-4">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src="/thoughtful-woman-profile.png" alt="Sarah Johnson" />
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

          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
              <Link to="/health-stats" className="block">
                <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-md">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Моя статистика</h3>
                        <p className="text-sm text-gray-500">Просмотр показателей здоровья</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group mb-16">
              <Link to="/documents" className="block">
                <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4facfe] to-[#00f2fe] flex items-center justify-center shadow-md">
                        <FileImage className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Мои документы</h3>
                        <p className="text-sm text-gray-500">Управление медицинскими файлами</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
