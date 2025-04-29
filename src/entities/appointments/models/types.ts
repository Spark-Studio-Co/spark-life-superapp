export interface Appointment {
  id: number;
  doctor_id: number;
  user_id: number;
  date: string;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentDto {
  doctor_id: number;
  user_id: number;
  date: string;
  description?: string;
}
