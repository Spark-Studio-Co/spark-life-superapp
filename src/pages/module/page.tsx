"use client";

import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MainLayout } from "@/shared/ui/layout";

export const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();

  // Данные о модулях (в реальном приложении это может быть получено из API или контекста)
  const moduleData: Record<
    string,
    { title: string; description: string; color: string }
  > = {
    sparkface: {
      title: "SparkFace",
      description: "Раннее выявление диабета по селфи",
      color: "bg-orange-500",
    },
    sparkcare: {
      title: "SparkCare",
      description: "AI-консультант здоровья с поддержкой нескольких языков",
      color: "bg-blue-500",
    },
    sparkremind: {
      title: "SparkRemind",
      description: "Умные напоминания о лекарствах с AI-предсказаниями",
      color: "bg-purple-500",
    },
    sparkmind: {
      title: "SparkMind",
      description: "Мониторинг психического здоровья и рекомендации",
      color: "bg-indigo-500",
    },
    sparktherapist: {
      title: "SparkTherapist",
      description: "Виртуальный терапевт на основе NLP",
      color: "bg-pink-500",
    },
    sparknutrition: {
      title: "SparkNutrition",
      description: "Диагностика недоедания по фото ребёнка",
      color: "bg-green-500",
    },
    sparkwater: {
      title: "SparkWater",
      description: "Анализ качества воды по фото или через устройство",
      color: "bg-cyan-500",
    },
    sparkskin: {
      title: "SparkSkin",
      description: "Диагностика кожных заболеваний по фото",
      color: "bg-amber-500",
    },
    sparkmove: {
      title: "SparkMove",
      description: "Физическая активность для пожилых людей",
      color: "bg-lime-500",
    },
    sparkvoice: {
      title: "SparkVoice",
      description: "Анализ речи на признаки депрессии",
      color: "bg-rose-500",

    },
  };

  const module = moduleData[moduleId || ""] || {
    title: "Модуль не найден",
    description: "Запрошенный модуль не существует",
    color: "bg-gray-500",
  };

  return (
    <MainLayout>
      <div className={`${module.color} px-4 pt-6 pb-14`}>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mr-2 text-white hover:bg-white/20"
          >
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Назад</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{module.title}</h1>
            <p className="text-white/80">{module.description}</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-10 mb-6">
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Модуль находится в разработке</p>
            <p className="text-sm text-gray-400">
              Скоро здесь появится функциональность {module.title}
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};
