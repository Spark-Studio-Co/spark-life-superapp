"use client";

import { useState, useCallback, useEffect } from "react";
import { Message } from "../model/types";
import { apiClient } from "@/shared/api/apiClient";
import { userService } from "@/entities/user/api/user.api";

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getMe();

        const userProfile = {
          firstName: profile.first_name, // исправил правильно
          lastName: profile.last_name,
          phone: profile.phone,
          email: profile.email,
        };

        setUserProfile(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!userProfile) {
        console.error("User profile is not loaded yet");
        return;
      }

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
        const payload = {
          query: text,
          user: userProfile, // правильный чистый user
        };

        const response = await apiClient.post<Message>(
          "/user/ai-assistance",
          payload
        );

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
