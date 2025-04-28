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
  const [previousTabIndex, setPreviousTabIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    left: 0,
  });
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

  // Обновляем позицию и размер индикатора при изменении активной вкладки
  useEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabRefs.current[activeTabIndex];
      if (activeTab) {
        const { width, left } = activeTab.getBoundingClientRect();
        const parentLeft =
          activeTab.parentElement?.getBoundingClientRect().left || 0;
        setIndicatorStyle({
          width,
          left: left - parentLeft,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTabIndex]);

  // Replace the getAnimationDirection function
  const getAnimationDirection = () => {
    if (previousTabIndex < activeTabIndex) {
      return 1; // Moving right
    } else if (previousTabIndex > activeTabIndex) {
      return -1; // Moving left
    }
    return 0; // No movement or initial render
  };

  // Get the direction value
  const direction = getAnimationDirection();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white z-50">
      <nav className="flex justify-around relative">
        {/* Анимированный индикатор */}
        <motion.div
          className="absolute bottom-0 h-1 bg-blue-500 rounded-t-full"
          initial={false}
          animate={{
            width: indicatorStyle.width,
            left: indicatorStyle.left,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            // Use the direction to adjust the animation origin
            originX: direction === 1 ? 0 : direction === -1 ? 1 : 0.5,
          }}
          layout
        />

        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeTabIndex;

          return (
            <Link
              key={tab.id}
              ref={(el: any) => (tabRefs.current[index] = el)}
              to={tab.path}
              className={cn(
                "flex flex-1 flex-col items-center py-2 relative",
                isActive ? "text-blue-500" : "text-gray-400"
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
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <motion.span
                className="text-xs mt-1"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
