//@ts-nocheck

"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAppointments } from "../hooks/use-appointment";

// Схема валидации формы с Yup
const validationSchema = Yup.object({
  doctor_id: Yup.string().required("Выберите врача"),
  date: Yup.date()
    .required("Выберите дату")
    .min(new Date(), "Дата не может быть в прошлом"),
  time: Yup.string()
    .required("Выберите время")
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Время должно быть в формате ЧЧ:ММ"
    ),
  description: Yup.string(),
});

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  selectedDoctorId?: number;
}

export function AppointmentModal({
  isOpen,
  onClose,
  doctors,
  selectedDoctorId,
}: AppointmentModalProps) {
  const { userId } = useAuthData();
  const { createAppointment } = useAppointments();
  const [timeOptions] = useState(() => {
    const options = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        options.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return options;
  });

  const initialValues = {
    doctor_id: selectedDoctorId?.toString() || "",
    date: new Date(),
    time: "09:00",
    description: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!userId) {
      console.error("User ID is required");
      return;
    }

    try {
      // Комбинируем дату и время в формат ISO 8601
      const dateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(":").map(Number);
      dateTime.setHours(hours, minutes);

      await createAppointment.mutateAsync({
        doctor_id: Number.parseInt(values.doctor_id, 10),
        user_id: userId as any,
        date: dateTime.toISOString(),
        description: values.description,
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Запись на прием</DialogTitle>
          <DialogDescription>
            Заполните форму для записи к врачу
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="doctor_id" className="text-sm font-medium">
                  Врач
                </label>
                <Select
                  onValueChange={(value) => setFieldValue("doctor_id", value)}
                  defaultValue={values.doctor_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите врача" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctor_id && touched.doctor_id && (
                  <div className="text-sm text-red-500">{errors.doctor_id}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal w-full",
                          !values.date && "text-muted-foreground"
                        )}
                      >
                        {values.date ? (
                          format(values.date, "PPP", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values.date}
                        onSelect={(date) => setFieldValue("date", date)}
                        disabled={(date) => {
                          // Запрещаем выбор прошедших дат и выходных
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const day = date.getDay();
                          return (
                            date < today || day === 0 || day === 6 // 0 - воскресенье, 6 - суббота
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && touched.date && (
                    <div className="text-sm text-red-500">{errors.date}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Время</label>
                  <Select
                    onValueChange={(value) => setFieldValue("time", value)}
                    defaultValue={values.time}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите время" />
                      <Clock className="h-4 w-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && touched.time && (
                    <div className="text-sm text-red-500">{errors.time}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Описание (необязательно)
                </label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Опишите причину визита"
                  className="resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mt-2"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || createAppointment.isPending}
                  className="mt-2"
                >
                  {isSubmitting || createAppointment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    "Записаться"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
