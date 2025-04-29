"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Phone, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/shared/ui/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { useAuthData } from "@/entities/auth/model/use-auth-store"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { useAppointments } from "@/entities/appointments/hooks/use-appointment"
import { AppointmentModal } from "@/entities/appointments/ui/appointment-modal"

// Временный список врачей для модального окна
// В реальном приложении это должно приходить с API
const doctors = [
  { id: 1, name: "Др. Елена Смирнова", specialty: "Терапевт" },
  { id: 2, name: "Др. Михаил Иванов", specialty: "Стоматолог" },
  { id: 3, name: "Др. Анна Петрова", specialty: "Кардиолог" },
  { id: 4, name: "Др. Сергей Козлов", specialty: "Невролог" },
  { id: 5, name: "Др. Ольга Соколова", specialty: "Офтальмолог" },
]

export const AppointmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const { userId } = useAuthData()
  const { useUserAppointments, cancelAppointment } = useAppointments()

  const { data: appointments, isLoading, isError, error } = useUserAppointments(Number(userId))

  const formatAppointmentDate = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) {
      return "Сегодня"
    } else if (isTomorrow(date)) {
      return "Завтра"
    } else {
      return format(date, "d MMMM yyyy", { locale: ru })
    }
  }

  const formatAppointmentTime = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, "HH:mm", { locale: ru })
  }

  // Разделяем записи на предстоящие и прошедшие
  const currentDate = new Date()
  const upcomingAppointments = appointments?.filter((appointment: any) => new Date(appointment.date) >= currentDate) || []

  const pastAppointments = appointments?.filter((appointment: any) => new Date(appointment.date) < currentDate) || []

  const handleCancelAppointment = async (id: number) => {
    try {
      await cancelAppointment.mutateAsync(id)
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    }
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Записи к врачу</h1>
            <p className="text-blue-100">Управляйте своими медицинскими записями</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming" className="relative">
              Предстоящие
              {upcomingAppointments.length > 0 && (
                <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">{upcomingAppointments.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              Прошедшие
              {pastAppointments.length > 0 && (
                <Badge className="ml-2 bg-gray-500 hover:bg-gray-600">{pastAppointments.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : isError ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-500">
                Ошибка при загрузке записей: {error?.message || "Неизвестная ошибка"}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-6 rounded-lg text-center">
                <p className="text-blue-500 mb-3">У вас нет предстоящих записей к врачу</p>
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
                      <h3 className="font-semibold text-lg">{appointment.doctor?.name || "Врач не указан"}</h3>
                      <p className="text-gray-500 text-sm">
                        {appointment.doctor?.specialty || "Специальность не указана"}
                      </p>
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
                        onClick={() => {
                          // Здесь можно открыть модальное окно для переноса записи
                          // с предзаполненными данными текущей записи
                        }}
                      >
                        Перенести
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none py-2 h-auto text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={cancelAppointment.isPending}
                      >
                        {cancelAppointment.isPending ? (
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
            {isLoading ? (
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
                      <h3 className="font-semibold text-lg">{appointment.doctor?.name || "Врач не указан"}</h3>
                      <p className="text-gray-500 text-sm">
                        {appointment.doctor?.specialty || "Специальность не указана"}
                      </p>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatAppointmentDate(appointment.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatAppointmentTime(appointment.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t p-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Просмотреть заключение
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} doctors={doctors} />
    </MainLayout>
  )
}
