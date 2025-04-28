"use client"
import { Button } from "@/components/ui/button"
import { VoiceAnalysis } from "@/components/ui/voice-analysis"
import { MainLayout } from "@/shared/ui/layout"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function VoiceAnalysisPage() {
    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-6 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="mr-2 text-white hover:bg-white/20"
                    >
                        <Link to="/">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Назад</span>
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">SparkVoice</h1>
                        <p className="text-blue-100">Анализ речи на признаки депрессии</p>
                    </div>
                </motion.div>
            </div>
            <VoiceAnalysis />
        </MainLayout>
    )
}
