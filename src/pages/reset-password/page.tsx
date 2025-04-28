"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

// Схемы валидации для каждого шага
const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Неверный формат email")
    .required("Email обязателен"),
});

const CodeSchema = Yup.object().shape({
  code: Yup.string()
    .required("Код подтверждения обязателен")
    .matches(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});

const PasswordSchema = Yup.object().shape({
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
});

export const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Форма для шага 1 - ввод email
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: EmailSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("Email отправлен:", values.email);

      // Имитация API-запроса
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUserEmail(values.email);
      setIsSubmitting(false);
      setStep(2);
      setResendTimer(60); // Устанавливаем таймер на 60 секунд

      // Запускаем таймер обратного отсчета
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  // Форма для шага 2 - ввод кода из email
  const codeFormik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: CodeSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("Код подтверждения отправлен:", values.code);

      // Имитация API-запроса
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setStep(3);
    },
  });

  // Форма для шага 3 - создание нового пароля
  const passwordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: PasswordSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      console.log("Новый пароль установлен:", values.password);

      // Имитация API-запроса
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);
      setStep(4);
    },
  });

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    console.log("Повторная отправка кода на", userEmail);
    setResendTimer(60);

    // Запускаем таймер обратного отсчета
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
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

  const passwordStrength = getPasswordStrength(passwordFormik.values.password);
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <motion.div
            className="flex items-center justify-center mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative"
              variants={pulseVariants}
              animate="pulse"
            >
              <Heart className="h-12 w-12 text-blue-500" />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-blue-500 mb-1"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Spark Health
          </motion.h1>
          <motion.p
            className="text-gray-500 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {step === 1
              ? "Восстановление пароля"
              : step === 2
              ? "Введите код из email"
              : step === 3
              ? "Создание нового пароля"
              : "Пароль успешно изменен"}
          </motion.p>
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="email-step"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="p-6"
              >
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Восстановление доступа
                  </h2>
                </div>

                <p className="text-gray-500 text-base mb-6">
                  Введите email, указанный при регистрации, и мы отправим вам
                  код для восстановления пароля
                </p>

                <form onSubmit={emailFormik.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="вы@пример.com"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg text-base"
                        value={emailFormik.values.email}
                        onChange={emailFormik.handleChange}
                        onBlur={emailFormik.handleBlur}
                      />
                    </div>
                    <AnimatePresence>
                      {emailFormik.touched.email &&
                        emailFormik.errors.email && (
                          <motion.p
                            className="text-sm text-red-500"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {emailFormik.errors.email}
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 font-medium bg-blue-500 hover:bg-blue-600 text-white text-base rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        <span>Отправка...</span>
                      </div>
                    ) : (
                      "Отправить код"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    Вспомнили пароль?{" "}
                    <Link
                      to="/login"
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Вернуться ко входу
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="code-step"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="p-6"
              >
                <div className="flex items-center mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mr-2 h-8 w-8 text-gray-500"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Назад</span>
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Проверка кода
                  </h2>
                </div>

                <p className="text-gray-500 text-base mb-6">
                  Мы отправили код подтверждения на адрес{" "}
                  <span className="font-medium">{userEmail}</span>. Введите его
                  ниже для продолжения.
                </p>

                <form onSubmit={codeFormik.handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="code"
                      className="text-sm font-medium text-gray-700"
                    >
                      Код подтверждения <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      placeholder="123456"
                      className="h-12 bg-gray-50 border-gray-200 rounded-lg text-center text-xl tracking-widest"
                      value={codeFormik.values.code}
                      onChange={codeFormik.handleChange}
                      onBlur={codeFormik.handleBlur}
                      maxLength={6}
                    />
                    <AnimatePresence>
                      {codeFormik.touched.code && codeFormik.errors.code && (
                        <motion.p
                          className="text-sm text-red-500"
                          variants={errorVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {codeFormik.errors.code}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="text-center text-gray-500 mt-2">
                    <p>Не получили код?</p>
                    <button
                      type="button"
                      className={`text-blue-500 hover:underline mt-1 ${
                        resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleResendCode}
                      disabled={resendTimer > 0}
                    >
                      {resendTimer > 0
                        ? `Отправить повторно (${resendTimer}с)`
                        : "Отправить повторно"}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 font-medium bg-blue-500 hover:bg-blue-600 text-white text-base rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        <span>Проверка...</span>
                      </div>
                    ) : (
                      "Подтвердить"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    Вспомнили пароль?{" "}
                    <Link
                      to="/login"
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Вернуться ко входу
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="password-step"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="p-6"
              >
                <div className="flex items-center mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mr-2 h-8 w-8 text-gray-500"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Назад</span>
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Новый пароль
                  </h2>
                </div>

                <p className="text-gray-500 text-base mb-6">
                  Создайте новый пароль для вашей учетной записи. Пароль должен
                  быть надежным и отличаться от предыдущего.
                </p>

                <form
                  onSubmit={passwordFormik.handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Новый пароль <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg"
                        value={passwordFormik.values.password}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 text-gray-400"
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
                      {passwordFormik.values.password && (
                        <motion.div
                          className="space-y-1 mt-2"
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={errorVariants}
                        >
                          <div className="flex gap-1 h-1.5">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <motion.div
                                key={index}
                                initial={{ width: 0, opacity: 0 }}
                                animate={{
                                  width: "100%",
                                  opacity: 1,
                                  transition: {
                                    duration: 0.5,
                                    delay: index * 0.1,
                                  },
                                }}
                                className={`h-full flex-1 rounded-full transition-all ${
                                  index < passwordStrength
                                    ? passwordStrengthColor[
                                        passwordStrength - 1
                                      ]
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <motion.p className="text-sm text-gray-500">
                            Надежность пароля:{" "}
                            <span className="font-medium">
                              {passwordStrengthText[passwordStrength - 1] ||
                                "Очень слабый"}
                            </span>
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {passwordFormik.touched.password &&
                        passwordFormik.errors.password && (
                          <motion.p
                            className="text-sm text-red-500"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {passwordFormik.errors.password}
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Подтверждение пароля{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-lg"
                        value={passwordFormik.values.confirmPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 text-gray-400"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Скрыть пароль"
                            : "Показать пароль"}
                        </span>
                      </Button>
                    </div>
                    <AnimatePresence>
                      {passwordFormik.touched.confirmPassword &&
                        passwordFormik.errors.confirmPassword && (
                          <motion.p
                            className="text-sm text-red-500"
                            variants={errorVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            {passwordFormik.errors.confirmPassword}
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 mt-4 font-medium bg-blue-500 hover:bg-blue-600 text-white text-base rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        <span>Сохранение...</span>
                      </div>
                    ) : (
                      "Сохранить новый пароль"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    Вспомнили пароль?{" "}
                    <Link
                      to="/login"
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Вернуться ко входу
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="success-step"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="p-6 text-center"
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  Пароль успешно изменен!
                </h3>
                <p className="text-gray-500 text-base mb-8">
                  Ваш пароль был успешно изменен. Теперь вы можете войти в свою
                  учетную запись, используя новый пароль.
                </p>

                <Button
                  asChild
                  className="w-full h-12 font-medium bg-blue-500 hover:bg-blue-600 text-white text-base rounded-lg"
                >
                  <Link to="/login">Войти в аккаунт</Link>
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    Возникли проблемы?{" "}
                    <Link
                      to="/support"
                      className="text-blue-500 font-medium hover:underline"
                    >
                      Обратиться в поддержку
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
