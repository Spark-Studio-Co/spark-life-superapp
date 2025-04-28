import type {
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationsResponse,
} from "@/entities/notification/model/types";
import { apiClient } from "@/shared/api/apiClient";

const BASE_URL = "/notification";

export const notificationService = {
  /**
   * Создание нового уведомления
   */
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    console.log("test");
    const response = await apiClient.post<Notification>(BASE_URL, data);
    return response.data;
  },

  /**
   * Получение списка уведомлений с пагинацией
   */
  async getNotifications(page = 1, limit = 10): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>(
      `${BASE_URL}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Получение уведомления по ID
   */
  async getNotificationById(id: number): Promise<Notification> {
    const response = await apiClient.get<Notification>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Получение уведомлений пользователя
   */
  async getUserNotifications(
    userId: number,
    page = 1,
    limit = 10
  ): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>(
      `${BASE_URL}?user_id=${userId}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Обновление уведомления
   */
  async updateNotification(
    id: number,
    data: UpdateNotificationDto
  ): Promise<Notification> {
    const response = await apiClient.patch<Notification>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Удаление уведомления
   */
  async deleteNotification(id: number): Promise<Notification> {
    const response = await apiClient.delete<Notification>(`${BASE_URL}/${id}`);
    return response.data;
  },
};
