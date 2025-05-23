import { apiClient } from "@/shared/api/apiClient";

export interface TranscriptSummary {
  id: number;
  text: string;
  created_at: string;
  patient_id: number;
  doctor_id: number;
  pdf_url?: string;
  audio_url?: string;
}

export interface PdfResponse {
  file_path: string;
}

export const transcriptService = {
  /**
   * Получение всех транскрипций по ID пациента или врача
   */
  async getTranscripts(
    patientId?: number,
    doctorId?: number
  ): Promise<TranscriptSummary[]> {
    try {
      const params: Record<string, any> = {};
      if (patientId) params.patient_id = patientId;
      if (doctorId) params.doctor_id = doctorId;

      const response = await apiClient.get("/transcript", { params });
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении транскрипций:", error);
      throw error;
    }
  },

  /**
   * Скачивание PDF-отчета с транскрипцией
   */
  async downloadPdfSummary(
    patientId?: number,
    doctorId?: number,
    appointmentDate?: string
  ): Promise<Blob> {
    try {
      const params: Record<string, any> = {};
      if (patientId) params.patient_id = patientId;
      if (doctorId) params.doctor_id = doctorId;
      if (appointmentDate) params.date = appointmentDate;

      const response = await apiClient.get("/transcript/pdf", {
        params,
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("Ошибка при скачивании PDF-отчета:", error);
      throw error;
    }
  },

  /**
   * Получение ссылки на последний PDF-отчет с транскрипцией
   */
  async getLatestPdfUrl(): Promise<string> {
    try {
      const response = await apiClient.get<PdfResponse>("/transcript/last");
      return response.data.file_path;
    } catch (error) {
      console.error(
        "Ошибка при получении ссылки на последний PDF-отчет:",
        error
      );
      throw error;
    }
  },

  /**
   * Скачивание аудиозаписи консультации
   */
  async downloadAudioRecording(
    patientId?: number,
    doctorId?: number,
    appointmentDate?: string
  ): Promise<Blob> {
    try {
      const params: Record<string, any> = {};
      if (patientId) params.patient_id = patientId;
      if (doctorId) params.doctor_id = doctorId;
      if (appointmentDate) params.date = appointmentDate;

      const response = await apiClient.get("/transcript/audio", {
        params,
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      console.error("Ошибка при скачивании аудиозаписи:", error);
      throw error;
    }
  },

  /**
   * Проверка наличия аудиозаписи для консультации
   */
  async checkAudioAvailability(
    patientId?: number,
    doctorId?: number,
    appointmentDate?: string
  ): Promise<boolean> {
    try {
      const params: Record<string, any> = {};
      if (patientId) params.patient_id = patientId;
      if (doctorId) params.doctor_id = doctorId;
      if (appointmentDate) params.date = appointmentDate;

      const response = await apiClient.get("/transcript/check-audio", {
        params,
      });
      return response.data.available;
    } catch (error) {
      console.error("Ошибка при проверке наличия аудиозаписи:", error);
      return false;
    }
  },
};
