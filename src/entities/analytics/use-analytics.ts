import { apiClient } from "@/shared/api/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    byDay: {
      date: string;
      count: number;
    }[];
    byDoctor: {
      doctorId: string;
      doctorName: string;
      count: number;
    }[];
    byService: {
      serviceId: string;
      serviceName: string;
      count: number;
    }[];
  };
  patients: {
    total: number;
    new: number;
    byGender: {
      male: number;
      female: number;
      other: number;
    };
    byAge: {
      under18: number;
      age18to30: number;
      age31to45: number;
      age46to60: number;
      over60: number;
    };
  };
  revenue: {
    total: number;
    byDay: {
      date: string;
      amount: number;
    }[];
    byService: {
      serviceId: string;
      serviceName: string;
      amount: number;
    }[];
    byDoctor: {
      doctorId: string;
      doctorName: string;
      amount: number;
    }[];
  };
}

export const useAnalytics = () => {
  const fetchAnalytics = async (params?: {
    startDate?: string;
    endDate?: string;
    clinicId?: string;
  }): Promise<AnalyticsData> => {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `/analytics${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get(url);
    return response.data;
  };

  const useGetAnalytics = (params?: {
    startDate?: string;
    endDate?: string;
    clinicId?: string;
  }) => {
    return useQuery({
      queryKey: ["analytics", params],
      queryFn: () => fetchAnalytics(params),
    });
  };

  return {
    useGetAnalytics,
  };
};
