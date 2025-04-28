"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Moon, X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SleepGoalCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  hours: number;
}

export function SleepGoalCelebration({
  isOpen,
  onClose,
  hours,
}: SleepGoalCelebrationProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Launch confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3"],
        zIndex: 1000,
      });

      // Second wave of confetti
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3"],
          zIndex: 1000,
        });
      }, 500);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full z-10 overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            ref={confettiRef}
          >
            {/* Animated background */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
              {/* Animated stars */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => {
                  const size = Math.random() * 4 + 2;
                  const x = Math.random() * 100;
                  const y = Math.random() * 100;
                  const delay = Math.random() * 5;
                  const duration = 5 + Math.random() * 10;

                  return (
                    <motion.div
                      key={i}
                      className="absolute bg-white rounded-full opacity-70"
                      style={{
                        width: size,
                        height: size,
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration,
                        delay,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
              </div>

              {/* Award icon with pulse effect */}
              <div className="relative flex justify-center mb-6">
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="bg-white rounded-full p-4 relative z-10">
                  <Award className="h-12 w-12 text-indigo-600" />
                </div>
              </div>

              {/* Title with moon icons */}
              <div className="relative text-center">
                <motion.div
                  className="absolute -left-6 -top-6"
                  animate={{
                    rotate: 360,
                    y: [0, -5, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    y: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <Moon className="h-8 w-8 text-indigo-200 opacity-70" />
                </motion.div>

                <motion.div
                  className="absolute right-0 bottom-0"
                  animate={{
                    rotate: -360,
                    y: [0, -8, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 25,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    y: {
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <Moon className="h-6 w-6 text-indigo-200 opacity-50" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Цель достигнута!
                </h2>
                <p className="text-indigo-100">
                  Вы достигли своей цели сна в {hours} часов
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Отличная работа!
                </h3>
                <p className="text-gray-600">
                  Регулярный здоровый сон помогает улучшить память, настроение и
                  общее самочувствие. Продолжайте в том же духе!
                </p>
              </div>

              {/* Sleep benefits */}
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-indigo-800 mb-2">
                  Польза здорового сна:
                </h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <motion.li
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Улучшение концентрации и продуктивности
                  </motion.li>
                  <motion.li
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Укрепление иммунной системы
                  </motion.li>
                  <motion.li
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Снижение риска сердечно-сосудистых заболеваний
                  </motion.li>
                </ul>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Продолжить
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
