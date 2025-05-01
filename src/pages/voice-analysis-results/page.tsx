"use client";

import { VoiceAnalysisResults } from "@/components/ui/voice-analysis-results";
import { MainLayout } from "@/shared/ui/layout";

export function VoiceAnalysisResultsPage() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-rose-500 to-pink-400 px-6 pt-8 pb-8">
        <h1 className="text-2xl font-bold text-white">Результаты анализа</h1>
        <p className="text-rose-100">SparkVoice</p>
      </div>
      <div className="px-4 py-6">
        <VoiceAnalysisResults />
      </div>
    </MainLayout>
  );
}

export default VoiceAnalysisResultsPage;
