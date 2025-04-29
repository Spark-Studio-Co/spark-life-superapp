//@ts-nocheck

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MoreHorizontal,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAppointments } from "@/entities/appointments/hooks/use-appointment";
import { useGetDoctors } from "@/entities/doctor/hooks/use-doctors";

export function AppointmentsView() {
  const {
    data: appointments,
    isLoading,
    cancelAppointment,
  } = useAppointments();
  const { data: doctors } = useGetDoctors();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Get current date for filtering
  const now = new Date();

  // Filter and sort appointments
  const filteredAppointments =
    appointments
      ?.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const isUpcoming = appointmentDate >= now;
        const isPast = appointmentDate < now;

        // Filter by tab
        if (selectedTab === "upcoming" && !isUpcoming) return false;
        if (selectedTab === "past" && !isPast) return false;

        // Filter by doctor
        if (
          selectedDoctor !== "all" &&
          appointment.doctor_id.toString() !== selectedDoctor
        )
          return false;

        // Filter by search query
        if (searchQuery) {
          const doctor = doctors?.find((d) => d.id === appointment.doctor_id);
          const doctorName = doctor?.name || "";
          const patientName = `${appointment.user?.first_name || ""} ${
            appointment.user?.last_name || ""
          }`;
          const searchLower = searchQuery.toLowerCase();

          return (
            doctorName.toLowerCase().includes(searchLower) ||
            patientName.toLowerCase().includes(searchLower) ||
            appointment.description?.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }) || [];

  // Open appointment details dialog
  const openDetailsDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  // Open cancel appointment dialog
  const openCancelDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };

  // Handle appointment cancellation
  const onCancelConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      await cancelAppointment.mutateAsync(selectedAppointment.id);

      toast({
        title: "Запись отменена",
        description: "Запись на прием успешно отменена",
      });

      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить запись на прием",
        variant: "destructive",
      });
    }
  };

  // Get doctor name by id
  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find((d) => d.id === doctorId);
    return doctor?.name || "Неизвестный врач";
  };

  // Format appointment date and time
  const formatAppointmentDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: format(date, "d MMMM yyyy", { locale: ru }),
      time: format(date, "HH:mm", { locale: ru }),
      isPast: date < now,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Управление записями</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Поиск записей..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите врача" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все врачи</SelectItem>
              {doctors?.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Записи на прием</CardTitle>
          <CardDescription>
            Управляйте записями пациентов на прием
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
              <TabsTrigger value="past">Прошедшие</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата и время</TableHead>
                    <TableHead>Врач</TableHead>
                    <TableHead>Пациент</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const { date, time, isPast } = formatAppointmentDateTime(
                      appointment.date
                    );
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{date}</span>
                            <span className="text-sm text-gray-500">
                              {time}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getDoctorName(appointment.doctor_id)}
                        </TableCell>
                        <TableCell>
                          {appointment.user ? (
                            <div className="flex flex-col">
                              <span>
                                {appointment.user.first_name}{" "}
                                {appointment.user.last_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {appointment.user.phone}
                              </span>
                            </div>
                          ) : (
                            "Нет данных"
                          )}
                        </TableCell>
                        <TableCell>
                          {isPast ? (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-700"
                            >
                              Завершен
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700"
                            >
                              Запланирован
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Действия</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => openDetailsDialog(appointment)}
                              >
                                Подробнее
                              </DropdownMenuItem>
                              {!isPast && (
                                <DropdownMenuItem
                                  onClick={() => openCancelDialog(appointment)}
                                  className="text-red-600"
                                >
                                  Отменить запись
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Записи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о записи</DialogTitle>
            <DialogDescription>
              Подробная информация о записи на прием
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Дата и время
                  </h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      {formatAppointmentDateTime(selectedAppointment.date).date}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      {formatAppointmentDateTime(selectedAppointment.date).time}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Статус</h3>
                  <div className="flex items-center">
                    {formatAppointmentDateTime(selectedAppointment.date)
                      .isPast ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Завершен</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2 text-green-500" />
                        <span>Запланирован</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Врач</h3>
                <p className="font-medium">
                  {getDoctorName(selectedAppointment.doctor_id)}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Пациент</h3>
                {selectedAppointment.user ? (
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>
                        {selectedAppointment.user.first_name}{" "}
                        {selectedAppointment.user.last_name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{selectedAppointment.user.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{selectedAppointment.user.email}</span>
                    </div>
                  </div>
                ) : (
                  <p>Нет данных о пациенте</p>
                )}
              </div>

              {selectedAppointment.description && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Описание
                  </h3>
                  <p>{selectedAppointment.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить запись</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить эту запись на прием? Пациент будет
              уведомлен об отмене.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Дата и время: </span>
                {formatAppointmentDateTime(selectedAppointment.date).date},
                {formatAppointmentDateTime(selectedAppointment.date).time}
              </p>
              <p>
                <span className="font-medium">Врач: </span>
                {getDoctorName(selectedAppointment.doctor_id)}
              </p>
              {selectedAppointment.user && (
                <p>
                  <span className="font-medium">Пациент: </span>
                  {selectedAppointment.user.first_name}{" "}
                  {selectedAppointment.user.last_name}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onCancelConfirm}
              disabled={cancelAppointment.isPending}
            >
              {cancelAppointment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отмена записи...
                </>
              ) : (
                "Отменить запись"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
