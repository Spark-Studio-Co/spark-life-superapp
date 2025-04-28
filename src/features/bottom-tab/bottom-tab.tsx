"use client";

import { Home, Grid3X3, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  //@ts-ignore
  const [previousTabIndex, setPreviousTabIndex] = useState(0);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const tabs = [
    { id: "home", label: "Главная", icon: Home, path: "/" },
    { id: "modules", label: "Модули", icon: Grid3X3, path: "/modules" },
    {
      id: "appointments",
      label: "Записи",
      icon: Calendar,
      path: "/appointments",
    },
    { id: "profile", label: "Профиль", icon: User, path: "/profile" },
  ];

  // Определяем активную вкладку на основе текущего пути
  useEffect(() => {
    const index = tabs.findIndex(
      (tab) =>
        tab.path === currentPath ||
        (tab.path !== "/" && currentPath.startsWith(tab.path))
    );
    if (index !== -1 && index !== activeTabIndex) {
      setPreviousTabIndex(activeTabIndex);
      setActiveTabIndex(index);
    }
  }, [currentPath, activeTabIndex]);

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-4 px-4 z-50 pointer-events-none">
      <motion.nav
        className="flex justify-around relative bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 pointer-events-auto max-w-md mx-auto overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeTabIndex;

          return (
            <Link
              key={tab.id}
              ref={(el: any) => (tabRefs.current[index] = el)}
              to={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center py-3 px-2 relative",
                isActive ? "text-primary" : "text-gray-400"
              )}
              onClick={() => {
                if (index !== activeTabIndex) {
                  setPreviousTabIndex(activeTabIndex);
                  setActiveTabIndex(index);
                }
              }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: isActive ? 1 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="flex items-center justify-center relative"
              >
                <Icon className="h-5 w-5 relative z-10" />
              </motion.div>
              <motion.span
                className="text-xs mt-1 font-medium"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>

              {/* New indicator style */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 mx-auto w-8 h-1 bg-primary rounded-t-full"
                  layoutId="tabIndicator"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
