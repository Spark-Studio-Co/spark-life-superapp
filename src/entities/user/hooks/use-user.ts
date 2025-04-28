"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { userService } from "../api/user.api";
import { User } from "../model/types";

export function useUser() {
  const queryClient = useQueryClient();
  const { token, userId } = useAuthData();
  const { toast } = useToast();

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: userService.getMe,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Мутация для обновления данных пользователя
  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<User>) => {
      if (!userId) throw new Error("User ID is not available");
      return userService.updateUser(Number(userId), data);
    },
    onSuccess: (updatedUser) => {
      // Обновляем кэш
      queryClient.setQueryData(["user"], updatedUser);

      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно обновлены",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка обновления",
        description:
          error.response?.data?.message || "Не удалось обновить данные",
        variant: "destructive",
      });
    },
  });

  // Мутация для обновления медицинского документа
  const { mutate: updateMedDoc, isPending: isUpdatingMedDoc } = useMutation({
    mutationFn: (medDocFile: File) => {
      if (!userId) throw new Error("User ID is not available");
      return userService.updateMedDoc(Number(userId), medDocFile);
    },
    onSuccess: (updatedUser) => {
      // Обновляем кэш
      queryClient.setQueryData(["user"], updatedUser);

      toast({
        title: "Документ обновлен",
        description: "Ваш медицинский документ успешно обновлен",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка обновления",
        description:
          error.response?.data?.message || "Не удалось обновить документ",
        variant: "destructive",
      });
    },
  });

  // Вспомогательные функции для работы с данными пользователя
  const getFullName = () => {
    if (!user) return "";
    return `${user.last_name} ${user.first_name} ${
      user.patronymic || ""
    }`.trim();
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.first_name.charAt(0)}${user.last_name.charAt(
      0
    )}`.toUpperCase();
  };

  return {
    user,
    isLoading,
    isError,
    error,
    refetch,
    updateUser,
    isUpdating,
    updateMedDoc,
    isUpdatingMedDoc,
    getFullName,
    getInitials,
  };
}
