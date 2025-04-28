"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const StepComplete = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
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

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        variants={checkmarkVariants}
      >
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </motion.div>

      <motion.h2 className="text-2xl font-bold mb-2" variants={itemVariants}>
        Регистрация завершена!
      </motion.h2>

      <motion.p
        className="text-muted-foreground mb-6 max-w-md"
        variants={itemVariants}
      >
        Ваша учетная запись успешно создана. Теперь вы можете войти в систему и
        начать пользоваться всеми возможностями Spark Health.
      </motion.p>

      <motion.div className="space-y-4 w-full max-w-xs" variants={itemVariants}>
        <Button asChild className="w-full">
          <Link to="/login">
            Войти в аккаунт
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button variant="outline" asChild className="w-full">
          <Link to="/">На главную страницу</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
