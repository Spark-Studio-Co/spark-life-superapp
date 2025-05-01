// @ts-nocheck

"use client";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/shared/ui/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, ArrowLeft, CalendarPlus, Info, Star, Activity, Clock, Phone } from "lucide-react"
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom"
import { apiClient } from "@/shared/api/apiClient"

interface Location {
    lat: number;
    lon: number;
}

interface DentalClinic {
    name: string;
    short_name: string;
    address: string;
    phone: string;
    schedule: string;
    location: Location;
    link: string;
    rating: number;
    reviews_count: number;
    categories: string[];
    images: string[];
    averagePrice: number;
    // UI display fields
    distance?: string;
}

interface Doctor {
    id: number
    name: string
    specialty: string
    photo: string
    rating: number
    review_count: number
    experience: string
    education: string[]
    languages: string[]
    clinic_id: string
    schedule: Record<string, string>
    price: string
    accepts_insurance: string[]
    about: string
}

interface Clinic {
    id: string
    name: string
    owner_id: number
    address: string
    city: string
}

interface Service {
    id: number
    clinic_id: string
    name: string
    description: string
    price: number
    clinic?: Clinic
    doctors?: Doctor[]
    // Additional fields for UI display
    clinic_name?: string
    clinic_address?: string
    clinic_city?: string
    clinic_rating?: number
    clinic_distance?: string
}

// Функция для расчета расстояния между двумя точками по координатам (формула гаверсинуса)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Радиус Земли в километрах
    const R = 6371;
    
    // Перевод градусов в радианы
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    // Формула гаверсинуса
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Расстояние в километрах
    
    return distance;
}

// Форматирование расстояния для отображения
function formatDistance(distance: number): string {
    if (distance < 1) {
        // Если меньше 1 км, показываем в метрах
        return `${Math.round(distance * 1000)} м`;
    } else {
        // Иначе показываем в километрах с одним знаком после запятой
        return `${distance.toFixed(1)} км`;
    }
}

export default function RecommendedClinicsPage() {
    const navigation = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [clinics, setClinics] = useState<DentalClinic[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [error, setError] = useState<string | null>(null)
    const [analysisType, setAnalysisType] = useState<string | null>(null)
    // Текущие координаты пользователя (по умолчанию - центр Алматы)
    const [userLocation, setUserLocation] = useState<{lat: number, lon: number}>({ lat: 43.238949, lon: 76.889709 })

    // Mock data for clinic details
    const clinicDetails: Record<
        string,
        { name: string; address: string; phone: string; rating: number; distance: string }
    > = {
        "bbb9bf30-63f8-45ba-bbf2-147863659f2d": {
            name: "Клиника Здоровье",
            address: "ул. Ленина, 42",
            phone: "+7 (999) 123-45-67",
            rating: 4.7,
            distance: "1.2 км",
        },
        "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed": {
            name: "МедЦентр Плюс",
            address: "пр. Мира, 15",
            phone: "+7 (999) 987-65-43",
            rating: 4.9,
            distance: "0.8 км",
        },
        "81322adc-f043-4b9b-8598-2c5ca0128d67": {
            name: "Городская клиника №3",
            address: "ул. Гагарина, 78",
            phone: "+7 (999) 456-78-90",
            rating: 4.5,
            distance: "2.5 км",
        },
        "16154442-8ac7-4283-9ae6-603b66504757": {
            name: "Медицинский центр 'Доктор'",
            address: "ул. Пушкина, 10",
            phone: "+7 (999) 111-22-33",
            rating: 4.8,
            distance: "1.5 км",
        },
    }

    // Sample services data for fallback
    const mockServicesData: Service[] = [
        {
            id: 1,
            clinic_id: "bbb9bf30-63f8-45ba-bbf2-147863659f2d",
            name: "Приём кардиолога",
            description: "Услуга: приём кардиолога. Качественная диагностика и лечение.",
            price: 2202,
        },
        {
            id: 2,
            clinic_id: "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed",
            name: "Консультация эндокринолога",
            description: "Услуга: консультация эндокринолога. Качественная диагностика и лечение.",
            price: 3303,
        },
        {
            id: 3,
            clinic_id: "81322adc-f043-4b9b-8598-2c5ca0128d67",
            name: "Тест на диабет",
            description: "Услуга: тест на диабет. Качественная диагностика и лечение.",
            price: 951,
        },
        {
            id: 4,
            clinic_id: "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed",
            name: "Анализ крови",
            description: "Услуга: анализ крови. Качественная диагностика и лечение.",
            price: 2415,
        }
    ]


    useEffect(() => {
        // Получить геолокацию пользователя, если браузер поддерживает это
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Error getting geolocation:', error);
                    // Используем координаты по умолчанию
                }
            );
        }
        
        // Extract analysis type from URL search params if present
        const type = searchParams.get('type');
        if (type) {
            setAnalysisType(type);
            // Set appropriate tab based on analysis type
            if (type === 'teeth') setActiveTab('dental');
            else if (type === 'face') setActiveTab('dermatology');
            else if (type === 'voice') setActiveTab('psychology');
            else if (type === 'sleep') setActiveTab('sleep');
        }

        const fetchDentalClinics = async () => {
            try {
                setLoading(true);
                setError(null);

                // Determine category and query based on analysis type
                let category = 'Medical centers / Clinics';
                let query = 'медицинский центр';

                // Get type from URL parameters
                const type = searchParams.get('type');

                if (type) {
                    switch (type) {
                        case 'teeth':
                            category = 'Dental centers';
                            query = 'стоматология';
                            break;
                        case 'face':
                            category = 'Dermatologist / venereologist services';
                            query = 'дерматолог';
                            break;
                        case 'voice':
                            category = 'Psychologist services';
                            query = 'психиатр';
                            break;
                        case 'sleep':
                            category = 'Somnologist services';
                            query = 'сомнолог';
                            break;
                    }
                }

                // Fetch clinics from the API
                const endpoint = '/2gis-clinics/search';
                
                // Подготовка параметров запроса
                const apiParams: Record<string, string | number> = {
                    category,
                    query,
                    pageSize: 10
                };
                
                // Добавляем параметры сортировки из URL, если они есть
                const sortByRating = searchParams.get('sortByRating');
                const sortByPrice = searchParams.get('sortByPrice');
                
                if (sortByRating) {
                    apiParams.sortByRating = sortByRating;
                } else {
                    // По умолчанию сортируем по рейтингу по убыванию
                    apiParams.sortByRating = 'desc';
                }
                
                if (sortByPrice) {
                    apiParams.sortByPrice = sortByPrice;
                }
                
                console.log('API params:', apiParams);
                
                const response = await apiClient.get(endpoint, {
                    params: apiParams
                });

                console.log('Dental clinics:', response.data);

                // Process API data if available
                if (response.data && Array.isArray(response.data)) {
                    // Добавляем фиксированные значения расстояния для каждой клиники
                    const clinicsWithDistance = response.data.map((clinic: DentalClinic, index: number) => {
                        // Фиксированные значения расстояния
                        const distances = [
                            "0.8 км",
                            "1.2 км",
                            "1.5 км",
                            "2.3 км",
                            "3.1 км",
                            "0.6 км",
                            "1.9 км",
                            "2.7 км",
                            "3.5 км",
                            "4.2 км"
                        ];
                        
                        // Выбираем расстояние по индексу клиники
                        const distanceIndex = index % distances.length;
                        const distanceStr = distances[distanceIndex];
                        
                        return {
                            ...clinic,
                            distance: distanceStr
                        };
                    });

                    // Убираем локальную сортировку, так как сортировка должна происходить на сервере
                    // Данные уже должны приходить отсортированными от API
                    setClinics(clinicsWithDistance);
                } else {
                    // Use sample data from the user's request
                    const sampleClinics = [
                        {
                            "name": "ЕВРОМЕД, многопрофильный центр современной медицины",
                            "short_name": "ЕВРОМЕД, ООО, многопрофильный центр современной медицины",
                            "address": "Кемеровская street, 13",
                            "phone": "Не указан",
                            "schedule": "Нет данных",
                            "location": { "lat": 55.001311, "lon": 73.354966 },
                            "link": "",
                            "rating": 5,
                            "reviews_count": 0,
                            "categories": ["Dental centers", "Pediatric services"],
                            "images": [],
                            "averagePrice": 14045,
                            "distance": "1.2 км"
                        },
                        {
                            "name": "Клиника Санитас",
                            "short_name": "Клиника Санитас",
                            "address": "Восход street, 28",
                            "phone": "Не указан",
                            "schedule": "Нет данных",
                            "location": { "lat": 55.013936, "lon": 82.944408 },
                            "link": "",
                            "rating": 4.9,
                            "reviews_count": 0,
                            "categories": ["Dental centers", "Medical centers / Clinics"],
                            "images": [],
                            "averagePrice": 21695,
                            "distance": "0.8 км"
                        },
                        {
                            "name": "Медси, сеть медицинских центров",
                            "short_name": "Медси, сеть медицинских центров",
                            "address": "Красная Пресня street, 16",
                            "phone": "Не указан",
                            "schedule": "Нет данных",
                            "location": { "lat": 55.762028, "lon": 37.571615 },
                            "link": "",
                            "rating": 4.9,
                            "reviews_count": 0,
                            "categories": ["Dental centers", "Medical centers / Clinics"],
                            "images": [],
                            "averagePrice": 14617,
                            "distance": "1.5 км"
                        }
                    ];
                    setClinics(sampleClinics);
                }

                // Also keep the original services data for backward compatibility
                processAndSetMockData();
            } catch (err) {
                console.error('Error fetching dental clinics:', err);
                setError('Не удалось загрузить рекомендации. Используются демо-данные.');

                // Use sample data from the user's request
                const sampleClinics = [
                    {
                        "name": "ЕВРОМЕД, многопрофильный центр современной медицины",
                        "short_name": "ЕВРОМЕД, ООО, многопрофильный центр современной медицины",
                        "address": "Кемеровская street, 13",
                        "phone": "Не указан",
                        "schedule": "Нет данных",
                        "location": { "lat": 55.001311, "lon": 73.354966 },
                        "link": "",
                        "rating": 5,
                        "reviews_count": 0,
                        "categories": ["Dental centers", "Pediatric services"],
                        "images": [],
                        "averagePrice": 14045,
                        "distance": "1.2 км"
                    },
                    {
                        "name": "Клиника Санитас",
                        "short_name": "Клиника Санитас",
                        "address": "Восход street, 28",
                        "phone": "Не указан",
                        "schedule": "Нет данных",
                        "location": { "lat": 55.013936, "lon": 82.944408 },
                        "link": "",
                        "rating": 4.9,
                        "reviews_count": 0,
                        "categories": ["Dental centers", "Medical centers / Clinics"],
                        "images": [],
                        "averagePrice": 21695,
                        "distance": "0.8 км"
                    },
                    {
                        "name": "Медси, сеть медицинских центров",
                        "short_name": "Медси, сеть медицинских центров",
                        "address": "Красная Пресня street, 16",
                        "phone": "Не указан",
                        "schedule": "Нет данных",
                        "location": { "lat": 55.762028, "lon": 37.571615 },
                        "link": "",
                        "rating": 4.9,
                        "reviews_count": 0,
                        "categories": ["Dental centers", "Medical centers / Clinics"],
                        "images": [],
                        "averagePrice": 14617,
                        "distance": "1.5 км"
                    }
                ];
                setClinics(sampleClinics);

                // Also keep the original services data for backward compatibility
                processAndSetMockData();
            } finally {
                setLoading(false);
            }
        };

        // Helper function to process mock data (for backward compatibility)
        const processAndSetMockData = () => {
            const enhancedServices = mockServicesData.map(service => {
                const details = clinicDetails[service.clinic_id] || {
                    name: "Клиника",
                    address: "Адрес не указан",
                    phone: "Телефон не указан",
                    rating: 4.0,
                    distance: "Неизвестно",
                };

                return {
                    ...service,
                    clinic_name: details.name,
                    clinic_address: details.address,
                    clinic_phone: details.phone,
                    clinic_rating: details.rating,
                    clinic_distance: details.distance
                };
            });

            // Sort services by clinic rating (highest first)
            enhancedServices.sort((a, b) => (b.clinic_rating || 0) - (a.clinic_rating || 0));
            setServices(enhancedServices);
        };

        fetchDentalClinics();
    }, [searchParams])



    // Filter services based on active tab
    const filteredServices = services.filter(service => {
        if (activeTab === "all") return true;

        const serviceName = service.name.toLowerCase();
        if (activeTab === "cardio" && (serviceName.includes("кардиолог") || serviceName.includes("кардиологический"))) return true;
        if (activeTab === "endocrinology" && (serviceName.includes("эндокринолог") || serviceName.includes("диабет"))) return true;
        if (activeTab === "nutrition" && serviceName.includes("диетолог")) return true;
        if (activeTab === "analysis" && serviceName.includes("анализ")) return true;
        if (activeTab === "diagnostics" && (serviceName.includes("узи") || serviceName.includes("мониторирование"))) return true;

        return false;
    })




    // Format price with spaces
    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 pt-6 pb-6">
                <div className="flex items-center mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigation(-1)}
                        className="mr-2 text-white hover:bg-white/20"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Назад</span>
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Рекомендуемые клиники</h1>
                </div>
                <p className="text-blue-100">
                    {analysisType === 'teeth' && 'На основе анализа состояния зубов'}
                    {analysisType === 'face' && 'На основе анализа состояния кожи'}
                    {analysisType === 'voice' && 'На основе анализа голоса'}
                    {analysisType === 'sleep' && 'На основе анализа сна'}
                    {!analysisType && 'На основе результатов анализа'}
                </p>
            </div>

            <div className="p-4">
                {error && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Фильтры и сортировка */}
                <div className="mb-4 bg-white rounded-xl shadow-sm p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Сортировка</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">По рейтингу</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (e.target.value) {
                                        params.set('sortByRating', e.target.value);
                                    } else {
                                        params.delete('sortByRating');
                                    }
                                    navigation(`/recommended-clinics?${params.toString()}`);
                                }}
                                value={searchParams.get('sortByRating') || ''}
                            >
                                <option value="">Не выбрано</option>
                                <option value="desc">Сначала высокий</option>
                                <option value="asc">Сначала низкий</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">По цене</label>
                            <select
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    if (e.target.value) {
                                        params.set('sortByPrice', e.target.value);
                                    } else {
                                        params.delete('sortByPrice');
                                    }
                                    navigation(`/recommended-clinics?${params.toString()}`);
                                }}
                                value={searchParams.get('sortByPrice') || ''}
                            >
                                <option value="">Не выбрано</option>
                                <option value="asc">Сначала дешевле</option>
                                <option value="desc">Сначала дороже</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="space-y-6 pb-2 pt-4">
                        {clinics.length > 0 && (
                            <div className="space-y-6">
                                {clinics.map((clinic, index) => (
                                    <motion.div
                                        key={`clinic-${index}-${clinic.name}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="overflow-hidden border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
                                            <CardContent className="px-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-800">{clinic.name}</h3>
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                                                            <span>{clinic.address}</span>
                                                            <Badge variant="outline" className="ml-2 text-xs py-0 px-1.5 bg-blue-50 text-blue-600 border-blue-200">
                                                                {clinic.distance}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                                            <span>{clinic.rating.toFixed(1)}</span>
                                                            {clinic.reviews_count > 0 && (
                                                                <span className="text-gray-400 ml-1">({clinic.rating} отзывов)</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {clinic.categories.slice(0, 3).map((category, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                                                                    {category}
                                                                </Badge>
                                                            ))}
                                                            {clinic.categories.length > 3 && (
                                                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                                                                    +{clinic.categories.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                                    <div className="bg-blue-50 px-3 py-2 rounded-lg text-blue-700 font-bold">
                                                        От {formatPrice(clinic.averagePrice)} тг
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="default"
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                                                        onClick={() => navigation(`/clinics/${index}`)}
                                                    >
                                                        <CalendarPlus className="h-4 w-4 mr-2" />
                                                        Записаться на прием
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}


                        <div className="space-y-6 mt-8 hidden">
                            {filteredServices.map((service, index) => (
                                <motion.div
                                    key={`${service.clinic_id}-${service.name}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <Building2 className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span>{service.clinic_name}</span>
                                                    </div>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span>{service.clinic_address}</span>
                                                        {service.clinic_city && (
                                                            <span className="ml-1 text-gray-400">, {service.clinic_city}</span>
                                                        )}
                                                        <Badge variant="outline" className="ml-2 text-xs py-0 px-1.5 bg-blue-50 text-blue-600 border-blue-200">
                                                            {service.clinic_distance}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                                        <span>{service.clinic_rating?.toFixed(1) || "4.0"}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-50 px-3 py-2 rounded-lg text-blue-700 font-bold">
                                                    {formatPrice(service.price)} ₽
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4 border-l-2 border-blue-200 pl-3 py-1 bg-blue-50/50 rounded-r-md">
                                                {service.description}
                                            </p>

                                            {/* Doctors section if available */}
                                            {service.doctors && service.doctors.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Доступные специалисты:</h4>
                                                    <div className="space-y-2">
                                                        {service.doctors.slice(0, 2).map((doctor) => (
                                                            <div key={doctor.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium">{doctor.name}</p>
                                                                    <p className="text-xs text-gray-500">{doctor.specialty} • {doctor.experience}</p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                                                    <span className="text-xs font-medium">{doctor.rating.toFixed(1)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {service.doctors.length > 2 && (
                                                            <p className="text-xs text-blue-500 text-center">+ еще {service.doctors.length - 2} специалистов</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="default"
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                                                    onClick={() => navigation(`/clinics/${service.clinic_id}`)}
                                                >
                                                    <CalendarPlus className="h-4 w-4 mr-2" />
                                                    Записаться
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => navigation(`/clinics/${service.clinic_id}`)}
                                                >
                                                    <Info className="h-4 w-4 mr-2" />
                                                    О клинике
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
