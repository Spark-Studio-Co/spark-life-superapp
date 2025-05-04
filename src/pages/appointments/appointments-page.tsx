"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Loader2,
  Building2,
  FileText,
  Download,
  FileAudio,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/shared/ui/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useAppointments } from "@/entities/appointments/hooks/use-appointment";
import { AppointmentModal } from "@/entities/appointments/ui/appointment-modal";

import { useNavigate } from "react-router-dom";
import { transcriptService } from "@/entities/audio/transcript-service";

// Временный список врачей для модального окна
// В реальном приложении это должно приходить с API
const doctors = [
  { id: 1, name: "Др. Елена Смирнова", specialty: "Терапевт" },
  { id: 2, name: "Др. Михаил Иванов", specialty: "Стоматолог" },
  { id: 3, name: "Др. Анна Петрова", specialty: "Кардиолог" },
  { id: 4, name: "Др. Сергей Козлов", specialty: "Невролог" },
  { id: 5, name: "Др. Ольга Соколова", specialty: "Офтальмолог" },
];

// Interface for local appointment data
interface LocalAppointment {
  id: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

// Combined appointment type
type CombinedAppointment = any | LocalAppointment;

export const AppointmentsPage = () => {
  const navigation = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { userId } = useAuthData();
  const { useUserAppointments, cancelAppointment } = useAppointments();
  const [localAppointments, setLocalAppointments] = useState<
    LocalAppointment[]
  >([]);
  const [combinedAppointments, setCombinedAppointments] = useState<
    CombinedAppointment[]
  >([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>(
    {}
  );
  const [isAudioDownloading, setIsAudioDownloading] = useState<
    Record<string, boolean>
  >({});
  const [appointmentsWithAudio, setAppointmentsWithAudio] = useState<
    Record<string, boolean>
  >({});
  const [isLatestPdfDownloading, setIsLatestPdfDownloading] = useState(false);

  const {
    data: apiAppointments,
    isLoading: isApiLoading,
    isError,
    error,
  } = useUserAppointments(Number(userId));

  // Load local appointments from localStorage
  useEffect(() => {
    const loadLocalAppointments = () => {
      setIsLocalLoading(true);
      try {
        const savedAppointments = localStorage.getItem("appointments");
        if (savedAppointments) {
          const parsedAppointments = JSON.parse(savedAppointments);
          setLocalAppointments(parsedAppointments);
        }
      } catch (e) {
        console.error("Error loading appointments from localStorage:", e);
      } finally {
        setIsLocalLoading(false);
      }
    };

    loadLocalAppointments();
  }, []);

  // Combine API and local appointments
  useEffect(() => {
    const combined = [...(apiAppointments || [])];

    // Convert local appointments to the same format as API appointments
    const formattedLocalAppointments = localAppointments.map((local) => {
      // Create a date object from date and time
      const [year, month, day] = local.date.split("-").map(Number);
      const [hours, minutes] = local.time.split(":").map(Number);
      const dateObj = new Date(year, month - 1, day, hours, minutes);

      return {
        id: local.id,
        date: dateObj.toISOString(),
        doctor: { name: "Клиника" },
        location: local.clinicAddress,
        clinicName: local.clinicName,
        phone: local.phone,
        userName: local.name,
        status: local.status,
        isLocal: true, // Flag to identify local appointments
      };
    });

    setCombinedAppointments([...combined, ...formattedLocalAppointments]);
  }, [apiAppointments, localAppointments]);

  // Проверяем наличие аудиозаписей для прошедших приемов
  useEffect(() => {
    const checkAudioAvailability = async () => {
      if (!userId || !combinedAppointments.length) return;

      const currentDate = new Date();
      const pastAppointments = combinedAppointments.filter(
        (appointment) => new Date(appointment.date) < currentDate
      );

      const audioAvailability: Record<string, boolean> = {};

      for (const appointment of pastAppointments) {
        try {
          const hasAudio = await transcriptService.checkAudioAvailability(
            Number(userId),
            appointment.doctor?.id,
            appointment.date
          );
          audioAvailability[appointment.id] = hasAudio;
        } catch (error) {
          console.error(
            `Ошибка при проверке аудио для записи ${appointment.id}:`,
            error
          );
          audioAvailability[appointment.id] = false;
        }
      }

      setAppointmentsWithAudio(audioAvailability);
    };

    if (combinedAppointments.length > 0 && activeTab === "past") {
      checkAudioAvailability();
    }
  }, [combinedAppointments, userId, activeTab]);

  const formatAppointmentDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Сегодня";
    } else if (isTomorrow(date)) {
      return "Завтра";
    } else {
      return format(date, "d MMMM yyyy", { locale: ru });
    }
  };

  const formatAppointmentTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "HH:mm", { locale: ru });
  };

  // Разделяем записи на предстоящие и прошедшие
  const currentDate = new Date();
  const upcomingAppointments = combinedAppointments.filter(
    (appointment) => new Date(appointment.date) >= currentDate
  );

  const pastAppointments = combinedAppointments.filter(
    (appointment) => new Date(appointment.date) < currentDate
  );

  const handleCancelAppointment = async (
    id: number | string,
    isLocal = false
  ) => {
    try {
      if (isLocal) {
        // Handle local appointment cancellation
        const updatedAppointments = localAppointments.filter(
          (app) => app.id !== id
        );
        setLocalAppointments(updatedAppointments);
        localStorage.setItem(
          "appointments",
          JSON.stringify(updatedAppointments)
        );
      } else {
        // Handle API appointment cancellation
        await cancelAppointment.mutateAsync(id as number);
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  // Функция для скачивания PDF-отчета с транскрипцией
  const handleDownloadTranscript = async (appointment: any) => {
    try {
      setIsDownloading({ ...isDownloading, [appointment.id]: true });

      // Получаем ID пациента и врача из записи
      const patientId = userId;
      const doctorId = appointment.doctor?.id;
      const appointmentDate = appointment.date;

      // Скачиваем PDF-отчет
      const pdfBlob = await transcriptService.downloadPdfSummary(
        Number(patientId),
        doctorId,
        appointmentDate
      );

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;

      // Формируем имя файла
      const doctorName = appointment.doctor?.name || "Врач";
      const dateStr = format(parseISO(appointment.date), "dd-MM-yyyy", {
        locale: ru,
      });
      link.download = `Транскрипция_${doctorName}_${dateStr}.pdf`;

      // Запускаем скачивание
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Успешно",
        description: "PDF-отчет с транскрипцией успешно скачан",
      });
    } catch (error) {
      console.error("Ошибка при скачивании транскрипции:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать PDF-отчет с транскрипцией",
        variant: "destructive",
      });
    } finally {
      setIsDownloading({ ...isDownloading, [appointment.id]: false });
    }
  };

  // Функция для скачивания аудиозаписи консультации
  const handleDownloadAudio = async (appointment: any) => {
    try {
      setIsAudioDownloading({ ...isAudioDownloading, [appointment.id]: true });

      // Получаем ID пациента и врача из записи
      const patientId = userId;
      const doctorId = appointment.doctor?.id;
      const appointmentDate = appointment.date;

      // Скачиваем аудиозапись
      const audioBlob = await transcriptService.downloadAudioRecording(
        Number(patientId),
        doctorId,
        appointmentDate
      );

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(audioBlob);
      const link = document.createElement("a");
      link.href = url;

      // Формируем имя файла
      const doctorName = appointment.doctor?.name || "Врач";
      const dateStr = format(parseISO(appointment.date), "dd-MM-yyyy", {
        locale: ru,
      });
      link.download = `Аудиозапись_${doctorName}_${dateStr}.wav`;

      // Запускаем скачивание
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Успешно",
        description: "Аудиозапись консультации успешно скачана",
      });
    } catch (error) {
      console.error("Ошибка при скачивании аудиозаписи:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать аудиозапись консультации",
        variant: "destructive",
      });
    } finally {
      setIsAudioDownloading({ ...isAudioDownloading, [appointment.id]: false });
    }
  };

  // Функция для открытия PDF по динамической ссылке
  const handleOpenDirectPdf = async () => {
    try {
      setIsLatestPdfDownloading(true);

      // Получаем ссылку на последний PDF-отчет
      const pdfUrl = await transcriptService.getLatestPdfUrl();

      // Открываем PDF в новой вкладке
      window.open(pdfUrl, "_blank");

      toast({
        title: "Успешно",
        description: "PDF-отчет открыт в новой вкладке",
      });
    } catch (error) {
      console.error("Ошибка при открытии PDF-отчета:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось открыть PDF-отчет",
        variant: "destructive",
      });
    } finally {
      setIsLatestPdfDownloading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Записи на прием</h1>
            <p className="text-blue-100">
              Управляйте своими медицинскими записями
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleOpenDirectPdf}
            disabled={isLatestPdfDownloading}
          >
            {isLatestPdfDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Загрузка...</span>
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                <span>Открыть отчет</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs
          defaultValue="upcoming"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming" className="relative">
              Предстоящие
              {upcomingAppointments.length > 0 && (
                <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
                  {upcomingAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Прошедшие
              {pastAppointments.length > 0 && (
                <Badge className="ml-2 bg-gray-500 hover:bg-gray-600">
                  {pastAppointments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-2">
            {isApiLoading || isLocalLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : isError ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-500">
                Ошибка при загрузке записей:{" "}
                {error?.message || "Неизвестная ошибка"}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-6 rounded-lg text-center">
                <p className="text-blue-500 mb-3">
                  У вас нет предстоящих записей к врачу
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {upcomingAppointments.map((appointment: any, index: number) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        {appointment.doctor?.name || "Врач не указан"}
                      </h3>
                      {appointment.clinicName && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Building2 className="h-4 w-4 mr-1 text-blue-500" />
                          <span>{appointment.clinicName}</span>
                        </div>
                      )}
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>{formatAppointmentDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{formatAppointmentTime(appointment.date)}</span>
                        </div>
                        {appointment.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <span>{appointment.location}</span>
                          </div>
                        )}
                        {appointment.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span>{appointment.phone}</span>
                          </div>
                        )}
                        {appointment.userName && (
                          <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium">Имя пациента:</p>
                            <p>{appointment.userName}</p>
                          </div>
                        )}
                        {appointment.description && (
                          <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                            <p className="font-medium">Описание:</p>
                            <p>{appointment.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex border-t">
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none py-2 h-auto text-sm"
                        onClick={() => navigation("/video-chat/1")}
                      >
                        Перейти к звонку
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none py-2 h-auto text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleCancelAppointment(
                            appointment.id,
                            appointment.isLocal
                          )
                        }
                        disabled={
                          !appointment.isLocal && cancelAppointment.isPending
                        }
                      >
                        {!appointment.isLocal && cancelAppointment.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Отмена...
                          </>
                        ) : (
                          "Отменить"
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-2">
            {isApiLoading || isLocalLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : pastAppointments.length === 0 ? (
              <div className="p-6 rounded-lg text-center text-gray-500">
                У вас нет прошедших записей к врачу
              </div>
            ) : (
              <AnimatePresence>
                {pastAppointments.map((appointment: any, index: number) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden opacity-80"
                  >
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">
                        {appointment.doctor?.name || "Врач не указан"}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {appointment.doctor?.specialty ||
                          "Специальность не указана"}
                      </p>
                      {appointment.clinicName && (
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{appointment.clinicName}</span>
                        </div>
                      )}
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatAppointmentDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatAppointmentTime(appointment.date)}</span>
                        </div>
                        {appointment.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{appointment.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t p-2 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="truncate">Заключение</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                        onClick={() => handleDownloadTranscript(appointment)}
                        disabled={isDownloading[appointment.id]}
                      >
                        {isDownloading[appointment.id] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="truncate">Загрузка...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            <span className="truncate">PDF</span>
                          </>
                        )}
                      </Button>
                      {appointmentsWithAudio[appointment.id] && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center col-span-2"
                          onClick={() => handleDownloadAudio(appointment)}
                          disabled={isAudioDownloading[appointment.id]}
                        >
                          {isAudioDownloading[appointment.id] ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              <span className="truncate">
                                Загрузка аудио...
                              </span>
                            </>
                          ) : (
                            <>
                              <FileAudio className="h-4 w-4 mr-2" />
                              <span className="truncate">
                                Скачать аудиозапись
                              </span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctors={doctors}
      />
    </MainLayout>
  );
};
