//@ts-nocheck

import { apiClient } from "@/shared/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  logo?: string;
  workingHours: {
    monday: { start: string; end: string; isOpen: boolean };
    tuesday: { start: string; end: string; isOpen: boolean };
    wednesday: { start: string; end: string; isOpen: boolean };
    thursday: { start: string; end: string; isOpen: boolean };
    friday: { start: string; end: string; isOpen: boolean };
    saturday: { start: string; end: string; isOpen: boolean };
    sunday: { start: string; end: string; isOpen: boolean };
  };
  settings: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
    notifications: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      appointmentReminders: boolean;
      marketingEmails: boolean;
    };
  };
}

export interface ClinicInput {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  logo?: File | null;
  workingHours: {
    monday: { start: string; end: string; isOpen: boolean };
    tuesday: { start: string; end: string; isOpen: boolean };
    wednesday: { start: string; end: string; isOpen: boolean };
    thursday: { start: string; end: string; isOpen: boolean };
    friday: { start: string; end: string; isOpen: boolean };
    saturday: { start: string; end: string; isOpen: boolean };
    sunday: { start: string; end: string; isOpen: boolean };
  };
  settings: {
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
    notifications: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      appointmentReminders: boolean;
      marketingEmails: boolean;
    };
  };
}

export const useClinic = () => {
  const queryClient = useQueryClient();

  const fetchClinic = async (id: string): Promise<Clinic> => {
    const response = await apiClient.get(`/clinics/${id}`);
    return response.data;
  };

  const fetchClinics = async (): Promise<Clinic[]> => {
    const response = await apiClient.get("/clinics");
    return response.data;
  };

  const createClinic = async (clinicData: ClinicInput): Promise<Clinic> => {
    const formData = new FormData();

    // Append all text fields
    Object.entries(clinicData).forEach(([key, value]) => {
      if (key !== "logo" && key !== "workingHours" && key !== "settings") {
        formData.append(key, String(value));
      }
    });

    // Handle nested objects
    formData.append("workingHours", JSON.stringify(clinicData.workingHours));
    formData.append("settings", JSON.stringify(clinicData.settings));

    // Append logo if exists
    if (clinicData.logo) {
      formData.append("logo", clinicData.logo);
    }

    const response = await apiClient.post("/clinics", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const updateClinic = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<ClinicInput>;
  }): Promise<Clinic> => {
    const formData = new FormData();

    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "logo" &&
        key !== "workingHours" &&
        key !== "settings" &&
        value !== undefined
      ) {
        formData.append(key, String(value));
      }
    });

    // Handle nested objects if they exist
    if (data.workingHours) {
      formData.append("workingHours", JSON.stringify(data.workingHours));
    }

    if (data.settings) {
      formData.append("settings", JSON.stringify(data.settings));
    }

    // Append logo if exists
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await apiClient.patch(`/clinics/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  const deleteClinic = async (id: string): Promise<void> => {
    await apiClient.delete(`/clinics/${id}`);
  };

  const useGetClinic = (id: string) => {
    return useQuery({
      queryKey: ["clinics", id],
      queryFn: () => fetchClinic(id),
      enabled: !!id,
    });
  };

  const useGetClinics = () => {
    return useQuery({
      queryKey: ["clinics"],
      queryFn: fetchClinics,
    });
  };

  const useCreateClinic = () => {
    return useMutation({
      mutationFn: createClinic,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clinics"] });
      },
      onError: (error: any) => {},
    });
  };

  const useUpdateClinic = () => {
    return useMutation({
      mutationFn: updateClinic,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["clinics"] });
        queryClient.invalidateQueries({ queryKey: ["clinics", variables.id] });
      },
      onError: (error: any) => {},
    });
  };

  const useDeleteClinic = () => {
    return useMutation({
      mutationFn: deleteClinic,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["clinics"] });
      },
      onError: (error: any) => {},
    });
  };

  return {
    useGetClinic,
    useGetClinics,
    useCreateClinic,
    useUpdateClinic,
    useDeleteClinic,
  };
};
