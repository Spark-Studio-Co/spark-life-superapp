"use client";

import { useState, useCallback } from "react";
import { Message } from "yup";

// Простая функция для генерации ID
const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Mock AI responses based on keywords
const getAiResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("сон") || lowerMessage.includes("спать")) {
    return "Для улучшения сна рекомендую соблюдать режим, ложиться и вставать в одно и то же время. Избегайте кофеина после обеда, создайте комфортную обстановку в спальне и отключите электронные устройства за час до сна. Регулярные физические упражнения также способствуют здоровому сну, но старайтесь не заниматься ими непосредственно перед сном.";
  }

  if (lowerMessage.includes("вода") || lowerMessage.includes("пить")) {
    return "Рекомендуемая норма потребления воды — около 30 мл на 1 кг веса тела. Для человека весом 70 кг это примерно 2,1 литра в день. Однако потребность может меняться в зависимости от физической активности, климата и состояния здоровья. Старайтесь пить воду равномерно в течение дня, не дожидаясь чувства жажды.";
  }

  if (lowerMessage.includes("стресс")) {
    return "Для снижения стресса рекомендую практиковать глубокое дыхание, медитацию или йогу. Регулярные физические упражнения помогают снизить уровень гормонов стресса. Также важно высыпаться, правильно питаться и находить время для хобби и общения с близкими. При сильном или хроническом стрессе рекомендую обратиться к специалисту.";
  }

  if (
    lowerMessage.includes("питани") ||
    lowerMessage.includes("еда") ||
    lowerMessage.includes("диета")
  ) {
    return "Сбалансированное питание должно включать разнообразные продукты: овощи, фрукты, цельные злаки, белки (рыба, птица, бобовые) и полезные жиры (орехи, авокадо, оливковое масло). Старайтесь ограничить потребление обработанных продуктов, сахара и соли. Питайтесь регулярно, небольшими порциями, и не забывайте о достаточном потреблении воды.";
  }

  return "Спасибо за ваш вопрос! Я могу предоставить информацию о здоровом образе жизни, питании, физической активности и других аспектах здоровья. Чем конкретно я могу вам помочь?";
};

// Simulate typing delay
const getRandomTypingDelay = (text: string): number => {
  return 1000 + text.length * 30;
};

export const useAiAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    const userMessage: Message = {
      id: generateId(),
      text,
      sender: "user",
      timestamp: new Date(),
      isRead: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const aiResponseText = getAiResponse(text);
    const typingDelay = getRandomTypingDelay(aiResponseText);

    setTimeout(() => {
      const aiMessage: Message = {
        id: generateId(),
        text: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, typingDelay);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
  };
};
