import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../api/appointment.api";
import { CreateAppointmentDto } from "../models/types";

export function useAppointments() {
  const queryClient = useQueryClient();

  const useUserAppointments = (userId: number | undefined) => {
    return useQuery({
      queryKey: ["appointments", "user", userId],
      queryFn: () => {
        if (!userId) {
          throw new Error("User ID is required");
        }
        return appointmentService.getUserAppointments(userId);
      },
      enabled: !!userId,
    });
  };

  const useDoctorAppointments = (doctorId: number | undefined) => {
    return useQuery({
      queryKey: ["appointments", "doctor", doctorId],
      queryFn: () => {
        if (!doctorId) {
          throw new Error("Doctor ID is required");
        }
        return appointmentService.getDoctorAppointments(doctorId);
      },
      enabled: !!doctorId,
    });
  };

  const createAppointment = useMutation({
    mutationFn: (data: CreateAppointmentDto) => {
      return appointmentService.createAppointment(data);
    },
    onSuccess: () => {
      // Инвалидируем кэш для обновления списка записей
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: (id: number) => {
      return appointmentService.cancelAppointment(id);
    },
    onSuccess: () => {
      // Инвалидируем кэш для обновления списка записей
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    useUserAppointments,
    useDoctorAppointments,
    createAppointment,
    cancelAppointment,
  };
}
