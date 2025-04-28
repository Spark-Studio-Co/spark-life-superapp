"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Lock, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/entities/auth/hooks/use-auth";

const phoneRegExp = /^\+[1-9]\d{1,14}$/;

const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .required("Email или телефон обязателен")
    .test(
      "is-email-or-phone",
      "Введите корректный email или телефон в формате +XXXXXXXXXX",
      (value) => {
        return (
          Yup.string().email().isValidSync(value) || // Проверка на email
          phoneRegExp.test(value) // Проверка на телефон
        );
      }
    ),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(8, "Пароль должен содержать минимум 8 символов"),
  rememberMe: Yup.boolean(),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, loginError } = useAuth();
  const [identifierType, setIdentifierType] = useState<"email" | "phone">(
    "email"
  );

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // Используем функцию login из хука useAuth
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

  // Определяем тип идентификатора (email или телефон)
  const detectIdentifierType = (value: string) => {
    if (value.startsWith("+")) {
      setIdentifierType("phone");
    } else {
      setIdentifierType("email");
    }
  };

  // Загружаем сохраненный идентификатор при монтировании компонента
  useState(() => {
    const rememberedIdentifier = localStorage.getItem("remembered_identifier");
    if (rememberedIdentifier) {
      formik.setFieldValue("identifier", rememberedIdentifier);
      formik.setFieldValue("rememberMe", true);
      detectIdentifierType(rememberedIdentifier);
    }
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
        <Label htmlFor="identifier" className="text-sm font-medium">
          Email или телефон
        </Label>
        <div className="relative group">
          {identifierType === "email" ? (
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          ) : (
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
          <Input
            id="identifier"
            name="identifier"
            type={identifierType === "email" ? "email" : "tel"}
            placeholder={
              identifierType === "email" ? "вы@пример.com" : "+7XXXXXXXXXX"
            }
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
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
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.identifier}
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

      <motion.div variants={itemVariants} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full h-12 mt-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
      </motion.div>
    </motion.form>
  );
};
