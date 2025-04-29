import { apiClient } from "@/shared/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  photo: string;
  rating: number;
  education: string;
  bio: string;
  clinicId: string;
  schedule: {
    days: string[];
    hours: { start: string; end: string };
  };
  services: string[];
  isAvailable: boolean;
}

export interface DoctorInput {
  name: string;
  specialty: string;
  experience: number;
  photo: File | null;
  education: string;
  bio: string;
  clinicId: string;
  schedule: {
    days: string[];
    hours: { start: string; end: string };
  };
  services: string[];
  isAvailable: boolean;
}

// Hook for fetching doctors list
export const useGetDoctors = (clinicId?: string) => {
  return useQuery({
    queryKey: ["doctors", clinicId],
    queryFn: async () => {
      const url = clinicId ? `/doctors?clinicId=${clinicId}` : "/doctors";
      const response = await apiClient.get(url);
      return response.data as Doctor[];
    },
  });
};

// Hook for fetching a single doctor
export const useGetDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      const response = await apiClient.get(`/doctors/${id}`);
      return response.data as Doctor;
    },
    enabled: !!id,
  });
};

// Hook for creating a doctor
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorData: DoctorInput) => {
      const formData = new FormData();

      // Append all text fields
      Object.entries(doctorData).forEach(([key, value]) => {
        if (key !== "photo" && key !== "schedule" && key !== "services") {
          formData.append(key, String(value));
        }
      });

      // Handle nested schedule object
      formData.append("schedule", JSON.stringify(doctorData.schedule));

      // Handle services array
      doctorData.services.forEach((service) => {
        formData.append("services[]", service);
      });

      // Append photo if exists
      if (doctorData.photo) {
        formData.append("photo", doctorData.photo);
      }

      const response = await apiClient.post("/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data as Doctor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

// Hook for updating a doctor
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DoctorInput>;
    }) => {
      const formData = new FormData();

      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "photo" &&
          key !== "schedule" &&
          key !== "services" &&
          value !== undefined
        ) {
          formData.append(key, String(value));
        }
      });

      // Handle nested schedule object if exists
      if (data.schedule) {
        formData.append("schedule", JSON.stringify(data.schedule));
      }

      // Handle services array if exists
      if (data.services) {
        data.services.forEach((service) => {
          formData.append("services[]", service);
        });
      }

      // Append photo if exists
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const response = await apiClient.patch(`/doctors/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data as Doctor;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", variables.id] });
    },
  });
};

// Hook for deleting a doctor
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/doctors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
