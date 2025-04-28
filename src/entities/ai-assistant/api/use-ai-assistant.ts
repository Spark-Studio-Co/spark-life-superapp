"use client";

import { useState, useCallback } from "react";
import { Message } from "../model/types";
import { apiClient } from "@/shared/api/apiClient";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useAiAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: generateId(),
      text,
      sender: "user",
      timestamp: new Date(),
      isRead: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Отправляем текст на бэкенд
      const response = await apiClient.post<{ response: string }>(
        "/user/ai-assistance",
        {
          query: text,
        }
      );

      const aiMessage: Message = {
        id: generateId(),
        text:
          response.data.response ||
          "Извините, я не смог обработать ваш запрос.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response", error);
      const errorMessage: Message = {
        id: generateId(),
        text: "Произошла ошибка при обращении к AI-сервису. Попробуйте позже.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
