"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MainLayout } from "@/shared/ui/layout";

// Типы данных
interface Clinic {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distance: string;
  phone: string;
  hours: string;
  image: string;
  services: string[];
  insurance: string[];
  isOpen: boolean;
}

// Моковые данные для клиник
const clinicsData: Clinic[] = [
  {
    id: "1",
    name: "Городская поликлиника №1",
    address: "ул. Ленина, 15, Москва",
    rating: 4.2,
    reviewCount: 128,
    specialties: ["Терапия", "Кардиология", "Неврология"],
    distance: "1.2 км",
    phone: "+7 (495) 123-45-67",
    hours: "08:00 - 20:00",
    image: "/modern-clinic-waiting-area.png",
    services: ["Консультации", "Диагностика", "Лабораторные анализы"],
    insurance: ["ОМС", "ДМС Согаз", "ДМС Ингосстрах"],
    isOpen: true,
  },
  {
    id: "2",
    name: "Медицинский центр 'Здоровье'",
    address: "пр. Мира, 42, Москва",
    rating: 4.7,
    reviewCount: 256,
    specialties: ["Гинекология", "Урология", "Эндокринология"],
    distance: "2.5 км",
    phone: "+7 (495) 987-65-43",
    hours: "09:00 - 21:00",
    image: "/modern-medical-center-exterior.png",
    services: ["Консультации", "УЗИ", "Лабораторные анализы", "Физиотерапия"],
    insurance: ["ДМС Альфа", "ДМС Ренессанс", "ДМС РЕСО"],
    isOpen: true,
  },
  {
    id: "3",
    name: "Клиника 'Семейный доктор'",
    address: "ул. Тверская, 8, Москва",
    rating: 4.5,
    reviewCount: 189,
    specialties: ["Педиатрия", "Терапия", "Офтальмология"],
    distance: "3.7 км",
    phone: "+7 (495) 111-22-33",
    hours: "08:00 - 19:00",
    image: "/caring-family-doctor.png",
    services: ["Консультации", "Вакцинация", "Диагностика"],
    insurance: ["ОМС", "ДМС Согаз", "ДМС Альфа"],
    isOpen: false,
  },
  {
    id: "4",
    name: "Диагностический центр",
    address: "Кутузовский пр., 22, Москва",
    rating: 4.8,
    reviewCount: 312,
    specialties: ["МРТ", "КТ", "УЗИ", "Рентген"],
    distance: "5.1 км",
    phone: "+7 (495) 555-66-77",
    hours: "07:00 - 22:00",
    image: "/modern-diagnostic-center.png",
    services: ["МРТ", "КТ", "УЗИ", "Рентген", "Маммография"],
    insurance: ["ОМС", "ДМС Согаз", "ДМС Ингосстрах", "ДМС Альфа"],
    isOpen: true,
  },
  {
    id: "5",
    name: "Стоматологическая клиника 'Улыбка'",
    address: "ул. Арбат, 10, Москва",
    rating: 4.6,
    reviewCount: 275,
    specialties: ["Терапия", "Ортодонтия", "Хирургия", "Имплантология"],
    distance: "4.3 км",
    phone: "+7 (495) 333-44-55",
    hours: "09:00 - 20:00",
    image: "/modern-dental-suite.png",
    services: ["Лечение", "Протезирование", "Имплантация", "Отбеливание"],
    insurance: ["ДМС Ренессанс", "ДМС РЕСО"],
    isOpen: true,
  },
];

// Компонент карточки клиники
const ClinicCard = ({ clinic }: { clinic: Clinic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden mb-4"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0">
            <img
              src={clinic.image || "/placeholder.svg"}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800">
                {clinic.name}
              </h3>
              <Badge
                variant={clinic.isOpen ? "success" : "destructive"}
                className="ml-2"
              >
                {clinic.isOpen ? "Открыто" : "Закрыто"}
              </Badge>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{clinic.address}</span>
              <span className="mx-2">•</span>
              <span>{clinic.distance}</span>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">
                  {clinic.rating}
                </span>
              </div>
              <span className="mx-1 text-sm text-gray-500">
                ({clinic.reviewCount} отзывов)
              </span>
            </div>
            <div className="flex flex-wrap mt-2">
              {clinic.specialties.slice(0, 3).map((specialty, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="mr-1 mb-1 bg-blue-50 text-blue-700 border-blue-200"
                >
                  {specialty}
                </Badge>
              ))}
              {clinic.specialties.length > 3 && (
                <Badge
                  variant="outline"
                  className="mr-1 mb-1 bg-gray-50 text-gray-700 border-gray-200"
                >
                  +{clinic.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-2">
          <AccordionItem value="details" className="border-t border-gray-100">
            <AccordionTrigger className="py-2 text-sm font-medium text-blue-600">
              Подробная информация
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{clinic.hours}</span>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-1">Услуги:</p>
                  <div className="flex flex-wrap">
                    {clinic.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="mr-1 mb-1 bg-green-50 text-green-700 border-green-200"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <p className="font-medium mb-1 mt-2">Страховки:</p>
                  <div className="flex flex-wrap">
                    {clinic.insurance.map((ins, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="mr-1 mb-1 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {ins}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between">
                <Button variant="outline" size="sm" className="text-blue-600">
                  Показать на карте
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Записаться
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
};

// Компонент фильтров
const FilterSection = ({
  activeFilters,
  setActiveFilters,
}: {
  activeFilters: string[];
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const filterOptions = [
    { id: "open", label: "Открыто сейчас" },
    { id: "oms", label: "Принимает ОМС" },
    { id: "dms", label: "Принимает ДМС" },
    { id: "rating4", label: "Рейтинг 4+" },
    { id: "nearby", label: "Рядом со мной" },
  ];

  const specialties = [
    "Терапия",
    "Кардиология",
    "Неврология",
    "Гинекология",
    "Урология",
    "Эндокринология",
    "Педиатрия",
    "Офтальмология",
    "Стоматология",
    "Хирургия",
  ];

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter((id) => id !== filterId));
    } else {
      setActiveFilters([...activeFilters, filterId]);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-3">
        <Filter className="h-5 w-5 mr-2 text-blue-600" />
        <h3 className="font-medium">Фильтры</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilters.includes(option.id) ? "default" : "outline"}
            size="sm"
            className={
              activeFilters.includes(option.id)
                ? "bg-blue-600 hover:bg-blue-700"
                : "text-gray-700"
            }
            onClick={() => toggleFilter(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Специализации</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-sm">
              Выбрать <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {specialties.map((specialty) => (
              <DropdownMenuItem key={specialty}>{specialty}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-500">
            Активных фильтров: {activeFilters.length}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setActiveFilters([])}
          >
            <X className="mr-1 h-4 w-4" /> Сбросить все
          </Button>
        </div>
      )}
    </div>
  );
};

// Основной компонент страницы
export function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>(clinicsData);

  // Эффект для фильтрации клиник
  useEffect(() => {
    let result = clinicsData;

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(query) ||
          clinic.address.toLowerCase().includes(query) ||
          clinic.specialties.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Применение активных фильтров
    if (activeFilters.includes("open")) {
      result = result.filter((clinic) => clinic.isOpen);
    }

    if (activeFilters.includes("oms")) {
      result = result.filter((clinic) => clinic.insurance.includes("ОМС"));
    }

    if (activeFilters.includes("dms")) {
      result = result.filter((clinic) =>
        clinic.insurance.some((ins) => ins.startsWith("ДМС"))
      );
    }

    if (activeFilters.includes("rating4")) {
      result = result.filter((clinic) => clinic.rating >= 4.0);
    }

    // Сортировка по расстоянию, если выбран фильтр "Рядом со мной"
    if (activeFilters.includes("nearby")) {
      result.sort((a, b) => {
        const distA = Number.parseFloat(a.distance.replace(" км", ""));
        const distB = Number.parseFloat(b.distance.replace(" км", ""));
        return distA - distB;
      });
    }

    setFilteredClinics(result);
  }, [searchQuery, activeFilters]);

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold text-white">Клиники</h1>
        <p className="text-blue-100">Найдите подходящую клинику рядом с вами</p>
      </div>

      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-md p-3 flex items-center mb-6">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Поиск клиник, специализаций, адресов..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <FilterSection
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <div className="mt-4">
          {filteredClinics.length > 0 ? (
            filteredClinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))
          ) : (
            <div className="text-center py-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-500"
              >
                <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-lg">Клиники не найдены</p>
                <p className="text-sm">
                  Попробуйте изменить поисковый запрос или фильтры
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
