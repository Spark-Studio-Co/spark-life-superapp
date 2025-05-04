//@ts-nocheck
import { apiClient } from "@/shared/api/apiClient";

export interface RecordingOptions {
  patientId: number;
  doctorId: number;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private isRecording = false;

  async startRecording(options?: RecordingOptions): Promise<void> {
    if (this.isRecording) return;

    try {
      // Получаем доступ к микрофону
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Создаем MediaRecorder с настройками для WAV
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "audio/webm", // Будет конвертировано в WAV перед отправкой
      });

      this.audioChunks = [];

      // Обработчик для сохранения аудио-чанков
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Начинаем запись
      this.mediaRecorder.start(1000); // Сохраняем данные каждую секунду
      this.isRecording = true;

      console.log("Запись аудио начата");
    } catch (error) {
      console.error("Ошибка при начале записи:", error);
      throw new Error("Не удалось начать запись аудио");
    }
  }

  async stopRecording(options: RecordingOptions): Promise<string | null> {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve, reject) => {
      this.mediaRecorder!.onstop = async () => {
        try {
          // Создаем blob из записанных чанков
          const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });

          // Конвертируем в WAV и отправляем на сервер
          const result = await this.sendAudioToServer(audioBlob, options);

          // Очищаем ресурсы
          this.clearRecording();

          resolve(result);
        } catch (error) {
          console.error("Ошибка при остановке записи:", error);
          this.clearRecording();
          reject(error);
        }
      };

      // Останавливаем запись
      this.mediaRecorder!.stop();
      this.isRecording = false;
    });
  }

  private clearRecording(): void {
    // Останавливаем все треки в потоке
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }

  private async sendAudioToServer(
    audioBlob: Blob,
    options: RecordingOptions
  ): Promise<string> {
    try {
      // Конвертируем Blob в File
      const file = new File([audioBlob], `recording-${Date.now()}.wav`, {
        type: "audio/wav",
      });

      // Создаем FormData для отправки
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patient_id", options.patientId.toString());
      formData.append("doctor_id", options.doctorId.toString());

      // Отправляем на сервер
      const response = await apiClient.post("/transcript/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Аудио успешно отправлено на сервер:", response.data);
      return response.data.text;
    } catch (error) {
      console.error("Ошибка при отправке аудио на сервер:", error);
      throw new Error("Не удалось отправить аудио на сервер");
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

export const audioRecorder = new AudioRecorder();
