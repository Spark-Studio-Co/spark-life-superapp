"use client";

import { motion } from "framer-motion";

interface QuickPromptProps {
  text: string;
  onClick: () => void;
}

export function QuickPrompt({ text, onClick }: QuickPromptProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-xl p-3 text-left shadow-sm hover:shadow-md transition-shadow text-sm text-gray-700 hover:border-purple-300"
      onClick={onClick}
    >
      {text}
    </motion.button>
  );
}
