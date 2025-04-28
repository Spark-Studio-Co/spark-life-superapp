import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { notificationService } from "../api/notification.api";

// Define the API response structure
interface ApiResponse {
  data: any[];
  total: number;
  page: number;
  lastPage: number;
}

export const useNotifications = () => {
  const { userId } = useAuthData();

  // Получение уведомлений пользователя
  const {
    data: apiResponse,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return null;

      try {
        const response = await notificationService.getUserNotifications(
          Number(userId)
        );
        return response;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    enabled: !!userId, // Запрос выполняется только если есть userId
  });

  // Extract notifications from the API response
  const notifications = apiResponse?.data || [];

  // Создание нового уведомления
  const { mutate: createNotification, isPending: isCreating } = useMutation({
    mutationFn: notificationService.createNotification,
    onSuccess: () => {
      refetch(); // Обновляем список уведомлений после успешного создания
    },
  });

  // Функция для маппинга типов напоминаний
  const mapReminderTypeToNotificationType = (reminderType: string): string => {
    // Просто возвращаем исходное значение, так как оно уже соответствует требуемым типам
    return reminderType;
  };

  return {
    notifications,
    isLoading,
    error,
    createNotification,
    isCreating,
    mapReminderTypeToNotificationType,
    refetch,
    pagination: apiResponse
      ? {
          total: apiResponse.total,
          page: apiResponse.page,
          lastPage: apiResponse.lastPage,
        }
      : null,
  };
};
