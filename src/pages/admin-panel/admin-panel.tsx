"use client";

import { useState } from "react";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { Navigate } from "react-router-dom";
import { AdminLayout } from "@/layouts/admin-layout";
import { DashboardView } from "./views/dashboard-view";
import { DoctorsView } from "./views/doctors-view";
import { ServicesView } from "./views/services-view";
import { AppointmentsView } from "./views/appointments-view";
import { ClinicSettingsView } from "./views/clinic-settings-view";

type AdminView =
  | "dashboard"
  | "doctors"
  | "services"
  | "appointments"
  | "settings";

export function AdminPanel() {
  const { role } = useAuthData();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  // Redirect if not a clinic owner
  if (role !== "Owner") {
    return <Navigate to="/login" replace />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "doctors":
        return <DoctorsView />;
      case "services":
        return <ServicesView />;
      case "appointments":
        return <AppointmentsView />;
      case "settings":
        return <ClinicSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </AdminLayout>
  );
}
