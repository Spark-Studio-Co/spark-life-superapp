import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/apiClient";
import { useSearchParams } from "react-router-dom";

export interface Clinic {
    id: number;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    price: number;
    category: string;
    image: string;
    services: string[];
    doctors: number;
    distance?: string;
}

interface ClinicSearchParams {
    category?: string;
    query?: string;
    city?: string;
    minRating?: number;
    maxPrice?: number;
    minPrice?: number;
    sortByRating?: "asc" | "desc";
    sortByPrice?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

export function useRecommendedClinics() {
    const [searchParams] = useSearchParams();

    // Check if we have a type parameter and adjust category/query accordingly
    const type = searchParams.get("type");
    let category = searchParams.get("category") || undefined;
    let query = searchParams.get("query") || undefined;

    // Override category and query based on type if present
    if (type) {
        switch (type) {
            case "teeth":
                category = "Dental centers";
                query = "стоматология";
                break;
            case "face":
                category = "Dermatologist / venereologist services";
                query = "дерматолог";
                break;
            case "voice":
                category = "Psychologist services";
                query = "психиатр";
                break;
            case "sleep":
                category = "Somnologist services";
                query = "сомнолог";
                break;
        }
    }

    // Extract search parameters from URL
    const queryParams: ClinicSearchParams = {
        category: category,
        query: query,
        city: searchParams.get("city") || undefined,
        minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
        sortByRating: searchParams.get("sortByRating") as "asc" | "desc" | undefined,
        sortByPrice: searchParams.get("sortByPrice") as "asc" | "desc" | undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 10,
    };

    // Prepare API parameters
    const apiParams: Record<string, string | number> = {};

    if (queryParams.category) apiParams.category = queryParams.category;
    if (queryParams.query) apiParams.query = queryParams.query;
    if (queryParams.city) apiParams.city = queryParams.city;
    if (queryParams.minRating) apiParams.minRating = queryParams.minRating;
    if (queryParams.maxPrice) apiParams.maxPrice = queryParams.maxPrice;
    if (queryParams.minPrice) apiParams.minPrice = queryParams.minPrice;
    if (queryParams.sortByRating) apiParams.sortByRating = queryParams.sortByRating;
    if (queryParams.sortByPrice) apiParams.sortByPrice = queryParams.sortByPrice;
    if (queryParams.page) apiParams.page = queryParams.page;
    if (queryParams.pageSize) apiParams.pageSize = queryParams.pageSize;

    // Query for clinics
    const { data, isLoading, error } = useQuery({
        queryKey: ["clinics", apiParams],
        queryFn: async () => {
            const response = await apiClient.get("/2gis-clinics/search", { params: apiParams });
            return response.data;
        },
    });

    // Get clinics from API response
    const clinics = data?.clinics || [];

    // Add distance property if not present (for UI display)
    const clinicsWithDistance = clinics.map((clinic: any) => ({
        ...clinic,
        distance: clinic.distance || `${(Math.random() * 3 + 0.5).toFixed(1)} км`
    }));

    return {
        clinics: clinicsWithDistance,
        isLoading,
        error,
        totalCount: data?.totalCount || 0,
        currentPage: queryParams.page || 1,
        pageSize: queryParams.pageSize || 10,
        queryParams
    };
}

// Helper function to create URL with clinic search parameters
export function createClinicSearchUrl(params: ClinicSearchParams & { type?: string }): string {
    const searchParams = new URLSearchParams();

    if (params.category) searchParams.set("category", params.category);
    if (params.query) searchParams.set("query", params.query);
    if (params.city) searchParams.set("city", params.city);
    if (params.minRating) searchParams.set("minRating", params.minRating.toString());
    if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
    if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
    if (params.sortByRating) searchParams.set("sortByRating", params.sortByRating);
    if (params.sortByPrice) searchParams.set("sortByPrice", params.sortByPrice);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString());
    if (params.type) searchParams.set("type", params.type);

    return `/recommended-clinics?${searchParams.toString()}`;
}

export function getClinicUrlByAnalysisType(analysisType: string = "teeth"): string {
    const type = analysisType.toLowerCase();

    const map: Record<string, { category: string; query: string }> = {
        teeth: { category: "Dental centers", query: "стоматология" },
        dental: { category: "Dental centers", query: "стоматология" },
        sparkteeth: { category: "Dental centers", query: "стоматология" },

        skin: { category: "Dermatologist / venereologist services", query: "дерматолог" },
        face: { category: "Dermatologist / venereologist services", query: "дерматолог" },
        sparkface: { category: "Dermatologist / venereologist services", query: "дерматолог" },

        voice: { category: "Psychotherapist services", query: "психиатр" },
        sparkvoice: { category: "Psychotherapist services", query: "психиатр" },

        sleep: { category: "Somnologist services", query: "сомнолог" },
        sparksleep: { category: "Somnologist services", query: "сомнолог" },
    };

    const selected = map[type] || { category: "Medical centers / Clinics", query: "медицинский центр" };

    return createClinicSearchUrl({
        category: selected.category,
        query: selected.query,
        sortByRating: "desc",
        pageSize: 10,
        type,
    });
}

// For backward compatibility
export function getDentalClinicsUrl(): string {
    return getClinicUrlByAnalysisType("skin");
}