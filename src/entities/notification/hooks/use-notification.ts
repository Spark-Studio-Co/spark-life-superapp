"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import type {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "@/entities/notification/model/types";
import { notificationService } from "../api/notification.api";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { userId } = useAuthData();

  // Получение списка уведомлений с пагинацией
  const useNotificationsList = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["notifications", page, limit],
      queryFn: () => notificationService.getNotifications(page, limit),
      staleTime: 5 * 60 * 1000, // 5 минут
    });
  };

  // Получение уведомлений пользователя
  const useUserNotifications = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["userNotifications", userId, page, limit],
      queryFn: () => {
        if (!userId) throw new Error("User ID is not available");
        return notificationService.getUserNotifications(
          Number(userId),
          page,
          limit
        );
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 минут
    });
  };

  // Получение уведомления по ID
  const useNotification = (id: number) => {
    return useQuery({
      queryKey: ["notification", id],
      queryFn: () => notificationService.getNotificationById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 минут
    });
  };

  // Создание нового уведомления
  const { mutate: createNotification, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateNotificationDto) => {
      console.log("Creating notification:", data);
      return notificationService.createNotification(data);
    },
    onSuccess: () => {
      // Инвалидируем кэш для обновления списка уведомлений
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });

      toast({
        title: "Уведомление создано",
        description: "Новое уведомление успешно создано",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error("Error creating notification:", error);
      toast({
        title: "Ошибка создания",
        description:
          error.response?.data?.message || "Не удалось создать уведомление",
        variant: "destructive",
      });
    },
  });

  // Обновление уведомления
  const { mutate: updateNotification, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNotificationDto }) => {
      return notificationService.updateNotification(id, data);
    },
    onSuccess: (updatedNotification) => {
      // Обновляем кэш
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notification", updatedNotification.id],
      });

      toast({
        title: "Уведомление обновлено",
        description: "Уведомление успешно обновлено",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка обновления",
        description:
          error.response?.data?.message || "Не удалось обновить уведомление",
        variant: "destructive",
      });
    },
  });

  // Удаление уведомления
  const { mutate: deleteNotification, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      return notificationService.deleteNotification(id);
    },
    onSuccess: () => {
      // Инвалидируем кэш для обновления списка уведомлений
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });

      toast({
        title: "Уведомление удалено",
        description: "Уведомление успешно удалено",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка удаления",
        description:
          error.response?.data?.message || "Не удалось удалить уведомление",
        variant: "destructive",
      });
    },
  });

  // Функция для прямой передачи типа напоминания без преобразования
  const mapReminderTypeToNotificationType = (reminderType: string): string => {
    // Просто возвращаем исходный тип, так как он уже соответствует требуемым значениям
    return reminderType;
  };

  return {
    useNotificationsList,
    useUserNotifications,
    useNotification,
    createNotification,
    isCreating,
    updateNotification,
    isUpdating,
    deleteNotification,
    isDeleting,
    mapReminderTypeToNotificationType,
  };
}
