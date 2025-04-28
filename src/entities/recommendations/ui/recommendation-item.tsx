"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RecommendationItemProps {
  text: string;
  index: number;
}

export const RecommendationItem = ({
  text,
  index,
}: RecommendationItemProps) => {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      <div className="mt-0.5 p-1 rounded-full bg-blue-100">
        <CheckCircle className="h-4 w-4 text-blue-500" />
      </div>
      <p className="text-sm">{text}</p>
    </motion.div>
  );
};
