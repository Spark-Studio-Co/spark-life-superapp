//@ts-nocheck

import { apiClient } from "@/shared/api/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
  clinicId: string;
}

export interface ServiceInput {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  clinicId: string;
}

// Hook for fetching services list
export const useGetServices = (clinicId?: string) => {
  return useQuery({
    queryKey: ["services", clinicId],
    queryFn: async () => {
      const url = clinicId ? `/services?clinicId=${clinicId}` : "/services";
      const response = await apiClient.get(url);
      return response.data as Service[];
    },
  });
};

// Hook for fetching a single service
export const useGetService = (id: string) => {
  return useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const response = await apiClient.get(`/services/${id}`);
      return response.data as Service;
    },
    enabled: !!id,
  });
};

// Hook for creating a service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: ServiceInput) => {
      const response = await apiClient.post("/services", serviceData);
      return response.data as Service;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: any) => {
      // Handle error
    },
  });
};

// Hook for updating a service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ServiceInput>;
    }) => {
      const response = await apiClient.patch(`/services/${id}`, data);
      return response.data as Service;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.id] });
    },
    onError: (error: any) => {
      // Handle error
    },
  });
};

// Hook for deleting a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: any) => {
      // Handle error
    },
  });
};
