// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/shared/ui/layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Phone,
  MapPin,
  ArrowLeft,
  CalendarPlus,
  Clock,
  Info,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  clinic_id: string;
  name: string;
  description: string;
  price: number;
  clinic_name?: string;
  clinic_address?: string;
  clinic_phone?: string;
  clinic_rating?: number;
  clinic_distance?: string;
}

export default function RecommendedClinicsPage() {
  const navigation = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for clinic details
  const clinicDetails: Record<
    string,
    {
      name: string;
      address: string;
      phone: string;
      rating: number;
      distance: string;
    }
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
  };

  // Sample services data from the provided JSON
  const servicesData: Service[] = [
    {
      clinic_id: "bbb9bf30-63f8-45ba-bbf2-147863659f2d",
      name: "Приём кардиолога",
      description:
        "Услуга: приём кардиолога. Качественная диагностика и лечение.",
      price: 2202,
    },
    {
      clinic_id: "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed",
      name: "Консультация эндокринолога",
      description:
        "Услуга: консультация эндокринолога. Качественная диагностика и лечение.",
      price: 3303,
    },
    {
      clinic_id: "81322adc-f043-4b9b-8598-2c5ca0128d67",
      name: "Тест на диабет",
      description:
        "Услуга: тест на диабет. Качественная диагностика и лечение.",
      price: 951,
    },
    {
      clinic_id: "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed",
      name: "Анализ крови",
      description: "Услуга: анализ крови. Качественная диагностика и лечение.",
      price: 2415,
    },
    {
      clinic_id: "c8f1aa89-ca3c-4c99-9b2d-0ee7d06a87ed",
      name: "Кардиологический скрининг",
      description:
        "Услуга: кардиологический скрининг. Качественная диагностика и лечение.",
      price: 1121,
    },
    {
      clinic_id: "81322adc-f043-4b9b-8598-2c5ca0128d67",
      name: "УЗИ сердца",
      description: "Услуга: узи сердца. Качественная диагностика и лечение.",
      price: 583,
    },
    {
      clinic_id: "16154442-8ac7-4283-9ae6-603b66504757",
      name: "Холтеровское мониторирование",
      description:
        "Услуга: холтеровское мониторирование. Качественная диагностика и лечение.",
      price: 998,
    },
    {
      clinic_id: "16154442-8ac7-4283-9ae6-603b66504757",
      name: "Диетологическая консультация",
      description:
        "Услуга: диетологическая консультация. Качественная диагностика и лечение.",
      price: 2448,
    },
  ];

  useEffect(() => {
    // Enhance services with clinic details
    const enhancedServices = servicesData.map((service) => {
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
        clinic_distance: details.distance,
      };
    });

    // Sort services by clinic rating (highest first)
    enhancedServices.sort(
      (a, b) => (b.clinic_rating || 0) - (a.clinic_rating || 0)
    );

    setServices(enhancedServices);
    setLoading(false);
  }, []);

  // Get unique specialties for tabs
  const specialties = Array.from(
    new Set(
      servicesData.map((service) => {
        const serviceName = service.name.toLowerCase();
        if (serviceName.includes("кардиолог")) return "cardio";
        if (serviceName.includes("эндокринолог")) return "endocrinology";
        if (serviceName.includes("диабет")) return "endocrinology";
        if (serviceName.includes("диетолог")) return "nutrition";
        if (serviceName.includes("анализ")) return "analysis";
        if (serviceName.includes("узи")) return "diagnostics";
        if (serviceName.includes("мониторирование")) return "diagnostics";
        return "other";
      })
    )
  );

  // Filter services based on active tab
  const filteredServices = services.filter((service) => {
    if (activeTab === "all") return true;

    const serviceName = service.name.toLowerCase();
    if (
      activeTab === "cardio" &&
      (serviceName.includes("кардиолог") ||
        serviceName.includes("кардиологический"))
    )
      return true;
    if (
      activeTab === "endocrinology" &&
      (serviceName.includes("эндокринолог") || serviceName.includes("диабет"))
    )
      return true;
    if (activeTab === "nutrition" && serviceName.includes("диетолог"))
      return true;
    if (activeTab === "analysis" && serviceName.includes("анализ")) return true;
    if (
      activeTab === "diagnostics" &&
      (serviceName.includes("узи") || serviceName.includes("мониторирование"))
    )
      return true;

    return false;
  });

  // Format price with spaces
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 pt-6 pb-6">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigation(-1)}
            className="text-white hover:bg-blue-500/20 mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            Рекомендуемые клиники
          </h1>
        </div>
        <p className="text-blue-100">На основе результатов анализа голоса</p>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-blue-500 mb-3">
              Нет услуг, соответствующих выбранным критериям
            </p>
            <Button
              onClick={() => setActiveTab("all")}
              variant="outline"
              className="text-blue-600 border-blue-300"
            >
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
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="px-4">
                      <div className="flex justify-between items-start">
                        <div className="">
                          <h3 className="font-semibold text-lg">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {service.description}
                          </p>
                          <p className="font-semibold text-blue-600 mt-2">
                            {formatPrice(service.price)} ₽
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        navigation(`/clinics/${service.clinic_id}`)
                      }
                    >
                      <Info className="h-4 w-4" />О клинике
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
