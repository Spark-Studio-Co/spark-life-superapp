"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  authService,
  type LoginData,
  type RegisterData,
} from "../api/auth.api";
import { useAuthData } from "../model/use-auth-store";

export function useAuth() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Получаем методы из Zustand store
  const { saveToken, saveRefreshToken, removeToken, saveUserId } =
    useAuthData();

  // Мутация для регистрации
  const {
    mutate: register,
    isPending: isRegistering,
    error: registerError,
  } = useMutation({
    mutationFn: ({
      data,
      medDocFile,
    }: {
      data: RegisterData;
      medDocFile: File;
    }) => authService.register(data, medDocFile),
    onSuccess: (data: any) => {
      // Сохраняем токены в Zustand store
      saveToken(data.access_token);
      if (data.refresh_token) {
        saveRefreshToken(data.refresh_token);
      }

      saveUserId(data.userId);
      if (data.userId) {
        saveRefreshToken(data.userId);
      }

      toast({
        title: "Регистрация успешна",
        description: "Вы успешно зарегистрировались в системе",
        variant: "default",
      });

      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка регистрации",
        description:
          error.response?.data?.message || "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    },
  });

  // Мутация для входа
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (data) => {
      // Сохраняем токены в Zustand store
      saveToken(data.access_token);
      if (data.refresh_token) {
        saveRefreshToken(data.refresh_token);
      }

      saveUserId(data.userId);
      if (data.userId) {
        saveRefreshToken(data.userId);
      }

      toast({
        title: "Вход выполнен",
        description: "Вы успешно вошли в систему",
        variant: "default",
      });

      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description:
          error.response?.data?.message || "Неверный email или пароль",
        variant: "destructive",
      });
    },
  });

  // Мутация для выхода
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Удаляем токены из Zustand store
      removeToken();

      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
        variant: "default",
      });

      navigate("/login");
    },
    onError: () => {
      // Даже при ошибке выхода на сервере, очищаем локальные токены
      removeToken();
      navigate("/login");
    },
  });

  return {
    register,
    isRegistering,
    registerError,
    login,
    isLoggingIn,
    loginError,
    logout,
    isLoggingOut,
  };
}
