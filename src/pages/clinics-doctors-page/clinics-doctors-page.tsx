"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doctorsData } from "@/shared/data/doctors-data";
import { DoctorCard } from "@/entities/doctor/ui/doctor-card";
import { MainLayout } from "@/shared/ui/layout";

export function ClinicDoctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);

  const clinicDoctors = doctorsData.filter(
    (doctor) => doctor.clinicId === "test"
  );

  const specialties = Array.from(
    new Set(clinicDoctors.map((doctor) => doctor.specialty))
  );

  const filteredDoctors = clinicDoctors.filter((doctor) => {
    const matchesSearch = searchQuery
      ? doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesSpecialty = activeSpecialty
      ? doctor.specialty === activeSpecialty
      : true;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <MainLayout>
      <div className="mt-4 px-6">
        <h2 className="text-xl font-semibold mb-4">Врачи клиники</h2>
        <div className="bg-white rounded-xl shadow-sm p-3 flex items-center mb-4">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <Input
            type="text"
            placeholder="Поиск врачей по имени или специальности..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            <Button
              variant={activeSpecialty === null ? "default" : "outline"}
              size="sm"
              className={
                activeSpecialty === null ? "bg-blue-600 hover:bg-blue-700" : ""
              }
              onClick={() => setActiveSpecialty(null)}
            >
              Все
            </Button>
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={activeSpecialty === specialty ? "default" : "outline"}
                size="sm"
                className={
                  activeSpecialty === specialty
                    ? "bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                    : "whitespace-nowrap"
                }
                onClick={() => setActiveSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>
        {filteredDoctors.length > 0 ? (
          <div>
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-500"
            >
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg">Врачи не найдены</p>
              <p className="text-sm">
                Попробуйте изменить поисковый запрос или фильтры
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
