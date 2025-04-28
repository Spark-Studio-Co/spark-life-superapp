"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StressTestResults } from "./result";
import { MainLayout } from "@/shared/ui/layout";

interface Question {
  id: number;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Как часто за последний месяц вы чувствовали себя расстроенным из-за чего-то, что произошло неожиданно?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
  {
    id: 2,
    text: "Как часто за последний месяц вы чувствовали, что не можете контролировать важные события в своей жизни?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
  {
    id: 3,
    text: "Как часто за последний месяц вы чувствовали себя нервным и напряженным?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
  {
    id: 4,
    text: "Как часто за последний месяц вы чувствовали уверенность в своей способности справляться с личными проблемами?",
    options: [
      { value: 4, label: "Никогда" },
      { value: 3, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 1, label: "Довольно часто" },
      { value: 0, label: "Очень часто" },
    ],
  },
  {
    id: 5,
    text: "Как часто за последний месяц вы чувствовали, что дела идут так, как вы хотите?",
    options: [
      { value: 4, label: "Никогда" },
      { value: 3, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 1, label: "Довольно часто" },
      { value: 0, label: "Очень часто" },
    ],
  },
  {
    id: 6,
    text: "Как часто за последний месяц вы обнаруживали, что не можете справиться со всеми делами, которые должны сделать?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
  {
    id: 7,
    text: "Как часто за последний месяц вы могли контролировать раздражение?",
    options: [
      { value: 4, label: "Никогда" },
      { value: 3, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 1, label: "Довольно часто" },
      { value: 0, label: "Очень часто" },
    ],
  },
  {
    id: 8,
    text: "Как часто за последний месяц вы чувствовали, что владеете ситуацией?",
    options: [
      { value: 4, label: "Никогда" },
      { value: 3, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 1, label: "Довольно часто" },
      { value: 0, label: "Очень часто" },
    ],
  },
  {
    id: 9,
    text: "Как часто за последний месяц вы злились из-за вещей, которые были вне вашего контроля?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
  {
    id: 10,
    text: "Как часто за последний месяц вы чувствовали, что трудности накапливаются так сильно, что вы не можете их преодолеть?",
    options: [
      { value: 0, label: "Никогда" },
      { value: 1, label: "Почти никогда" },
      { value: 2, label: "Иногда" },
      { value: 3, label: "Довольно часто" },
      { value: 4, label: "Очень часто" },
    ],
  },
];

export function StressTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setAnswers({ ...answers, [currentQuestion.id]: value });

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResults(true);
      }
      setIsAnimating(false);
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsAnimating(false);
      }, 400);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  if (showResults) {
    return (
      <StressTestResults score={calculateScore()} onRestart={handleRestart} />
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Тест на уровень стресса
            </h1>
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>
                Вопрос {currentQuestionIndex + 1} из {questions.length}
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="mb-6 shadow-lg border-none">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-4">
                  {currentQuestion.text}
                </h2>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full justify-between text-left h-auto py-4 px-5 ${
                      answers[currentQuestion.id] === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <span>{option.label}</span>
                    {answers[currentQuestion.id] === option.value && (
                      <Check className="h-5 w-5 text-blue-500" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else {
                    setShowResults(true);
                  }
                }}
                disabled={!answers[currentQuestion.id]}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Пропустить"
                  : "Результаты"}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
