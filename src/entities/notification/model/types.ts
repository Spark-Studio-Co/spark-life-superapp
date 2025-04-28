export enum NotificationType {
  MEDICATION = "MEDICATION",
  APPOINTMENT = "APPOINTMENT",
  MEASUREMENT = "MEASUREMENT",
  HYDRATION = "HYDRATION",
  OTHER = "OTHER",
}

export interface Notification {
  id: number;
  user_id: number;
  end_date: string;
  time: string;
  type: NotificationType;
  title?: string;
  description?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationDto {
  user_id: number;
  end_date: string;
  time: string;
  type: NotificationType;
  title?: string;
  description?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}

export interface UpdateNotificationDto {
  end_date?: string;
  time?: string;
  type?: NotificationType;
  title?: string;
  description?: string;
  is_recurring?: boolean;
  recurrence_pattern?: string;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
