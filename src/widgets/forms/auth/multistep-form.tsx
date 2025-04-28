"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StepPersonalInfo } from "./steps/step-personal-info";
import { StepMedicalInfo } from "./steps/step-medical-info";
import { StepDocuments } from "./steps/step-documents";
import { StepAddress } from "./steps/step-address";
import { StepProgress } from "./steps/step-progress";
import { StepComplete } from "./steps/step-complete";
import { useToast } from "@/components/ui/use-toast";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { useAuth } from "@/entities/auth/hooks/use-auth";

// Определение типа для данных формы
export interface RegisterFormData {
  // Шаг 1: Персональная информация
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Шаг 2: Медицинская информация
  diseases: string[];
  otherDisease: string;

  // Шаг 3: Документы
  medicalCertificate: File | null;

  // Шаг 4: Адрес
  city: string;
  address: string;
  postalCode: string;
}

// Схемы валидации для каждого шага
const Step1Schema = Yup.object().shape({
  firstName: Yup.string().required("Имя обязательно"),
  lastName: Yup.string().required("Фамилия обязательна"),
  middleName: Yup.string(),
  email: Yup.string()
    .email("Неверный формат email")
    .required("Email обязателен"),
  phone: Yup.string().required("Телефон обязателен"),
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

const Step2Schema = Yup.object().shape({
  diseases: Yup.array().of(Yup.string()),
  otherDisease: Yup.string(),
});

const Step3Schema = Yup.object().shape({
  medicalCertificate: Yup.mixed().nullable(),
});

const Step4Schema = Yup.object().shape({
  city: Yup.string().required("Город обязателен"),
  address: Yup.string().required("Адрес обязателен"),
  postalCode: Yup.string().required("Почтовый индекс обязателен"),
});

export const MultiStepRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const totalSteps = 4;

  const { register, isRegistering } = useAuth();
  const { toast } = useToast();

  // Инициализация формы с начальными значениями
  const formik = useFormik<RegisterFormData>({
    initialValues: {
      // Шаг 1: Персональная информация
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      // Шаг 2: Медицинская информация
      diseases: [],
      otherDisease: "",

      // Шаг 3: Документы
      medicalCertificate: null,

      // Шаг 4: Адрес
      city: "",
      address: "",
      postalCode: "",
    },
    validationSchema:
      currentStep === 1
        ? Step1Schema
        : currentStep === 2
          ? Step2Schema
          : currentStep === 3
            ? Step3Schema
            : Step4Schema,
    onSubmit: async (values) => {
      // Медицинская справка теперь опциональна

      // Подготавливаем массив заболеваний
      // Убедимся, что diseases всегда массив строк
      let diseases: string[] = [];

      // Добавляем выбранные заболевания
      if (Array.isArray(values.diseases)) {
        diseases = [...values.diseases];
      }

      // Добавляем другое заболевание, если оно указано
      if (values.otherDisease) {
        diseases.push(values.otherDisease);
      }

      // Если массив пустой, добавим пустой массив
      if (diseases.length === 0) {
        diseases = [];
      }

      // Формируем базовые данные для регистрации
      const baseData = {
        email: values.email,
        phone: values.phone,
        first_name: values.firstName,
        last_name: values.lastName,
        patronymic: values.middleName,
        diseases: diseases, // Передаем подготовленный массив
        password: values.password,
      };

      // Вызываем мутацию регистрации с данными из формы, только если файл был загружен
      if (values.medicalCertificate) {
        // Формируем данные для регистрации с файлом
        const registerData = {
          data: baseData,
          medDocFile: values.medicalCertificate,
        };
        register(registerData, {
          onSuccess: () => {
            setIsRegistrationComplete(true);
            setCurrentStep(5); // Переход к экрану завершения
          },
          onError: (error: any) => {
            // Выводим детальную информацию об ошибке
            console.error("Registration error:", error);

            // Показываем уведомление с деталями ошибки
            toast({
              title: "Ошибка регистрации",
              description:
                error.response?.data?.message ||
                (Array.isArray(error.response?.data?.message)
                  ? error.response.data.message.join(", ")
                  : "Произошла ошибка при регистрации"),
              variant: "destructive",
            });
          },
        });
      } else {
        // Если файл не был загружен, показываем предупреждение и переходим к завершению
        toast({
          title: "Внимание",
          description: "Вы не загрузили медицинскую справку. Вы сможете загрузить ее позже в личном кабинете.",
          variant: "destructive",
        });
        setIsRegistrationComplete(true);
        setCurrentStep(5); // Переход к экрану завершения
      }
    },
  });

  // Обработчик перехода к следующему шагу
  const handleNextStep = async () => {
    // Валидация текущего шага перед переходом к следующему
    try {
      let schema;
      switch (currentStep) {
        case 1:
          schema = Step1Schema;
          break;
        case 2:
          schema = Step2Schema;
          break;
        case 3:
          schema = Step3Schema;
          break;
        case 4:
          schema = Step4Schema;
          break;
        default:
          schema = Yup.object();
      }

      await schema.validate(formik.values, { abortEarly: false });

      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        await formik.submitForm();
      }
    } catch (err) {
      // Обработка ошибок валидации
      if (err instanceof Yup.ValidationError) {
        const errors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        formik.setErrors(errors);
      }
    }
  };

  // Обработчик перехода к предыдущему шагу
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Анимация для шагов формы
  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-3">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <div className="bg-white p-5 rounded-t-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              className="md:h-[calc(100vh-280px)] md:max-h-[500px] md:overflow-auto md:hide-scrollbar"
            >
              {currentStep === 1 && <StepPersonalInfo formik={formik} />}
              {currentStep === 2 && <StepMedicalInfo formik={formik} />}
              {currentStep === 3 && <StepDocuments formik={formik} />}
              {currentStep === 4 && <StepAddress formik={formik} />}
              {currentStep === 5 && <StepComplete />}
            </motion.div>
          </AnimatePresence>
        </div>

        {currentStep < 5 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isRegistering}
              className="min-w-[100px] h-10 text-sm font-medium"
            >
              Назад
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: index + 1 === currentStep ? 1.2 : 1,
                    opacity:
                      index + 1 === currentStep
                        ? 1
                        : index + 1 < currentStep
                          ? 0.8
                          : 0.4,
                  }}
                  className={`w-2 h-2 rounded-full ${index + 1 === currentStep
                    ? "bg-blue-500"
                    : index + 1 < currentStep
                      ? "bg-blue-400"
                      : "bg-gray-300"
                    }`}
                />
              ))}
            </div>

            <Button
              type="button"
              onClick={
                currentStep === totalSteps ? formik.submitForm : handleNextStep
              }
              disabled={isRegistering}
              className="min-w-[100px] h-10 text-sm font-medium bg-blue-500 hover:bg-blue-600"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <span>Загрузка...</span>
                </div>
              ) : currentStep === totalSteps ? (
                "Завершить"
              ) : (
                "Далее"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
