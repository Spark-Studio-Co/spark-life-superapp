// Define the API response structure
export interface ApiResponse {
  data: Notification[];
  total: number;
  page: number;
  lastPage: number;
}

// Define the Notification type to match the provided JSON structure
export interface Notification {
  id: string | number;
  user_id: number;
  end_date?: string;
  time: string;
  type: "medication" | "measurement" | "appointment" | "alert";
  title: string;
  description: string;
  is_recurring?: boolean;
  recurrence_pattern?: "daily" | "weekly" | "monthly";
  isCompleted?: boolean;
}

// Mock data for notifications based on the provided JSON structure
const mockApiResponse: ApiResponse = {
  data: [
    {
      id: 1,
      user_id: 1,
      end_date: "2025-04-28",
      time: "08:00",
      type: "medication",
      title: "test",
      description: "test",
      is_recurring: true,
      recurrence_pattern: "daily",
      isCompleted: false,
    },
  ],
  total: 1,
  page: 1,
  lastPage: 1,
};

// Notification service for API calls
export const notificationService = {
  // Get all notifications for a user
  async getUserNotifications(userId: number): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter notifications by user_id
    const filteredData = mockApiResponse.data.filter(
      (n) => n.user_id === userId
    );

    return {
      ...mockApiResponse,
      data: filteredData,
      total: filteredData.length,
    };
  },

  // Create a new notification
  async createNotification(
    data: Omit<Notification, "id">
  ): Promise<Notification> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newNotification = {
      ...data,
      id: Date.now(),
      isCompleted: false,
    };

    mockApiResponse.data.push(newNotification);
    mockApiResponse.total = mockApiResponse.data.length;

    return newNotification;
  },

  // Mark notification as completed
  async toggleNotificationStatus(
    id: string | number,
    isCompleted: boolean
  ): Promise<Notification> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const notificationIndex = mockApiResponse.data.findIndex(
      (n) => n.id.toString() === id.toString()
    );

    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }

    mockApiResponse.data[notificationIndex] = {
      ...mockApiResponse.data[notificationIndex],
      isCompleted,
    };

    return mockApiResponse.data[notificationIndex];
  },
};
