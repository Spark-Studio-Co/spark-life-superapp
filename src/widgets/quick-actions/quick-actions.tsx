"use client";

import { QuickAction } from "@/entities/quick-actions/model/types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface QuickActionsWidgetProps {
  actions: QuickAction[];
}

export const QuickActionsWidget = ({ actions }: QuickActionsWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, boxShadow: "0px 8px 24px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center"
            >
              <Link
                to={action.to}
                className="flex flex-col items-center justify-center gap-2 w-full"
              >
                <div
                  className={`${action.color} h-16 w-16 rounded-2xl flex items-center justify-center shadow-md`}
                >
                  <Icon className="h-7 w-7 text-white/90" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium leading-tight">
                    {action.title.split(" ")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {action.title.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
