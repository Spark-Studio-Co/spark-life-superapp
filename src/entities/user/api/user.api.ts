import { apiClient } from "@/shared/api/apiClient";
import { User } from "../model/types";

export const userService = {
  // Получение данных текущего пользователя
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  },

  // Обновление данных пользователя
  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/user/${userId}`, data);
    return response.data;
  },

  // Обновление медицинского документа
  updateMedDoc: async (userId: number, medDocFile: File): Promise<User> => {
    const formData = new FormData();
    formData.append("med_doc", medDocFile);

    const response = await apiClient.patch<User>(
      `/users/${userId}/med-doc`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
