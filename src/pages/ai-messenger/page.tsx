"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "@/entities/ai-assistant/ui/message-bubble";
import { QuickPrompt } from "@/entities/ai-assistant/ui/quick-prompt";
import { useAiAssistant } from "@/entities/ai-assistant/api/use-ai-assistant";
import ava from "@/assets/avatar.png";

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage, isTyping } = useAiAssistant();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { id: 1, text: "Как улучшить сон?" },
    { id: 2, text: "Сколько воды нужно пить?" },
    { id: 3, text: "Советы по снижению стресса" },
    { id: 4, text: "Рекомендации по питанию" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-4 text-white flex items-center gap-3 shadow-md">
        <Avatar className="h-10 w-10 border-2 border-white/30 shadow-inner">
          <img src={ava} alt="AI Assistant" className="object-cover" />
        </Avatar>
        <div className="flex-1">
          <h1 className="font-semibold">Здоровье AI</h1>
          <div className="flex items-center text-xs">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Онлайн
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 mx-auto shadow-lg">
                <img
                  src={ava}
                  alt="AI Health Assistant"
                  className="w-full rounded-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Здоровье AI
              </h2>
              <p className="text-gray-600 max-w-md">
                Ваш персональный ассистент по здоровью. Задайте вопрос о
                здоровье, питании, физической активности или получите
                рекомендации.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {quickPrompts.map((prompt) => (
                <QuickPrompt
                  key={prompt.id}
                  text={prompt.text}
                  onClick={() => {
                    sendMessage(prompt.text);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={message.id === messages[messages.length - 1].id}
              />
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8">
                  <img src="/digital-health-companion.png" alt="AI Assistant" />
                </Avatar>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none p-3 px-4 max-w-[80%]">
                  <div className="flex gap-1">
                    <motion.div
                      className="h-2 w-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="h-2 w-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <Card className="border-t p-3 rounded-none border-x-0 shadow-lg bg-white">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение..."
              className="resize-none pr-10 min-h-[40px] max-h-[120px] py-2 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-300"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-md"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
