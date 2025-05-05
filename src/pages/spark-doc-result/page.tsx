"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, AlertCircle, CheckCircle2, HelpCircle, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/shared/ui/layout"

interface PotentialDiagnosis {
    name: string
    reason: string
    recommended_action: string
}

interface DocumentResultData {
    advice: string
    status: string
    potential_diagnoses: PotentialDiagnosis[]
}

// Interface for document result - can have two different structures
interface DocumentResult {
    id: number
    user_id: number
    image_url: string
    created_at: string
    // Direct structure (from API)
    result?: DocumentResultData
    // Or nested structure (from history)
    advice?: string
    status?: string
    potential_diagnoses?: PotentialDiagnosis[]
}

export default function SparkDocResult() {
    const navigation = useNavigate()
    const [result, setResult] = useState<DocumentResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Имитация загрузки данных
        const timer = setTimeout(() => {
            try {
                const resultData = localStorage.getItem("document_result")
                const errorData = localStorage.getItem("document_error")

                if (errorData) {
                    const parsedError = JSON.parse(errorData)
                    setError(parsedError.message || "Произошла ошибка при анализе документа")
                } else if (resultData) {
                    try {
                        const parsedResult = JSON.parse(resultData)
                        console.log('Parsed document result:', parsedResult)
                        console.log('Image URL:', parsedResult.image_url)
                        setResult(parsedResult)
                    } catch (jsonError) {
                        console.error('Error parsing JSON:', jsonError, resultData)
                        setError("Ошибка при разборе JSON результатов")
                    }
                } else {
                    setError("Результаты анализа не найдены")
                }
            } catch (e) {
                console.error('General error:', e)
                setError("Ошибка при загрузке результатов")
            } finally {
                setLoading(false)
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [])



    // Helper functions to get data from either structure
    const getResultStatus = (result: DocumentResult | null): string => {
        if (!result) return 'Норма';
        return result.result?.status || result.status || 'Норма';
    }

    const getResultDiagnoses = (result: DocumentResult | null): PotentialDiagnosis[] => {
        if (!result) return [];
        return result.result?.potential_diagnoses || result.potential_diagnoses || [];
    }

    const getResultAdvice = (result: DocumentResult | null): string => {
        if (!result) return 'Проконсультируйтесь с врачом по поводу результатов анализа.';
        return result.result?.advice || result.advice || 'Проконсультируйтесь с врачом по поводу результатов анализа.';
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "норма":
                return "bg-green-50 text-green-700 border-green-200"
            case "возможны отклонения":
                return "bg-yellow-50 text-yellow-700 border-yellow-200"
            case "требуется внимание":
                return "bg-orange-50 text-orange-700 border-orange-200"
            default:
                return "bg-gray-50 text-gray-700 border-gray-200"
        }
    }

    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 px-6 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20" onClick={() => navigation('/spark-doctor')}>
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Назад</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Результаты анализа</h1>
                        <p className="text-emerald-100">SparkDoc</p>
                    </div>
                </motion.div>
            </div>

            <div className="px-4 py-8">
                <div className="max-w-md mx-auto">
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12"
                        >
                            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">Загрузка результатов...</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Ошибка</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>

                            <div className="text-center">
                                <Button className="mt-4" onClick={() => navigation("/spark-doctor")}>
                                    Попробовать снова
                                </Button>
                            </div>
                        </motion.div>
                    ) : result ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="mb-6 overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Документ</CardTitle>
                                        <ImageIcon className="h-5 w-5 text-emerald-500" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/3] w-full bg-muted">
                                        <img
                                            src={result?.image_url}
                                            alt="Медицинский документ"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mb-6">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Статус анализа</CardTitle>
                                        <FileText className="h-5 w-5 text-emerald-500" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Badge variant="outline" className={getStatusBadgeClass(getResultStatus(result))}>
                                        {getResultStatus(result).charAt(0).toUpperCase() + getResultStatus(result).slice(1)}
                                    </Badge>
                                </CardContent>
                            </Card>

                            <Card className="mb-6">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Выявленные диагнозы</CardTitle>
                                        <Badge variant="outline" className="ml-2">
                                            {getResultDiagnoses(result).length}
                                        </Badge>
                                    </div>
                                    <CardDescription>Диагнозы, обнаруженные в документе</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {getResultDiagnoses(result).map((diagnosis, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border rounded-lg p-4"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-medium">{diagnosis?.name}</h3>
                                                </div>
                                                <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                                            </div>
                                            <div className="space-y-2 mt-3">
                                                <div className="p-3 bg-muted rounded-md text-sm">
                                                    <p className="font-medium mb-1">Причина:</p>
                                                    <p className="text-muted-foreground">{diagnosis?.reason}</p>
                                                </div>
                                                <div className="p-3 bg-emerald-50 rounded-md text-sm">
                                                    <p className="font-medium mb-1 text-emerald-700">Рекомендуемые действия:</p>
                                                    <p className="text-emerald-600">{diagnosis?.recommended_action}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Общие рекомендации</CardTitle>
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <CardDescription>На основе анализа документа</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <p className="text-emerald-800">{getResultAdvice(result)}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="mt-6 text-center">
                                <Button variant="outline" className="mr-2" onClick={() => navigation("/spark-doctor")}>
                                    Новый анализ
                                </Button>
                            </div>
                        </motion.div>
                    ) : null}
                </div>
            </div>
        </MainLayout>
    )
}
