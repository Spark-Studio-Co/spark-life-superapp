"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Calendar,
  ChevronRight,
  Award,
  Languages,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doctor } from "../model/types";

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

export function DoctorCard({ doctor, compact = false }: DoctorCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-3 flex items-center"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <img
            src={doctor.photo || "/placeholder.svg"}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{doctor.name}</h4>
          <p className="text-sm text-gray-500 truncate">{doctor.specialty}</p>
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0">
              <img
                src={doctor.photo || "/placeholder.svg"}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {doctor.name}
              </h3>
              <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm font-medium">
                    {doctor.rating}
                  </span>
                </div>
                <span className="mx-1 text-sm text-gray-500">
                  ({doctor.reviewCount} отзывов)
                </span>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Award className="h-4 w-4 mr-1 text-gray-400" />
                <span>Стаж {doctor.experience}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{doctor.schedule.hours}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>{doctor.schedule.days.join(", ")}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Стоимость приема</span>
              <p className="font-semibold text-gray-900">{doctor.price}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Записаться
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Запись на прием</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img
                        src={doctor.photo || "/placeholder.svg"}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-blue-600">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Выберите дату
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {["Сегодня", "Завтра", "Ср, 15 мая", "Чт, 16 мая"].map(
                          (date) => (
                            <Button
                              key={date}
                              variant="outline"
                              className="w-full text-sm"
                              size="sm"
                            >
                              {date}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Выберите время
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "09:00",
                          "10:30",
                          "12:00",
                          "14:30",
                          "16:00",
                          "17:30",
                        ].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            className="w-full text-sm"
                            size="sm"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Подтвердить запись
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Скрыть информацию" : "Подробнее о враче"}
          </Button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-gray-100"
            >
              <div className="text-sm">
                <h4 className="font-medium mb-2">О враче</h4>
                <p className="text-gray-600 mb-3">{doctor.about}</p>

                <h4 className="font-medium mb-2">Образование</h4>
                <ul className="list-disc list-inside text-gray-600 mb-3">
                  {doctor.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center">
                    <Languages className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-gray-600">
                      {doctor.languages.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-gray-600">
                      {doctor.acceptsInsurance.length > 0
                        ? `Принимает ${doctor.acceptsInsurance.join(", ")}`
                        : "Не принимает страховки"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
