"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Phone, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { MainLayout } from "@/shared/ui/layout";

export const AppointmentsPage = () => {
  const appointments = [
    {
      id: 1,
      doctor: "Др. Елена Смирнова",
      specialty: "Терапевт",
      date: "Завтра, 15 мая 2023",
      time: "10:00 - 10:30",
      location: "Клиника Spark Health, ул. Медицинская, 123",
      phone: "+7 (555) 123-4567",
    },
    {
      id: 2,
      doctor: "Др. Михаил Иванов",
      specialty: "Стоматолог",
      date: "2 июня 2023",
      time: "14:00 - 15:00",
      location: "Стоматология Bright Smile, ул. Здоровья, 456",
      phone: "+7 (555) 987-6543",
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: "Др. Елена Смирнова",
      specialty: "Терапевт",
      date: "10 апреля 2023",
      time: "09:00 - 10:00",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white">Записи к врачу</h1>
        <p className="text-blue-100">Управляйте своими медицинскими записями</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Предстоящие</h2>
          <Button variant="outline" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Новая запись
          </Button>
        </div>

        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
              <p className="text-gray-500 text-sm">{appointment.specialty}</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{appointment.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span>{appointment.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex border-t">
              <Button
                variant="ghost"
                className="flex-1 rounded-none py-2 h-auto text-sm"
              >
                Перенести
              </Button>
              <Button
                variant="ghost"
                className="flex-1 rounded-none py-2 h-auto text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Отменить
              </Button>
            </div>
          </motion.div>
        ))}

        <h2 className="text-lg font-semibold mt-8">Прошедшие записи</h2>

        {pastAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden opacity-70"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
              <p className="text-gray-500 text-sm">{appointment.specialty}</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{appointment.time}</span>
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
      </div>
    </MainLayout>
  );
};
