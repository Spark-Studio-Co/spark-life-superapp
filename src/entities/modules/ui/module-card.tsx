"use client";

import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  to: string;
  delay?: number;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  color,
  to,
  delay = 0,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Link to={to} className="block">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-start">
              <div className={cn("p-3 rounded-lg mr-4", color)}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
