"use client"
import { VoiceAnalysis } from "@/components/ui/voice-analysis"

export default function VoiceAnalysisPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
            <div className="w-full max-w-md">
                <h1 className="mb-8 text-center text-3xl font-bold text-primary">Spark Health</h1>
                <VoiceAnalysis />
            </div>
        </main>
    )
}
