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
  private lastRecordingBlob: Blob | null = null;
  private lastRecordingDate: Date | null = null;

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
      this.lastRecordingDate = new Date();

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

          // Сохраняем последнюю запись для возможности скачивания
          this.lastRecordingBlob = audioBlob;

          // Конвертируем в WAV и отправляем на сервер
          const result = await this.sendAudioToServer(audioBlob, options);

          // Очищаем ресурсы записи, но сохраняем blob для скачивания
          this.clearRecordingResources();

          resolve(result);
        } catch (error) {
          console.error("Ошибка при остановке записи:", error);
          this.clearRecordingResources();
          reject(error);
        }
      };

      // Останавливаем запись
      this.mediaRecorder!.stop();
      this.isRecording = false;
    });
  }

  private clearRecordingResources(): void {
    // Останавливаем все треки в потоке
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    this.stream = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    // Не очищаем lastRecordingBlob, чтобы можно было скачать запись
  }

  private clearRecording(): void {
    this.clearRecordingResources();
    this.lastRecordingBlob = null;
    this.lastRecordingDate = null;
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

  /**
   * Скачивание последней записанной аудиозаписи
   * @param fileName Имя файла для скачивания (без расширения)
   * @returns true если скачивание успешно, false если нет записи для скачивания
   */
  downloadLastRecording(fileName = "audio-recording"): boolean {
    if (!this.lastRecordingBlob) {
      console.error("Нет доступной записи для скачивания");
      return false;
    }

    try {
      // Создаем URL для скачивания
      const url = URL.createObjectURL(this.lastRecordingBlob);

      // Добавляем дату к имени файла, если она доступна
      let fullFileName = fileName;
      if (this.lastRecordingDate) {
        const dateStr = this.formatDateForFileName(this.lastRecordingDate);
        fullFileName = `${fileName}-${dateStr}`;
      }

      // Создаем ссылку для скачивания
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${fullFileName}.wav`;

      // Добавляем ссылку в DOM, кликаем по ней и удаляем
      document.body.appendChild(a);
      a.click();

      // Небольшая задержка перед удалением ссылки
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Освобождаем ресурсы
      }, 100);

      return true;
    } catch (error) {
      console.error("Ошибка при скачивании записи:", error);
      return false;
    }
  }

  /**
   * Проверка наличия записи для скачивания
   * @returns true если есть запись для скачивания
   */
  hasRecordingToDownload(): boolean {
    return this.lastRecordingBlob !== null;
  }

  /**
   * Получение длительности последней записи в секундах
   * @returns Длительность в секундах или null, если нет записи
   */
  getLastRecordingDuration(): number | null {
    if (!this.lastRecordingBlob) return null;

    // Приблизительный расчет длительности по размеру файла
    // (очень приблизительно, для точного определения нужно декодировать аудио)
    const fileSizeInBytes = this.lastRecordingBlob.size;
    const bitRate = 128000; // Примерный битрейт для WAV (128 kbps)
    const durationInSeconds = Math.round((fileSizeInBytes * 8) / bitRate);

    return durationInSeconds;
  }

  /**
   * Форматирование даты для имени файла
   * @param date Дата для форматирования
   * @returns Строка в формате YYYY-MM-DD-HH-MM-SS
   */
  private formatDateForFileName(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

export const audioRecorder = new AudioRecorder();
