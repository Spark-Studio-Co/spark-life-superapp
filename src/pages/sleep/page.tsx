"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/shared/ui/layout";
import { SleepWidget } from "@/widgets/sleep/sleep-widget";

export function SleepPage() {
  const sleepTips = [
    "Поддерживайте регулярный график сна",
    "Избегайте кофеина и алкоголя перед сном",
    "Создайте комфортную обстановку для сна",
    "Ограничьте использование экранов за час до сна",
    "Практикуйте расслабляющие техники перед сном",
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-indigo-600 to-blue-400 px-6 pt-8 pb-16">
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
            <h1 className="text-2xl font-bold text-white">Управление сном</h1>
            <p className="text-blue-100">Управляйте своим сном</p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-12 space-y-8 pb-8">
        <SleepWidget />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-600" />
            Советы для здорового сна
          </h2>
          <Card className="border-none rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6 space-y-4">
              {sleepTips.map((tip, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">{tip}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
