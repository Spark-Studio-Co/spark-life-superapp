import { apiClient } from "@/shared/api/apiClient";
import { CreateAppointmentDto } from "../models/types";

const BASE_URL = "/appointments";

export const appointmentService = {
  /**
   * Создание новой записи на прием
   */
  async createAppointment(data: CreateAppointmentDto) {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  /**
   * Получение записей на прием пользователя
   */
  async getUserAppointments(userId: number) {
    const response = await apiClient.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  /**
   * Получение записей на прием к врачу
   */
  async getDoctorAppointments(doctorId: number) {
    const response = await apiClient.get(`${BASE_URL}/doctor/${doctorId}`);
    return response.data;
  },

  /**
   * Отмена записи на прием
   */
  async cancelAppointment(id: number) {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
