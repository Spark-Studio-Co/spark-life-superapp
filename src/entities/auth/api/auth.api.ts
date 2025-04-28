import { apiClient } from "@/shared/api/apiClient";

export interface RegisterData {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  diseases?: string[];
  password: string;
}

export interface LoginData {
  identifier: string; // Изменено с email на identifier
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const authService = {
  register: async (
    data: RegisterData,
    medDocFile: File
  ): Promise<AuthResponse> => {
    const formData = new FormData();

    // Добавляем все поля из data в formData
    Object.entries(data).forEach(([key, value]) => {
      if (key === "diseases" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("med_doc", medDocFile);

    // Отправляем запрос с FormData
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Вход пользователя
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    console.log(response);
    return response.data;
  },

  // Выход пользователя
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("auth_token");
  },

  // Запрос на сброс пароля
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  // Сброс пароля
  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post("/auth/reset-password", { token, password });
  },
};
