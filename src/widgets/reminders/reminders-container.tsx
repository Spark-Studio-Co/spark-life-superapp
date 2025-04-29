//@ts-nocheck

"use client";
import { useNotificationSocket } from "@/entities/notification/hooks/use-notification";
import { RemindersWidget } from "@/widgets/reminders/reminders";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, WifiOff } from "lucide-react";

interface RemindersContainerProps {
  userId: number;
}

export function RemindersContainer({ userId }: RemindersContainerProps) {
  const {
    notifications,
    isConnected,
    isLoading,
    error,
    reconnect,
    markAsCompleted,
    fetchNotifications,
  } = useNotificationSocket();

  // Map notifications to the format expected by RemindersWidget
  const reminders = notifications.map((notification) => ({
    id: notification.id.toString(),
    title: notification.title,
    description: notification.description,
    time: notification.time,
    isAlert: notification.type === "alert",
    isCompleted: notification.isCompleted || false,
    type: notification.type,
  }));

  // Handle marking a reminder as completed
  const handleCompleteReminder = async (id: string) => {
    await markAsCompleted(Number.parseInt(id));
  };

  // Retry connection and data fetch
  const handleRetry = () => {
    reconnect();
    fetchNotifications();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            Ошибка соединения
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Не удалось подключиться к серверу уведомлений.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="self-start"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Повторить подключение
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isConnected && !error && (
        <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
          <AlertTitle className="flex items-center gap-2 text-amber-700">
            <WifiOff className="h-4 w-4" />
            Отсутствует соединение
          </AlertTitle>
          <AlertDescription className="text-amber-600">
            Ожидание подключения к серверу уведомлений...
          </AlertDescription>
        </Alert>
      )}

      <RemindersWidget
        reminders={reminders}
        isLoading={isLoading}
        onCompleteReminder={handleCompleteReminder}
      />
    </div>
  );
}
