"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Droplet, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/shared/ui/layout";
import { HydrationWidget } from "@/widgets/hydration/hydration";

export const HydrationPage = () => {
  const hydrationTips = [
    "Начинайте день со стакана воды",
    "Носите с собой бутылку воды",
    "Пейте воду перед каждым приемом пищи",
    "Установите напоминания о питье воды",
    "Добавляйте в воду лимон или огурец для вкуса",
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-6 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
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
          <div>
            <h1 className="text-2xl font-bold text-white">Гидратация</h1>
            <p className="text-blue-100">Отслеживайте потребление воды</p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-12 space-y-8 pb-8">
        <HydrationWidget goal={2500} initialValue={500} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            Советы по гидратации
          </h2>

          <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6 space-y-4">
              {hydrationTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="mt-0.5 p-1 rounded-full bg-blue-100">
                    <Droplet className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-sm">{tip}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            asChild
            className="w-full max-w-xs py-6 rounded-xl bg-blue-500 hover:bg-blue-600"
          >
            <Link to="/hydration/settings">
              <Plus className="h-5 w-5 mr-2" />
              Настроить цель гидратации
            </Link>
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
