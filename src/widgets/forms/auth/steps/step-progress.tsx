"use client";

import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const StepProgress = ({
  currentStep,
  totalSteps,
}: StepProgressProps) => {
  const steps = [
    { number: 1, title: "Личные данные" },
    { number: 2, title: "Медицинская информация" },
    { number: 3, title: "Документы" },
    { number: 4, title: "Адрес" },
  ];

  return (
    <div className="mb-4">
      {/* Улучшенный прогресс-бар */}
      <div className="w-full h-1.5 bg-blue-300/40 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-white rounded-full shadow-sm"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Улучшенные индикаторы шагов */}
      <div className="flex justify-between items-start px-2">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <motion.div
              className={`relative ${
                currentStep === step.number ? "z-10" : ""
              }`}
              initial={false}
              animate={{
                scale: currentStep === step.number ? [1, 1.15, 1.05] : 1,
                transition: { duration: 0.5, ease: "easeOut" },
              }}
            >
              {/* Внешний круг с эффектом свечения для активного шага */}
              {currentStep === step.number && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/50 blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {/* Основной круг */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-md transition-all duration-300 ${
                  currentStep > step.number
                    ? "bg-white text-blue-600 border-2 border-white"
                    : currentStep === step.number
                    ? "bg-white text-blue-600 border-2 border-white"
                    : "bg-blue-400/30 text-white border-2 border-blue-400/30"
                }`}
              >
                {currentStep > step.number ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  step.number
                )}
              </div>
            </motion.div>

            {/* Название шага */}
            <motion.span
              className={`text-xs mt-2 text-center font-medium max-w-[80px] transition-all duration-300 ${
                currentStep >= step.number ? "text-white" : "text-white/60"
              }`}
              initial={false}
              animate={{
                opacity: currentStep === step.number ? 1 : 0.7,
                scale: currentStep === step.number ? 1.05 : 1,
              }}
            >
              {step.title}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};
