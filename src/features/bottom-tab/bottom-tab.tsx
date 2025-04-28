"use client";

import { Activity, Calendar, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const BottomNav = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "metrics", label: "Metrics", icon: Activity },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <nav className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={cn(
                "flex flex-1 flex-col items-center py-2",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => {
                setActiveTab(tab.id);
                // Find the tab content and show it
                const tabContent = document.querySelector(
                  `[data-state="${tab.id}"]`
                );
                if (tabContent) {
                  // Hide all tab contents
                  document.querySelectorAll("[data-state]").forEach((el) => {
                    el.setAttribute("data-state", "inactive");
                    el.classList.add("hidden");
                  });
                  // Show the selected tab content
                  tabContent.setAttribute("data-state", "active");
                  tabContent.classList.remove("hidden");
                }
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
