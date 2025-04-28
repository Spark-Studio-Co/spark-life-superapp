"use client"

import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function ResultsPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col p-6">
                <motion.button
                    className="w-10 h-10 p-0 rounded-full mb-6 -ml-2 flex items-center justify-center text-foreground"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate("/spark-face")}
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Назад</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 mb-4"
                >
                    <motion.div
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    >
                        <Sparkles className="h-6 w-6 text-yellow-400" />
                    </motion.div>
                    <h1 className="text-3xl font-bold">Готово!</h1>
                </motion.div>

                <motion.p
                    className="text-muted-foreground mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Ознакомьтесь с полным отчетом
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="bg-muted/50 p-4 mb-6 flex flex-row gap-3">
                        <motion.div
                            className="mt-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                        >
                            <AlertCircle className="h-5 w-5 text-primary" />
                        </motion.div>
                        <h2 className="text-lg font-semibold mb-1">
                            Диагноз: <span>Акне</span>
                        </h2>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="p-6 mb-6 border">
                        <p className="text-sm leading-relaxed">
                            На основе анализа изображения кожи, полученного с помощью сканера камеры, алгоритм зафиксировал признаки,
                            характерные для акне на участке кожи в области рук.
                        </p>
                        <p className="text-sm leading-relaxed mt-4">
                            В частности, обнаружены повышенное количество комедонов и локальные покраснения, признаки воспалительных
                            элементов.
                        </p>
                    </Card>
                </motion.div>

                <div className="flex-1"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-end ml-auto"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            className="bg-primary flex ml-auto w-full hover:bg-primary/90 text-primary-foreground px-6"
                            onClick={() => alert("Запись к врачу")}
                        >
                            Записаться на прием
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
