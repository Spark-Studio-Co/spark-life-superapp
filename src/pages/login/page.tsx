"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, Heart, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/entities/auth/hooks/use-auth";

// Регулярное выражение для проверки телефона в формате E.164
const phoneRegExp = /^\+[1-9]\d{1,14}$/;

const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Введите email или телефон")
    .test(
      "is-email-or-phone",
      "Введите корректный email или телефон в формате +XXXXXXXXXX",
      (value) => {
        if (!value) return false;
        // Проверяем, является ли значение email или телефоном
        return (
          Yup.string().email().isValidSync(value) || // Проверка на email
          phoneRegExp.test(value) // Проверка на телефон
        );
      }
    ),
  password: Yup.string().required("Пароль обязателен"),
  rememberMe: Yup.boolean(),
});

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );
  const { login, isLoggingIn, loginError } = useAuth();

  // Определяем тип идентификатора (email или телефон)
  const detectIdentifierType = (value: string) => {
    if (value.startsWith("+")) {
      setIdentifierType("phone");
    } else {
      setIdentifierType("email");
    }
  };

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      login({
        identifier: values.identifier,
        password: values.password,
      });

      // Если пользователь выбрал "запомнить меня", сохраняем идентификатор в localStorage
      if (values.rememberMe) {
        localStorage.setItem("remembered_identifier", values.identifier);
      } else {
        localStorage.removeItem("remembered_identifier");
      }
    },
  });

  // Загружаем сохраненный идентификатор при монтировании компонента
  useState(() => {
    const rememberedIdentifier = localStorage.getItem("remembered_identifier");
    if (rememberedIdentifier) {
      formik.setFieldValue("identifier", rememberedIdentifier);
      formik.setFieldValue("rememberMe", true);
      detectIdentifierType(rememberedIdentifier);
    }
  });

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
        />
        <motion.div
          className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          variants={backgroundCircleVariants}
          transition={{ delay: 0.4 }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={itemVariants}
      >
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <motion.div
            className="flex items-center justify-center mb-2"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              variants={pulseVariants}
              animate="pulse"
            >
              <Heart className="h-10 w-10 text-primary" />
              <motion.div
                className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-xl"
                variants={pulseVariants}
                animate="pulse"
              />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-primary"
            variants={itemVariants}
          >
            Spark Health
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            variants={itemVariants}
          >
            Войдите в свой аккаунт
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute -z-10 inset-0 bg-card/50 rounded-2xl blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <motion.div
          variants={itemVariants}
          className="bg-card/80 backdrop-blur-sm border-none shadow-2xl rounded-lg"
        >
          <div className="p-6">
            <div className="space-y-1 pb-4">
              <h2 className="text-2xl font-bold">Вход</h2>
              <p className="text-muted-foreground text-sm">
                Введите свои данные для входа в аккаунт
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="identifier" className="text-sm font-medium">
                  Email или телефон <span className="text-destructive">*</span>
                </Label>
                <div className="relative group">
                  {identifierType === "email" ? (
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  ) : (
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  )}
                  <Input
                    id="identifier"
                    name="identifier"
                    placeholder={
                      identifierType === "email"
                        ? "вы@пример.com"
                        : "+7XXXXXXXXXX"
                    }
                    className="pl-10 h-10 bg-background/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all rounded-lg"
                    value={formik.values.identifier}
                    onChange={(e) => {
                      formik.handleChange(e);
                      detectIdentifierType(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <AnimatePresence>
                  {formik.touched.identifier && formik.errors.identifier && (
                    <motion.p
                      className="text-xs text-destructive"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {formik.errors.identifier}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Пароль <span className="text-destructive">*</span>
                  </Label>
                  <Link
                    to="/reset-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 h-10 bg-background/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all rounded-lg"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
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
                      className="text-xs text-destructive"
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

              <div className="flex items-center space-x-2 select-none">
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
              </div>

              {/* Отображение ошибки от API */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {loginError instanceof Error
                      ? loginError.message
                      : "Произошла ошибка при входе. Пожалуйста, проверьте введенные данные."}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full h-10 mt-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
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
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Нет аккаунта?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
