"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuickAction } from "../model/types";

interface QuickActionButtonProps {
  action: QuickAction;
  index: number;
}

export const QuickActionButton = ({
  action,
  index,
}: QuickActionButtonProps) => {
  const Icon = action.icon;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
    >
      <Button
        variant="outline"
        className="w-full h-auto flex-col gap-2 py-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        onClick={() => (window.location.href = action.to)}
      >
        <div className={cn("p-2 rounded-full", action.color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs font-medium text-gray-700">
          {action.title}
        </span>
      </Button>
    </motion.div>
  );
};
