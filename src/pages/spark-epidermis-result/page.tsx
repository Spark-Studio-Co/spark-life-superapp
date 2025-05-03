//@ts-nocheck

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  Shield,
  FileText,
  Activity,
  AlertTriangle,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/shared/ui/layout"
import { motion, AnimatePresence } from "framer-motion"

interface EpidermisResult {
  id?: number
  user_id?: number
  check_id?: number
  check_datetime?: string
  class?: string
  class_raw?: string
  desease?: string
  description?: string
  risk?: string
  risk_level?: string
  risk_description?: string
  risk_title?: string
  short_recommendation?: string
  image_url?: string
  masked_s3_url?: string
  colored_s3_url?: string
  prob?: string
  uid?: string
  atlas_page_link?: string
  risk_suggestion?: string
}

export default function SparkEpidermisResult() {
  const [result, setResult] = useState<EpidermisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview")

  useEffect(() => {
    // Try to get the result from localStorage
    const storedResult = localStorage.getItem("skiniver_result")
    const storedError = localStorage.getItem("skiniver_error")

    if (storedError) {
      try {
        const parsedError = JSON.parse(storedError)
        setError(parsedError.message || "Произошла ошибка при анализе")
      } catch (e) {
        setError("Произошла ошибка при анализе")
      }
    } else if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult)
        setResult(parsedResult)
      } catch (e) {
        setError("Ошибка при обработке данных результата")
      }
    } else {
      setError("Результаты анализа не найдены")
    }

    setIsLoading(false)
  }, [])

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    if (!dateString) return "Нет данных"

    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get risk color based on risk level
  const getRiskColor = (level?: string) => {
    switch (level) {
      case "high":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-600",
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        }
      case "medium":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-600",
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        }
      default:
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-600",
          icon: <Shield className="h-5 w-5 text-green-500" />,
        }
    }
  }

  // Render loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-6"></div>
          <h2 className="text-xl font-medium text-blue-800 mb-2">Обработка результатов</h2>
          <p className="text-blue-600">Пожалуйста, подождите...</p>
        </div>
      </MainLayout>
    )
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col min-h-screen">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center">
                <Link to="/spark-epidermis">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold ml-2">Результаты анализа</h1>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ошибка</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link to="/spark-epidermis" className="block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full text-lg font-medium">
                  Вернуться к анализу
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  // Get risk colors
  const riskStyle = getRiskColor(result?.risk_level)

  // Render result
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <Link to="/spark-epidermis">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Результаты анализа</h1>
                <p className="text-sm text-blue-100 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(result?.check_datetime) || ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${activeTab === "overview" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Обзор
                {activeTab === "overview" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-6 py-4 font-medium text-sm transition-colors relative ${activeTab === "details" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Детали
                {activeTab === "details" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  {/* Summary Card */}
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                      <div className="flex items-start">
                        <div
                          className={`w-12 h-12 rounded-full ${riskStyle.bg} flex items-center justify-center mr-4 flex-shrink-0`}
                        >
                          {riskStyle.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800 mb-1">
                            {result?.class || "Результат анализа"}
                          </h2>
                          <p
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskStyle.bg} ${riskStyle.text}`}
                          >
                            {result?.risk_level === "high"
                              ? "Высокий риск"
                              : result?.risk_level === "medium"
                                ? "Средний риск"
                                : "Низкий риск"}
                          </p>
                          {result?.prob && <p className="text-sm text-gray-500 mt-2">Вероятность: {result.prob}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    {result?.image_url && (
                      <div className="relative">
                        <img
                          src={result.image_url || "/placeholder.svg"}
                          alt="Исходное изображение"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {result?.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-6 rounded-2xl shadow-md mb-6"
                    >
                      <div className="flex items-center mb-4">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">Описание</h2>
                      </div>
                      <p className="text-gray-700">{result.description}</p>
                    </motion.div>
                  )}

                  {/* Recommendation */}
                  {(result?.short_recommendation || result?.risk_suggestion) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-blue-50 p-6 rounded-2xl shadow-md mb-6 border border-blue-100"
                    >
                      <div className="flex items-center mb-4">
                        <Heart className="h-5 w-5 text-blue-500 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">Рекомендации</h2>
                      </div>
                      <p className="text-gray-700">{result?.short_recommendation || result?.risk_suggestion}</p>
                    </motion.div>
                  )}

                  {/* Return button */}
                  <div className="flex justify-center mb-8">
                    <Link to="/spark-epidermis">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full">
                        Новый анализ
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  {/* Analysis images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Original image */}
                    {result?.image_url && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h2 className="text-lg font-bold text-gray-800">Исходное изображение</h2>
                        </div>
                        <div className="p-2">
                          <img
                            src={result.image_url || "/placeholder.svg"}
                            alt="Исходное изображение"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Masked image */}
                    {result?.masked_s3_url && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h2 className="text-lg font-bold text-gray-800">Маска эпидермиса</h2>
                        </div>
                        <div className="p-2">
                          <img
                            src={result.masked_s3_url || "/placeholder.svg"}
                            alt="Маска эпидермиса"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Colored image */}
                    {result?.colored_s3_url && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-md overflow-hidden md:col-span-2"
                      >
                        <div className="p-4 border-b">
                          <h2 className="text-lg font-bold text-gray-800">Цветовой анализ</h2>
                        </div>
                        <div className="p-2">
                          <img
                            src={result.colored_s3_url || "/placeholder.svg"}
                            alt="Цветовой анализ"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Risk details */}
                  {(result?.risk_title || result?.risk_level || result?.risk_description) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`p-6 rounded-2xl shadow-md mb-6 ${riskStyle.bg} border ${riskStyle.border}`}
                    >
                      <div className="flex items-center mb-4">
                        {riskStyle.icon}
                        <h2 className="text-lg font-bold text-gray-800 ml-2">{result?.risk_title || "Оценка риска"}</h2>
                      </div>

                      {result?.risk_level && (
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${riskStyle.bg} ${riskStyle.text}`}
                        >
                          {result.risk_level === "high"
                            ? "Высокий риск"
                            : result.risk_level === "medium"
                              ? "Средний риск"
                              : "Низкий риск"}
                        </div>
                      )}

                      {result?.risk_description && <p className="text-gray-700">{result.risk_description}</p>}
                    </motion.div>
                  )}

                  {/* Technical details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-6 rounded-2xl shadow-md mb-8"
                  >
                    <div className="flex items-center mb-4">
                      <Activity className="h-5 w-5 text-blue-500 mr-2" />
                      <h2 className="text-lg font-bold text-gray-800">Технические данные</h2>
                    </div>

                    <div className="space-y-3 text-sm">
                      {result?.class_raw && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Исходная классификация:</span>
                          <span className="font-medium text-gray-800">{result.class_raw}</span>
                        </div>
                      )}

                      {result?.prob && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Вероятность:</span>
                          <span className="font-medium text-gray-800">{result.prob}</span>
                        </div>
                      )}

                      {result?.check_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID проверки:</span>
                          <span className="font-medium text-gray-800">{result.check_id}</span>
                        </div>
                      )}

                      {result?.uid && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">UID:</span>
                          <span className="font-medium text-gray-800">{result.uid}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Return button */}
                  <div className="flex justify-center mb-8">
                    <Link to="/spark-epidermis">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full">
                        Новый анализ
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
