"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/shared/api/apiClient";
import { useAuthData } from "@/entities/auth/model/use-auth-store";

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  description: string;
  time: string;
  type: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_pattern: string;
  isCompleted?: boolean;
}

interface UseNotificationSocketProps {
  apiUrl?: string;
}

export function useNotificationSocket({
  apiUrl = "https://spark-life-backend-production.up.railway.app/api",
}: UseNotificationSocketProps = {}) {
  const { userId } = useAuthData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // --- Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/notification`, {
        params: { userId: userId },
      });
      setNotifications(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // --- Create notification
  const createNotification = useCallback(
    async (data: Omit<Notification, "id">) => {
      try {
        const response = await apiClient.post(`/notification`, data);
        await fetchNotifications(); // refresh list
        return response.data;
      } catch (err) {
        console.error("Error creating notification:", err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  // --- Update notification
  const updateNotification = useCallback(
    async (id: number, data: Partial<Notification>) => {
      try {
        const response = await apiClient.patch(`/notification/${id}`, data);
        await fetchNotifications();
        return response.data;
      } catch (err) {
        console.error("Error updating notification:", err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  // --- Delete notification
  const deleteNotification = useCallback(
    async (id: number) => {
      try {
        const response = await apiClient.delete(`/notification/${id}`);
        await fetchNotifications();
        return response.data;
      } catch (err) {
        console.error("Error deleting notification:", err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  // --- Initial load
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
  };
}
