"use client";

import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  Bell,
  Droplets,
  Mic,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MainLayout } from "@/shared/ui/layout";
import { ModuleCard } from "@/entities/modules/ui/module-card";

export const ModulesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const modules = [
    {
      id: "sparkface",
      title: "Анализ лица",
      description: "Диагностика кожных заболеваний по фото",
      icon: Camera,
      color: "bg-orange-500",
      to: "/spark-face",
    },
    {
      id: "sparkremind",
      title: "Напоминания",
      description: "Умные напоминания о лекарствах с AI-предсказаниями",
      icon: Bell,
      color: "bg-purple-500",
      to: "/reminder",
    },
    {
      id: "sparkwater",
      title: "Гидратация",
      description: "Анализ качества воды по фото или через устройство",
      icon: Droplets,
      color: "bg-cyan-500",
      to: "/hydration",
    },
    {
      id: "sparkvoice",
      title: "Анализ речи",
      description: "Анализ речи на признаки депрессии",
      icon: Mic,
      color: "bg-rose-500",
      to: "/spark-voice",
    },
  ];

  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white">Все модули</h1>
        <p className="text-blue-100">Выберите нужный модуль</p>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-md p-3 flex items-center mb-6">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Поиск модулей..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module, index) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              color={module.color}
              to={module.to}
              delay={index}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-500"
            >
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg">Модули не найдены</p>
              <p className="text-sm">Попробуйте изменить поисковый запрос</p>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
