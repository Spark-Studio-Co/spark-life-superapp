//@ts-nocheck

"use client";

import { AlertCircle, ArrowLeft, Sparkles, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { MainLayout } from "@/shared/ui/layout"

interface SkinResult {
    class: string;
    desease: string;
    description: string;
    risk: string;
    risk_level: string;
    prob: string;
    atlas_page_link: string;
    image_url: string;
    risk_description: string;
    risk_suggestion: string;
    risk_title: string;
    short_recommendation: string;
}

export default function ResultsPage() {
    const navigate = useNavigate()
    const [result, setResult] = useState<SkinResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        try {
            // Check for error first
            const storedError = localStorage.getItem('skiniver_error')
            if (storedError) {
                console.error('Error found in localStorage:', storedError)
                setError(true)
                setLoading(false)
                return
            }

            // Then check for results
            const storedResult = localStorage.getItem('skiniver_result')
            if (storedResult) {
                console.log('Result found in localStorage')
                const parsedResult = JSON.parse(storedResult)
                console.log('Parsed result:', parsedResult)
                setResult(parsedResult)
            } else {
                console.error('No result found in localStorage')
                setError(true)
            }
        } catch (err) {
            console.error('Error parsing result:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [])

    // Helper function to get risk icon and color based on risk level
    const getRiskStyles = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high':
                return {
                    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-700',
                    borderColor: 'border-red-100'
                }
            case 'medium':
                return {
                    icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
                    bgColor: 'bg-amber-50',
                    textColor: 'text-amber-700',
                    borderColor: 'border-amber-100'
                }
            case 'low':
            default:
                return {
                    icon: <Shield className="h-5 w-5 text-green-500" />,
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-100'
                }
        }
    }

    return (
        <MainLayout>
            <div className="px-4 py-4 pb-8">
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

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
                            />
                            <p className="text-muted-foreground">Загрузка результатов...</p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Ошибка при получении результатов</h2>
                            <p className="text-muted-foreground mb-6">Не удалось получить результаты анализа</p>
                            <Button onClick={() => navigate("/spark-face")}>Попробовать снова</Button>
                        </div>
                    ) : result ? (
                        <>
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

                            {/* Result image */}
                            {result.image_url && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="mb-6"
                                >
                                    <div className="relative rounded-xl overflow-hidden">
                                        <img
                                            src={result.image_url}
                                            alt="Изображение кожи"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Diagnosis card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {result.risk_level && (
                                    <Card className={`${getRiskStyles(result.risk_level).bgColor} p-4 mb-6 flex flex-row gap-3`}>
                                        <motion.div
                                            className="mt-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                                        >
                                            {getRiskStyles(result.risk_level).icon}
                                        </motion.div>
                                        <div>
                                            <h2 className={`text-lg font-semibold mb-1 ${getRiskStyles(result.risk_level).textColor}`}>
                                                Диагноз: <span>{result.class}</span>
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {result.desease} • Вероятность: {result.prob}%
                                            </p>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>

                            {/* Description card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Card className="p-6 mb-6 border">
                                    {result.description && (
                                        <p className="text-sm leading-relaxed whitespace-pre-line">
                                            {result.description}
                                        </p>
                                    )}

                                    {result.risk_description && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <h3 className="font-medium mb-2">Уровень риска: {result.risk}</h3>
                                            <p className="text-sm leading-relaxed">
                                                {result.risk_description}
                                            </p>
                                        </div>
                                    )}

                                    {result.risk_suggestion && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <h3 className="font-medium mb-2">Рекомендации</h3>
                                            <p className="text-sm leading-relaxed">
                                                {result.risk_suggestion}
                                            </p>
                                            <p className="text-sm mt-2 font-medium">
                                                {result.short_recommendation}
                                            </p>
                                        </div>
                                    )}
                                </Card>
                            </motion.div>

                            <div className="flex-1"></div>

                            {/* Action buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col gap-3"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        className="bg-primary flex w-full hover:bg-primary/90 text-primary-foreground px-6"
                                        onClick={() => navigate("/recommended-clinics")}
                                    >
                                        Записаться на прием
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Нет данных</h2>
                            <p className="text-muted-foreground mb-6">Результаты анализа не найдены</p>
                            <Button onClick={() => navigate("/spark-face")}>Вернуться назад</Button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
