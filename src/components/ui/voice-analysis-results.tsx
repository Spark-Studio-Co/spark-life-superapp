// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orb } from "@/components/ui/orb";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Brain,
  Sparkles,
  ThermometerSun,
  Zap,
  ArrowLeft,
  Download
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface AnalysisResult {
  anxiety_level: number;
  stress_level: number;
  emotional_stability: number;
  energy_level: number;
  summary: string;
}

export function VoiceAnalysisResults() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка результатов из localStorage
  useEffect(() => {
    try {
      // Имитация небольшой задержки для показа анимации загрузки
      const timer = setTimeout(() => {
        // Получаем данные из localStorage
        const storedResults = localStorage.getItem('voice_analysis_results');

        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          console.log('Parsed results from localStorage:', parsedResults);
          console.log('Types of values:', {
            anxiety_level: typeof parsedResults.anxiety_level,
            stress_level: typeof parsedResults.stress_level,
            emotional_stability: typeof parsedResults.emotional_stability,
            energy_level: typeof parsedResults.energy_level
          });
          setResult(parsedResults);
        } else {
          // Если данных нет, используем тестовые данные
          const mockResult = {
            anxiety_level: 65,
            stress_level: 70,
            emotional_stability: 40,
            energy_level: 55,
            summary: "Умеренная тревожность и повышенный стресс. Требуется работа над эмоциональной устойчивостью."
          };
          setResult(mockResult);
          console.log('Результаты анализа не найдены, используются тестовые данные');
        }

        setLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Ошибка при загрузке результатов:', error);
      setLoading(false);
    }
  }, []);

  // Функция для определения цвета прогресс-бара на основе значения
  const getProgressColor = (value: number, type: string) => {
    // Для эмоциональной устойчивости высокие значения - это хорошо
    if (type === 'emotional_stability') {
      if (value > 70) return "bg-green-500";
      if (value > 50) return "bg-yellow-500";
      if (value > 30) return "bg-orange-500";
      return "bg-red-500";
    } else {
      // Для тревожности, стресса и энергии низкие значения тревожности и стресса - это хорошо
      if (type === 'anxiety_level' || type === 'stress_level') {
        if (value < 30) return "bg-green-500";
        if (value < 50) return "bg-yellow-500";
        if (value < 70) return "bg-orange-500";
        return "bg-red-500";
      } else {
        // Для энергии высокие значения - это хорошо, но очень высокие - плохо
        if (value > 85) return "bg-red-500";
        if (value > 70) return "bg-green-500";
        if (value > 40) return "bg-yellow-500";
        return "bg-orange-500";
      }
    }
  };

  // Функция для определения текстового статуса на основе значения
  const getStatusText = (value: number, type: string) => {
    // Для эмоциональной устойчивости
    if (type === 'emotional_stability') {
      if (value > 70) return "Высокая";
      if (value > 50) return "Средняя";
      if (value > 30) return "Ниже среднего";
      return "Низкая";
    }
    // Для тревожности и стресса
    else if (type === 'anxiety_level' || type === 'stress_level') {
      if (value < 30) return "Низкий";
      if (value < 50) return "Средний";
      if (value < 70) return "Повышенный";
      return "Высокий";
    }
    // Для энергии
    else {
      if (value > 85) return "Чрезмерный";
      if (value > 70) return "Высокий";
      if (value > 40) return "Средний";
      return "Низкий";
    }
  };

  // Функция для определения цвета бейджа статуса
  const getBadgeColor = (value: number, type: string) => {
    // Для эмоциональной устойчивости высокие значения - это хорошо
    if (type === 'emotional_stability') {
      if (value > 70) return 'bg-green-100 text-green-700';
      if (value > 50) return 'bg-yellow-100 text-yellow-700';
      if (value > 30) return 'bg-orange-100 text-orange-700';
      return 'bg-red-100 text-red-700';
    }
    // Для тревожности и стресса низкие значения - это хорошо
    else if (type === 'anxiety_level' || type === 'stress_level') {
      if (value < 30) return 'bg-green-100 text-green-700';
      if (value < 50) return 'bg-yellow-100 text-yellow-700';
      if (value < 70) return 'bg-orange-100 text-orange-700';
      return 'bg-red-100 text-red-700';
    }
    // Для энергии высокие значения - это хорошо, но очень высокие - плохо
    else {
      if (value > 85) return 'bg-red-100 text-red-700';
      if (value > 70) return 'bg-green-100 text-green-700';
      if (value > 40) return 'bg-yellow-100 text-yellow-700';
      return 'bg-orange-100 text-orange-700';
    }
  };

  // Функция для получения иконки для каждого параметра
  const getIcon = (type: string) => {
    switch (type) {
      case 'anxiety_level':
        return <ThermometerSun className="h-5 w-5 text-blue-500" />;
      case 'stress_level':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'emotional_stability':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'energy_level':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Функция для получения названия параметра
  const getParameterName = (type: string) => {
    switch (type) {
      case 'anxiety_level':
        return "Уровень тревожности";
      case 'stress_level':
        return "Уровень стресса";
      case 'emotional_stability':
        return "Эмоциональная устойчивость";
      case 'energy_level':
        return "Уровень энергии";
      default:
        return type;
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-md mx-auto">
      <div className="w-full flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 pr-10">Результаты анализа</h1>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px]"
          >
            <Orb
              size={200}
              color="#3b82f6"
              speed={1.5}
              className="mb-6"
            />
            <p className="text-muted-foreground">Анализируем ваши ответы...</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Общий сводный блок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Общая оценка</h2>
                    <p className="text-sm text-muted-foreground">{result?.summary}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Детальные показатели */}
            <div className="space-y-4">
              {result && Object.entries(result)
                .filter(([key]) => key !== 'summary')
                .map(([key, value], index) => {
                  const numericValue = Number(value);

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {getIcon(key)}
                          <h3 className="font-medium">{getParameterName(key)}</h3>
                          <span className={`ml-auto text-sm px-2 py-0.5 rounded-full ${getBadgeColor(numericValue, key)}`}>
                            {getStatusText(numericValue, key)}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{Math.round(Number(value))}</span>
                            <span>100</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
                            <div
                              className={`h-full ${getProgressColor(numericValue, key)} transition-all`}
                              style={{ width: `${numericValue}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
            </div>

            {/* Рекомендации */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6"
            >
              <Card className="p-6 border-blue-100">
                <h3 className="font-semibold mb-3">Рекомендации</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-600 text-xs">1</span>
                    </div>
                    <span>Практикуйте техники релаксации и глубокого дыхания для снижения уровня тревожности</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-600 text-xs">2</span>
                    </div>
                    <span>Обратите внимание на режим сна и физическую активность для повышения энергии</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-blue-600 text-xs">3</span>
                    </div>
                    <span>Рассмотрите возможность консультации со специалистом для работы над эмоциональной устойчивостью</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Кнопки действий */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex gap-3 mb-8"
            >
              <Button
                className="flex-1"
                onClick={() => navigate(getClinicUrlByAnalysisType("sparkvoice"))}
              >
                Записаться на прием
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
