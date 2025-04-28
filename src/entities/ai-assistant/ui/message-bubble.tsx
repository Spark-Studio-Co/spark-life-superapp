"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";
import ava from "@/assets/avatar.png";

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    isRead?: boolean;
  };
  isLast: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.sender === "user"; // Changed from message.role to message.sender
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // test

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <img src={ava} alt="AI Assistant" />
        </Avatar>
      )}
      {isUser && (
        <Avatar className="h-8 w-8 bg-blue-100">
          <img src={ava} alt="User" />
        </Avatar>
      )}
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`p-3 px-4 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl rounded-tr-none"
              : "bg-gray-100 rounded-2xl rounded-tl-none"
          }`}
        >
          {message.text} {/* Changed from message.content to message.text */}
        </div>
        <div
          className={`flex items-center text-xs text-gray-500 mt-1 ${
            isUser ? "justify-end" : ""
          }`}
        >
          <span>{time}</span>
          {isUser && isLast && (
            <span className="flex items-center ml-1">
              <CheckCheck className="h-3 w-3 text-blue-500" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
