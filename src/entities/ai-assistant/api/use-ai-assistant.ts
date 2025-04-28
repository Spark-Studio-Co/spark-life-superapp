import { getMe } from "./../../../../../shipager/shipager-front/src/entities/auth/api/get/me.api";
("use client");

import { useState, useCallback, useEffect } from "react";
import { Message } from "../model/types";
import { apiClient } from "@/shared/api/apiClient";

interface IGetMeRDO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export const useAiAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<IGetMeRDO | null>(null);

  // Загружаем данные пользователя один раз при монтировании
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getMe();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMessage: Message = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        text,
        sender: "user",
        timestamp: new Date(),
        isRead: true,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        if (!userProfile) {
          throw new Error("User profile is not loaded yet");
        }

        const response = await apiClient.post<Message>("/user/ai-assistance", {
          query: text,
          user: userProfile, // Передаем еще и личные данные пользователя
        });

        const aiMessage = response.data;

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Failed to get AI response", error);

        const errorMessage: Message = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          text: "Произошла ошибка при обращении к AI-сервису. Попробуйте позже.",
          sender: "ai",
          timestamp: new Date(),
          isRead: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [userProfile]
  );

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
