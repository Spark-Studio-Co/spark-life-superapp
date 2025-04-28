"use client";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/shared/ui/layout";
import { SleepWidget } from "@/widgets/sleep/sleep-widget";
import { Moon, Clock, Calendar, Settings, ChevronRight } from "lucide-react";

export function SleepPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Moon className="h-6 w-6 text-indigo-600" />
            Трекер сна
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <Settings className="h-4 w-4 mr-1" />
            Настройки
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SleepWidget />
          </div>

          <div className="space-y-6">
            {/* Sleep schedule card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Расписание сна
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Отбой</p>
                    <p className="text-lg font-medium text-gray-800">23:00</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    Изменить
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Подъем</p>
                    <p className="text-lg font-medium text-gray-800">07:00</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    Изменить
                  </Button>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Рекомендуемая продолжительность
                  </p>
                  <p className="text-lg font-medium text-gray-800">8 часов</p>
                </div>
              </div>
            </div>

            {/* Sleep tips card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-600" />
                Советы для здорового сна
              </h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Поддерживайте регулярный график сна
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Избегайте кофеина и алкоголя перед сном
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Создайте комфортную обстановку для сна
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Ограничьте использование экранов за час до сна
                  </p>
                </li>
              </ul>

              <Button
                variant="link"
                className="text-indigo-600 hover:text-indigo-800 p-0 mt-3 h-auto"
              >
                Все советы <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Sleep journal card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Журнал сна
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Ведите журнал сна, чтобы отслеживать качество и
                продолжительность вашего отдыха.
              </p>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Добавить запись
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
