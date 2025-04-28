"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StressTestResultsProps {
  score: number;
  onRestart: () => void;
}

interface ResultCategory {
  range: [number, number];
  title: string;
  description: string;
  color: string;
  recommendations: string[];
}

const resultCategories: ResultCategory[] = [
  {
    range: [0, 13],
    title: "Низкий уровень стресса",
    description:
      "У вас низкий уровень стресса. Продолжайте поддерживать здоровый образ жизни и практики управления стрессом.",
    color: "bg-green-500",
    recommendations: [
      "Продолжайте практиковать техники релаксации",
      "Поддерживайте регулярную физическую активность",
      "Уделяйте время хобби и отдыху",
      "Сохраняйте здоровый режим сна",
    ],
  },
  {
    range: [14, 26],
    title: "Умеренный уровень стресса",
    description:
      "У вас умеренный уровень стресса. Обратите внимание на факторы, вызывающие стресс, и примите меры для их снижения.",
    color: "bg-yellow-500",
    recommendations: [
      "Практикуйте глубокое дыхание и медитацию",
      "Увеличьте физическую активность",
      "Улучшите организацию времени",
      "Обратите внимание на качество сна",
      "Ограничьте потребление кофеина и алкоголя",
    ],
  },
  {
    range: [27, 40],
    title: "Высокий уровень стресса",
    description:
      "У вас высокий уровень стресса. Рекомендуется принять активные меры для его снижения и, возможно, обратиться за профессиональной помощью.",
    color: "bg-red-500",
    recommendations: [
      "Обратитесь к специалисту по психическому здоровью",
      "Практикуйте ежедневную медитацию и техники осознанности",
      "Пересмотрите свой график и обязанности",
      "Увеличьте время на отдых и восстановление",
      "Обратите внимание на питание и физическую активность",
      "Ограничьте воздействие стрессовых факторов",
    ],
  },
];

export function StressTestResults({
  score,
  onRestart,
}: StressTestResultsProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const maxScore = 40;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const getResultCategory = () => {
    return (
      resultCategories.find(
        (category) => score >= category.range[0] && score <= category.range[1]
      ) || resultCategories[0]
    );
  };

  const resultCategory = getResultCategory();
  const scorePercentage = (score / maxScore) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onRestart}>
            <RefreshCw className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Результаты теста
          </h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 overflow-hidden border-none shadow-lg">
            <div className={`h-2 ${resultCategory.color}`} />
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {resultCategory.title}
                </h2>
                <p className="text-gray-600">{resultCategory.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Ваш результат</span>
                  <span className="font-medium">
                    {animatedScore} из {maxScore}
                  </span>
                </div>
                <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className={`absolute top-0 left-0 h-full ${resultCategory.color}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${scorePercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Низкий</span>
                  <span>Умеренный</span>
                  <span>Высокий</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Рекомендации</h3>
              <ul className="space-y-3">
                {resultCategory.recommendations.map((recommendation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="flex items-start"
                  >
                    <div
                      className={`mt-1 h-2 w-2 rounded-full ${resultCategory.color} mr-3`}
                    />
                    <span>{recommendation}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              Получить подробный отчет
              <Download className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onRestart}>
              Пройти тест снова
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="ghost">
              Перейти к упражнениям для снижения стресса
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
