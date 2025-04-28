"use client";

import { useState } from "react";
import type { FormikProps } from "formik";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RegisterFormData } from "../multistep-form";

interface StepPersonalInfoProps {
  formik: FormikProps<RegisterFormData>;
}

export const StepPersonalInfo = ({ formik }: StepPersonalInfoProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Функция для определения силы пароля
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
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-500",
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Личные данные</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Введите ваши личные данные для создания аккаунта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Фамилия <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="lastName"
              name="lastName"
              placeholder="Иванов"
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <AnimatePresence>
            {formik.touched.lastName && formik.errors.lastName && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formik.errors.lastName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            Имя <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="firstName"
              name="firstName"
              placeholder="Иван"
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <AnimatePresence>
            {formik.touched.firstName && formik.errors.firstName && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formik.errors.firstName}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="middleName"
          className="text-sm font-medium text-gray-700"
        >
          Отчество
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="middleName"
            name="middleName"
            placeholder="Петрович"
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
            value={formik.values.middleName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="вы@пример.com"
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <AnimatePresence>
            {formik.touched.email && formik.errors.email && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formik.errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Телефон <span className="text-red-500">*</span>
          </Label>
          <div className="relative group">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              id="phone"
              name="phone"
              placeholder="+7 (999) 123-45-67"
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <AnimatePresence>
            {formik.touched.phone && formik.errors.phone && (
              <motion.p
                className="text-xs text-red-500"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formik.errors.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Пароль <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-700"
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
              className="space-y-1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={errorVariants}
            >
              <div className="flex gap-1 h-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: "100%",
                      opacity: 1,
                      transition: { duration: 0.5, delay: index * 0.1 },
                    }}
                    className={`h-full flex-1 rounded-full transition-all ${
                      index < passwordStrength
                        ? passwordStrengthColor[passwordStrength - 1]
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <motion.p className="text-xs text-gray-500">
                Надежность пароля:{" "}
                <span className="font-medium">
                  {passwordStrengthText[passwordStrength - 1] || "Очень слабый"}
                </span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {formik.touched.password && formik.errors.password && (
            <motion.p
              className="text-xs text-red-500"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Подтверждение пароля <span className="text-red-500">*</span>
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-all rounded-lg"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-gray-700"
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
              className="text-xs text-red-500"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.confirmPassword}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
