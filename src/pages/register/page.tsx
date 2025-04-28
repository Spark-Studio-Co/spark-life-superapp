"use client";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { MultiStepRegisterForm } from "@/widgets/forms/auth/multistep-form";

export const RegisterPage = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  const backgroundCircleVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
        />
        <motion.div
          className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
          transition={{ delay: 0.4 }}
        />
      </div>

      <motion.div
        className="w-full max-w-xl relative z-10"
        variants={itemVariants}
      >
        <motion.div variants={itemVariants}>
          <MultiStepRegisterForm />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
