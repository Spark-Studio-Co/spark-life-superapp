"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthData } from "@/entities/auth/model/use-auth-store";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/entities/user/hooks/use-user";

type AdminView =
  | "dashboard"
  | "doctors"
  | "services"
  | "appointments"
  | "settings";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export function AdminLayout({
  children,
  currentView,
  onViewChange,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const { removeToken } = useAuthData();
  const { user: userData } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Дашборд",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "doctors",
      label: "Врачи",
      icon: <Stethoscope className="h-5 w-5" />,
    },
    { id: "services", label: "Услуги", icon: <Users className="h-5 w-5" /> },
    {
      id: "appointments",
      label: "Записи",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "settings",
      label: "Настройки",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const userInitials = userData
    ? `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`
    : "КВ";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "bg-white shadow-md z-20 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20",
          "hidden md:block"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div
            className={cn(
              "flex items-center",
              !sidebarOpen && "justify-center w-full"
            )}
          >
            <img
              src="/digital-health-companion.png"
              alt="Spark Health"
              className="h-8 w-8"
            />
            {sidebarOpen && (
              <span className="ml-2 font-bold text-lg">Spark Health</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="mt-8">
          <nav>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as AdminView)}
                className={cn(
                  "flex items-center w-full px-4 py-3 text-left",
                  currentView === item.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100",
                  !sidebarOpen && "justify-center"
                )}
              >
                {item.icon}
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <Button
            variant="ghost"
            className={cn(
              "flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 w-full",
              !sidebarOpen && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Выйти</span>}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AdminView)}
              className={cn(
                "flex flex-col items-center py-3 px-2",
                currentView === item.id ? "text-blue-600" : "text-gray-600"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="ml-2 font-bold text-lg">Spark Health</span>
            </div>

            <div className="flex items-center ml-auto">
              <Button variant="ghost" size="icon" className="mr-2 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">Владелец клиники</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
