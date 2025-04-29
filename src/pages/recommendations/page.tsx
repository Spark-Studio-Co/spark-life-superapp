"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/shared/ui/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, ArrowLeft, CalendarPlus, Info, Star } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { apiClient } from "@/shared/api/apiClient"

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

export default function RecommendedClinicsPage() {
    const navigation = useNavigate()
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [error, setError] = useState<string | null>(null)

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
        const fetchAIRecommendations = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch AI recommendations from the API
                const response = await apiClient.get('/user/ai-recommendation');
                console.log('AI recommendations:', response.data);

                // Process API data if available
                if (response.data && Array.isArray(response.data)) {
                    // Map API data to our service format with enhanced clinic info
                    const apiServices = response.data.map((apiService: Service) => {
                        // Extract clinic info if available
                        const clinicInfo = apiService.clinic || {
                            id: apiService.clinic_id,
                            name: "Клиника",
                            address: "Адрес не указан",
                            city: "Город не указан",
                            owner_id: 0
                        };

                        // Get the first doctor's rating if available, or use a default
                        const doctorRating = apiService.doctors && apiService.doctors.length > 0
                            ? apiService.doctors[0].rating
                            : 4.0;

                        // Calculate average rating if multiple doctors
                        const avgRating = apiService.doctors && apiService.doctors.length > 0
                            ? apiService.doctors.reduce((sum, doc) => sum + doc.rating, 0) / apiService.doctors.length
                            : doctorRating;

                        // Return enhanced service object
                        return {
                            ...apiService,
                            clinic_name: clinicInfo.name,
                            clinic_address: clinicInfo.address,
                            clinic_city: clinicInfo.city,
                            clinic_rating: avgRating,
                            clinic_distance: "1.5 км" // Mock distance since it's not in the API
                        };
                    });

                    // If we have services from API, use them
                    if (apiServices.length > 0) {
                        // Sort services by clinic rating (highest first)
                        apiServices.sort((a, b) => (b.clinic_rating || 0) - (a.clinic_rating || 0));
                        setServices(apiServices);
                    } else {
                        // Fallback to mock data if no services in API response
                        processAndSetMockData();
                    }
                } else {
                    // Fallback to mock data if API doesn't return expected format
                    processAndSetMockData();
                }
            } catch (err) {
                console.error('Error fetching AI recommendations:', err);
                setError('Не удалось загрузить рекомендации. Используются демо-данные.');

                // Fallback to mock data on error
                processAndSetMockData();
            } finally {
                setLoading(false);
            }
        };

        // Helper function to process mock data
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

        fetchAIRecommendations();
    }, [])



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
                        asChild
                        className="mr-2 text-white hover:bg-white/20"
                    >
                        <Link to="/">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Назад</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Рекомендуемые клиники</h1>
                </div>
                <p className="text-blue-100">На основе результатов анализа</p>
            </div>

            <div className="p-4">
                {error && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                        <p className="text-blue-500 mb-3">Нет услуг, соответствующих выбранным критериям</p>
                        <Button onClick={() => setActiveTab("all")} variant="outline" className="text-blue-600 border-blue-300">
                            Показать все услуги
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 pb-12 pt-4">
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
                )}
            </div>
        </MainLayout>
    )
}
