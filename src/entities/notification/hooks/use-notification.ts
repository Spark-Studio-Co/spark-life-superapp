"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, type Socket } from "socket.io-client";
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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // --- Connect socket
  const connect = useCallback(() => {
    if (!userId) return;
    if (socketRef.current) return;

    try {
      socketRef.current = io(apiUrl, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        setError(null);

        socketRef.current?.emit("subscribeToNotifications", userId);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setError(new Error("Failed to connect to notification server"));
        setIsConnected(false);
      });

      socketRef.current.on("new-notification", (notification: Notification) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => {
          const exists = prev.some((n) => n.id === notification.id);
          if (exists) {
            return prev.map((n) =>
              n.id === notification.id ? notification : n
            );
          }
          return [notification, ...prev];
        });
      });

      socketRef.current.on(
        "notification-updated",
        (notification: Notification) => {
          console.log("Notification updated:", notification);
          setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? notification : n))
          );
        }
      );

      socketRef.current.on("notification-deleted", ({ id }: { id: number }) => {
        console.log("Notification deleted:", id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      });
    } catch (err) {
      console.error("Socket initialization error:", err);
      setError(err instanceof Error ? err : new Error("Unknown socket error"));
    }
  }, [apiUrl, userId]);

  // --- Disconnect socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    connect();
  }, [connect, disconnect]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect, fetchNotifications]);

  useEffect(() => {
    if (!isConnected && !reconnectTimerRef.current) {
      reconnectTimerRef.current = setTimeout(() => {
        console.log("Attempting to reconnect...");
        reconnect();
        reconnectTimerRef.current = null;
      }, 5000);
    }

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [isConnected, reconnect]);

  return {
    notifications,
    isConnected,
    isLoading,
    error,
    reconnect,
    fetchNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
  };
}
