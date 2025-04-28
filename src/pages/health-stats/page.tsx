"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/shared/ui/layout";
import { OverviewTab } from "@/entities/stats/tabs/overview-tab";
import { VitalsTab } from "@/entities/stats/tabs/vitals-tab";
import { PageHeader } from "./blocks/stats-header";

export const HealthStatsPage = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout>
      <PageHeader timeRange={timeRange} setTimeRange={setTimeRange} />
      <div className="p-4 space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="vitals">Показатели</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="vitals" className="space-y-6">
            <VitalsTab />
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="flex justify-center"
        >
          <Button asChild variant="outline" className="w-full max-w-xs">
            <Link to="/">
              <Calendar className="h-4 w-4 mr-2" />
              Календарь здоровья
            </Link>
          </Button>
        </motion.div>
      </div>
    </MainLayout>
  );
};
