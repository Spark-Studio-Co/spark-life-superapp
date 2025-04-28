"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Имя обязательно"),
  email: Yup.string()
    .email("Неверный формат email")
    .required("Email обязателен"),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру"
    ),
  confirmPassword: Yup.string()
    .required("Подтвердите пароль")
    .oneOf([Yup.ref("password")], "Пароли должны совпадать"),
  terms: Yup.boolean().oneOf([true], "Вы должны принять условия использования"),
});

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("Register form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      // Here you would typically handle user registration
    },
  });

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.password);
  const passwordStrengthText = [
    "Очень слабый",
    "Слабый",
    "Средний",
    "Хороший",
    "Сильный",
  ];
  const passwordStrengthColor = [
    "bg-destructive/50",
    "bg-destructive",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

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

  const strengthBarVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: (i: number) => ({
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
      },
    }),
  };

  const checkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
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
        <Label htmlFor="name" className="text-sm font-medium">
          Полное имя
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="name"
            name="name"
            placeholder="Иван Иванов"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <AnimatePresence>
          {formik.touched.name && formik.errors.name && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

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
        <Label htmlFor="password" className="text-sm font-medium">
          Пароль
        </Label>
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
          {formik.values.password && (
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={errorVariants}
            >
              <div className="flex gap-1 h-1.5">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={strengthBarVariants}
                    className={`h-full flex-1 rounded-full transition-all ${
                      index < passwordStrength
                        ? passwordStrengthColor[passwordStrength - 1]
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <motion.p
                className="text-xs text-muted-foreground"
                variants={itemVariants}
              >
                Надежность пароля:{" "}
                <span className="font-medium">
                  {passwordStrengthText[passwordStrength - 1] || "Очень слабый"}
                </span>
              </motion.p>

              <motion.div
                className="grid grid-cols-2 gap-2 text-xs"
                variants={itemVariants}
              >
                <motion.div
                  className={`flex items-center gap-1 ${
                    /[A-Z]/.test(formik.values.password)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                  variants={checkVariants}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Заглавная буква</span>
                </motion.div>
                <motion.div
                  className={`flex items-center gap-1 ${
                    /[a-z]/.test(formik.values.password)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                  variants={checkVariants}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Строчная буква</span>
                </motion.div>
                <motion.div
                  className={`flex items-center gap-1 ${
                    /[0-9]/.test(formik.values.password)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                  variants={checkVariants}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Цифра</span>
                </motion.div>
                <motion.div
                  className={`flex items-center gap-1 ${
                    formik.values.password.length >= 8
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                  variants={checkVariants}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>8+ символов</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Подтверждение пароля
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
            </span>
          </Button>
        </div>
        <AnimatePresence>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.confirmPassword}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <div className="flex items-start space-x-2 select-none">
          <Checkbox
            id="terms"
            name="terms"
            checked={formik.values.terms}
            onCheckedChange={(checked) => {
              formik.setFieldValue("terms", checked);
            }}
            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
            Я согласен с{" "}
            <Link
              to="/terms"
              className="text-primary hover:underline transition-colors"
            >
              Условиями использования
            </Link>{" "}
            и{" "}
            <Link
              to="/privacy"
              className="text-primary hover:underline transition-colors"
            >
              Политикой конфиденциальности
            </Link>
          </Label>
        </div>
        <AnimatePresence>
          {formik.touched.terms && formik.errors.terms && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.terms}
            </motion.p>
          )}
        </AnimatePresence>
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
              <span>Создание аккаунта...</span>
            </div>
          ) : (
            "Создать аккаунт"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};
