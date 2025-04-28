"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Неверный формат email")
    .required("Email обязателен"),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов"),
  rememberMe: Yup.boolean(),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("Login form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      // Here you would typically handle authentication
    },
  });

  const formVariants = {
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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const errorVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  return (
    <motion.form
      onSubmit={formik.handleSubmit}
      className="space-y-4"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="вы@пример.com"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <AnimatePresence>
          {formik.touched.email && formik.errors.email && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <div className="flex justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Пароль
          </Label>
          <Link
            to="/reset-password"
            className="text-xs text-primary hover:underline transition-colors"
          >
            Забыли пароль?
          </Link>
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Скрыть пароль" : "Показать пароль"}
            </span>
          </Button>
        </div>
        <AnimatePresence>
          {formik.touched.password && formik.errors.password && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="flex items-center space-x-2 select-none"
        variants={itemVariants}
      >
        <Checkbox
          id="rememberMe"
          name="rememberMe"
          checked={formik.values.rememberMe}
          onCheckedChange={(checked) => {
            formik.setFieldValue("rememberMe", checked);
          }}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label
          htmlFor="rememberMe"
          className="text-sm font-normal cursor-pointer"
        >
          Запомнить меня на 30 дней
        </Label>
      </motion.div>

      <motion.div variants={itemVariants} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full h-12 mt-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <span>Вход...</span>
            </div>
          ) : (
            "Войти"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};
