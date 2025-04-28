"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Droplet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface GoalReachedCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  goal: number;
}

export const GoalReachedCelebration = ({
  isOpen,
  onClose,
  goal,
}: GoalReachedCelebrationProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti after a short delay
      const timer = setTimeout(() => {
        setShowConfetti(true);

        // Create confetti burst
        const duration = 3000;
        const end = Date.now() + duration;

        const runConfetti = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
          });

          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#3b82f6", "#60a5fa", "#93c5fd"],
          });

          if (Date.now() < end) {
            requestAnimationFrame(runConfetti);
          }
        };

        runConfetti();
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-blue-500/20 to-blue-400/5"
              />
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: "100%",
                    scale: Math.random() * 0.5 + 0.5,
                  }}
                  animate={{
                    y: "-20%",
                    transition: {
                      duration: Math.random() * 5 + 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: Math.random() * 2,
                    },
                  }}
                  className="absolute w-8 h-8 rounded-full bg-blue-400/20"
                />
              ))}
            </div>
            <div className="relative p-6 pt-10 flex flex-col items-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative mb-6"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 rounded-full bg-blue-200"
                  style={{ padding: "40%" }}
                />
                <div className="relative bg-blue-500 rounded-full p-5">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              {/* Droplet icons floating around */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: (i - 2) * 30,
                    y: 0,
                    opacity: 0,
                    rotate: Math.random() * 30 - 15,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 60 - 30,
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  className="absolute text-blue-400"
                  style={{ top: `${120 + Math.random() * 60}px` }}
                >
                  <Droplet className="h-5 w-5 fill-blue-200" />
                </motion.div>
              ))}

              {/* Text content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold mb-2">Поздравляем!</h2>
                <p className="text-lg mb-1">
                  Вы достигли своей цели гидратации
                </p>
                <p className="text-gray-500 mb-6">
                  {(goal / 1000).toFixed(1)}л воды выпито
                </p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-blue-600 mb-8">
                    Отличная работа! Продолжайте поддерживать водный баланс для
                    здоровья и хорошего самочувствия.
                  </p>

                  <Button
                    onClick={onClose}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-xl"
                  >
                    Продолжить
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
