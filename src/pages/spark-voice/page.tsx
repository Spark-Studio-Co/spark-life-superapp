"use client";
import { Button } from "@/components/ui/button";
import { VoiceAnalysis } from "@/components/ui/voice-analysis";
import { MainLayout } from "@/shared/ui/layout";
import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function VoiceAnalysisPage() {
  const navigation = useNavigate()
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-rose-500 to-pink-400 px-6 pt-8 pb-8">
        <div className="flex flex-row">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white hover:bg-white/20"
            onClick={() => navigation(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Назад</span>
          </Button>
          <h1 className="text-2xl font-bold text-white">SparkVoice</h1>
        </div>
        <p className="text-rose-100">Анализ речи на признаки депрессии</p>
      </div>
      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mt-10">
          <VoiceAnalysis />
        </div>
      </main>
    </MainLayout>
  );
}
