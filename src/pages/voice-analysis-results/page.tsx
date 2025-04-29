"use client";

import { VoiceAnalysisResults } from "@/components/ui/voice-analysis-results";
import { MainLayout } from "@/shared/ui/layout";

export function VoiceAnalysisResultsPage() {
  return (
    <MainLayout>
      <div className="px-4 py-6">
        <VoiceAnalysisResults />
      </div>
    </MainLayout>
  );
}

export default VoiceAnalysisResultsPage;
