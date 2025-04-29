//@ts-nocheck

"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetDoctors } from "@/entities/doctor/hooks/use-doctors";
import { useGetServices } from "@/entities/services/hooks/use-services";
import { useAppointments } from "@/entities/appointments/hooks/use-appointment";
import { useClinic } from "@/entities/clinic/hooks/use-clinic";

export function DashboardView() {
  const { data: clinic } = useClinic();
  const { data: doctors } = useGetDoctors();
  const { data: services } = useGetServices();
  const { data: appointments } = useAppointments();

  const [appointmentsData, setAppointmentsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [doctorPerformance, setDoctorPerformance] = useState([]);

  useEffect(() => {
    if (appointments) {
      // Process appointments data for the chart
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      const appointmentsByDay = last7Days.map((day) => {
        const count = appointments.filter(
          (apt) => apt.date.split("T")[0] === day
        ).length;

        return {
          date: new Date(day).toLocaleDateString("ru-RU", {
            weekday: "short",
            day: "numeric",
          }),
          count,
        };
      });

      setAppointmentsData(appointmentsByDay);
    }

    if (services) {
      // Process services data for the chart
      const topServices = [...services]
        .sort((a, b) => b.price - a.price)
        .slice(0, 5)
        .map((service) => ({
          name: service.name,
          price: service.price,
        }));

      setServicesData(topServices);
    }

    if (doctors && appointments) {
      // Process doctor performance data
      const performance = doctors.map((doctor) => {
        const doctorAppointments = appointments.filter(
          (apt) => apt.doctor_id === doctor.id
        );
        return {
          name: doctor.name.split(" ")[1], // Just the last name
          appointments: doctorAppointments.length,
          rating: doctor.rating,
        };
      });

      setDoctorPerformance(performance);
    }
  }, [appointments, services, doctors]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Панель управления</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Всего врачей
                </p>
                <p className="text-2xl font-bold">{doctors?.length || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="text-gray-500 ml-1">с прошлого месяца</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Услуги</p>
                <p className="text-2xl font-bold">{services?.length || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+5</span>
              <span className="text-gray-500 ml-1">с прошлого месяца</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Записи сегодня
                </p>
                <p className="text-2xl font-bold">
                  {appointments?.filter(
                    (apt) =>
                      new Date(apt.date).toDateString() ===
                      new Date().toDateString()
                  ).length || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-3</span>
              <span className="text-gray-500 ml-1">с прошлой недели</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Доход (месяц)
                </p>
                <p className="text-2xl font-bold">₽125,400</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">с прошлого месяца</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Записи за последние 7 дней</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={appointmentsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Записи"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярность врачей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={doctorPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="appointments"
                    name="Записи"
                    fill="#3b82f6"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="rating"
                    name="Рейтинг"
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Топ услуг по стоимости</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={servicesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="price"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {servicesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₽${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о клинике</CardTitle>
          </CardHeader>
          <CardContent>
            {clinic ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Название</h3>
                  <p className="text-lg">{clinic.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Адрес</h3>
                  <p className="text-lg">{clinic.address}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Город</h3>
                  <p className="text-lg">{clinic.city}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">
                    Количество врачей
                  </h3>
                  <p className="text-lg">{doctors?.length || 0}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">
                    Количество услуг
                  </h3>
                  <p className="text-lg">{services?.length || 0}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Загрузка информации о клинике...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
