"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, ImageIcon, Shield, Activity, ArrowLeft, Clock, ChevronDown, ChevronUp, Microscope, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { MainLayout } from "@/shared/ui/layout"
import { apiClient } from "@/shared/api/apiClient"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface HistoryItem {
  id: number
  user_id: number
  check_id: number
  check_datetime: string
  class: string
  class_raw: string
  desease: string
  description: string
  risk: string
  risk_level: string
  risk_description: string
  risk_title: string
  short_recommendation: string
  image_url: string
  masked_s3_url: string
  colored_s3_url: string
  prob: string
  uid: string
  atlas_page_link: string
}

export default function SparkEpidermis() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const [cameraActive, setCameraActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    if (selectedImage && !isProcessing) {
      processImage()
    }
  }, [selectedImage])

  // Load history data when component mounts
  useEffect(() => {
    fetchHistoryData()
  }, [])

  // Function to fetch history data from API
  const fetchHistoryData = async () => {
    setIsLoadingHistory(true)
    try {
      // Fetch history data from the API
      const response = await apiClient.get("skiniver/history-detailed")
      console.log("History data from API:", response.data)

      // Set the history data from the API response
      setHistoryData(response.data.history || [])
    } catch (error) {
      console.error("Ошибка при загрузке истории:", error)
      // If there's an error, set empty history data
      setHistoryData([])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to view a specific history item
  const viewHistoryItem = (item: HistoryItem) => {
    try {
      // Clear any previous errors
      localStorage.removeItem("skiniver_error")

      // Format the history item to match the expected structure in the results page
      // This ensures compatibility with how the result page expects the data
      const formattedItem = {
        ...item,
        // Add any missing fields that the results page might expect
        risk_suggestion: item.short_recommendation || "",
      }

      // Save the selected history item to localStorage
      localStorage.setItem("skiniver_result", JSON.stringify(formattedItem))

      // Navigate to the result page
      navigate("/spark-epidermis-result")
    } catch (error) {
      console.error("Error processing history item:", error)
      // Store error in localStorage for the results page to display
      localStorage.setItem("skiniver_error", JSON.stringify({ message: "Error processing history data" }))
      navigate("/spark-epidermis-result")
    }
  }

  // Очистка ресурсов камеры при размонтировании компонента
  useEffect(() => {
    return () => {
      // Остановка всех медиа-треков при размонтировании компонента
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [])

  // Остановка камеры при переходе на другую страницу или закрытии приложения
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }
        setCameraActive(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const activateCamera = async () => {
    try {
      // Остановка предыдущей сессии камеры, если она существует
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }
        videoRef.current.srcObject = null // Явно очищаем srcObject
      }

      setCameraActive(true)
      setCameraError(false)

      // Оптимизированные настройки для WebView
      const constraints = {
        video: {
          facingMode: "user", // Используем фронтальную камеру
          width: { ideal: 1280 },
          height: { ideal: 720 },
          // Добавляем дополнительные настройки для мобильных устройств
          frameRate: { ideal: 30 },
          aspectRatio: { ideal: 4 / 3 },
        },
      }

      console.log("Запрашиваем доступ к камере с параметрами:", constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log("Доступ к камере получен, треки:", stream.getTracks().length)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Используем промис для воспроизведения
        try {
          await videoRef.current.play()
          console.log("Видео запущено успешно")
        } catch (playError) {
          console.error("Ошибка воспроизведения видео:", playError)
          // Повторная попытка запустить видео с задержкой
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch((err) => console.error("Повторная ошибка воспроизведения:", err))
            }
          }, 500)
        }
      }
    } catch (error) {
      console.error("Ошибка при доступе к камере:", error)
      setCameraError(true)
    }
  }

  // Функция для выбора изображения из галереи
  const selectFromGallery = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    fileInput.click()
  }

  const processImage = async () => {
    if (!selectedImage && !cameraActive) return

    setIsProcessing(true)

    try {
      // Извлекаем base64 из dataURL
      const base64Data = selectedImage?.split(",")[1]
      if (!base64Data) throw new Error("Base64 image data is missing")

      // Конвертируем base64 в blob
      const blob = await (await fetch(selectedImage)).blob()

      const formData = new FormData()
      formData.append("img", blob, "photo.png") // поле должно называться "img", как требует Skiniver

      console.log("Отправка изображения в Skiniver API (детальный анализ)...")

      const response = await apiClient.post("skiniver/predict-detailed", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Статус ответа:", response.status)
      console.log("Данные от Skiniver:", response.data)

      // Сохраняем результат анализа
      const data = response.data

      localStorage.removeItem("skiniver_error")
      localStorage.setItem("skiniver_result", JSON.stringify(data.result))

      setIsProcessing(false)
      navigate("/spark-epidermis-result")
    } catch (error) {
      console.error("Ошибка обработки изображения:", error)
      setIsProcessing(false)

      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      localStorage.setItem("skiniver_error", JSON.stringify({ message: errorMessage }))

      navigate("/spark-epidermis-result")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")

      // Ensure we get proper dimensions
      const width = video.videoWidth || 640
      const height = video.videoHeight || 480

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw the video frame to the canvas
        ctx.drawImage(video, 0, 0, width, height)

        // Convert to image URL
        const imageUrl = canvas.toDataURL("image/png")
        setSelectedImage(imageUrl)

        // Stop the camera stream
        const stream = video.srcObject as MediaStream
        if (stream) {
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }
      }

      setCameraActive(false)
    }
  }

  return (
    <MainLayout>
      {/* Header with gradient background - changed to purple/blue gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2 text-white hover:bg-white/20">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Назад</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">SparkEpidermis</h1>
              <p className="text-blue-100">Анализ состояния эпидермиса</p>
            </div>
          </div>

          {/* History button */}
          {historyData.length > 0 && (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 flex items-center gap-1"
              onClick={() => setHistoryOpen(!historyOpen)}
            >
              <Clock className="h-4 w-4" />
              <span>История</span>
              {historyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </motion.div>

        {/* History dropdown */}
        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <h3 className="text-white text-sm font-medium mb-2">История анализов</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isLoadingHistory ? (
                    <div className="text-white/70 text-center py-2">Загрузка истории...</div>
                  ) : historyData.length === 0 ? (
                    <div className="text-white/70 text-center py-2">История пуста</div>
                  ) : (
                    historyData.map((item) => (
                      <motion.button
                        key={item.id}
                        className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left flex items-center justify-between transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => viewHistoryItem(item)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-md bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image_url})` }}
                          />
                          <div>
                            <p className="text-white font-medium">{item.class}</p>
                            <p className="text-white/70 text-xs">{formatDate(item.check_datetime)}</p>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${item.risk_level === "low" ? "bg-blue-500/20 text-blue-100" : item.risk_level === "medium" ? "bg-purple-500/20 text-purple-100" : "bg-red-500/20 text-red-100"}`}
                        >
                          {item.risk}
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main content area */}
      <div className="px-4 py-12">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-center mb-2 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Диагностика эпидермиса
          </motion.h1>

          <motion.p
            className="text-center text-muted-foreground mb-4 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Получите профессиональную оценку состояния верхнего слоя кожи и персональные рекомендации
          </motion.p>
          <motion.div
            className="max-w-md mx-auto mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert className="bg-purple-50 border-purple-200">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertTitle className="text-purple-800">Для лучшего результата</AlertTitle>
              <AlertDescription className="text-purple-700">
                Сделайте четкое фото проблемного участка кожи крупным планом при
                хорошем освещении для наиболее точного анализа
              </AlertDescription>
            </Alert>
          </motion.div>

          <motion.div
            className="flex gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-muted-foreground">Безопасно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-muted-foreground">Точно</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {cameraActive ? (
              <motion.div
                key="camera"
                className="mb-6 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square w-full bg-card rounded-2xl overflow-hidden relative shadow-xl border border-border">
                  <div className="w-full h-full flex items-center justify-center text-card-foreground">
                    <div className="text-center p-6">
                      {cameraError ? (
                        <>
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/10 flex items-center justify-center">
                            <Camera className="h-8 w-8 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Камера недоступна</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения или выберите
                            изображение из галереи.
                          </p>
                          <Button variant="outline" className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => setCameraActive(false)}>
                            Вернуться назад
                          </Button>
                        </>
                      ) : (
                        <>
                          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Камера активна</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Расположите исследуемый участок эпидермиса в центре кадра
                          </p>
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                            playsInline
                            autoPlay
                            muted
                            style={{ transform: "scaleX(-1)" }} /* Mirror the camera view */
                            onLoadedMetadata={() => {
                              // Принудительно запустить видео после загрузки метаданных
                              if (videoRef.current) {
                                videoRef.current
                                  .play()
                                  .catch((err) => console.error("Ошибка воспроизведения видео:", err))
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {!cameraError && (
                    <>
                      {/* Target area indicator - smaller for point scanning */}
                      <motion.div
                        className="absolute inset-0 border-4 border-blue-500/30 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />

                      {/* Camera guide - smaller circle for point scanning */}
                      <motion.div
                        className="absolute inset-1/4 border-2 border-dashed border-purple-500/40 rounded-full"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    </>
                  )}
                </div>

                {!cameraError && (
                  <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                    <motion.button
                      className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={capturePhoto}
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white"></div>
                      </div>
                    </motion.button>
                  </div>
                )}

                {!cameraError && (
                  <Button
                    variant="outline"
                    className="absolute -bottom-14 w-full rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => {
                      setCameraActive(false)
                    }}
                  >
                    Отмена
                  </Button>
                )}
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="processing"
                className="mb-6 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square w-full bg-card rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 shadow-lg border border-border">
                  {selectedImage && (
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Выбранное изображение"
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                  )}

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  />

                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                    className="w-20 h-20 rounded-full border-4 border-purple-200 border-t-purple-600 mb-6 z-10"
                  />

                  <motion.div
                    className="z-10 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.p
                      className="text-xl font-medium text-foreground mb-2"
                      animate={{
                        opacity: [0.7, 1, 0.7],
                        transition: {
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      Анализ эпидермиса...
                    </motion.p>
                    <p className="text-sm text-muted-foreground">
                      Наши алгоритмы оценивают состояние верхнего слоя кожи
                    </p>
                  </motion.div>

                  {/* Animated particles */}
                  <motion.div
                    className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-blue-500/70"
                    animate={{
                      y: [0, 30, 0],
                      x: [0, 20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  <motion.div
                    className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-purple-400/60"
                    animate={{
                      y: [0, -40, 0],
                      x: [0, -30, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-400/50"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 40, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: 1,
                    }}
                  />
                </div>
              </motion.div>
            ) : selectedImage ? (
              <motion.div
                key="selected"
                className="mb-6 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square w-full bg-card rounded-2xl overflow-hidden relative shadow-lg border border-border">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Выбранное изображение"
                    className="w-full h-full object-cover"
                  />

                  {/* Scan effect overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <motion.div
                    className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  />

                  {/* Scanning line animation */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-blue-500/70"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Microscope className="h-16 w-16 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Анализ состояния эпидермиса</h3>
                  <p className="text-sm text-muted-foreground">
                    Сделайте фото участка кожи для оценки здоровья эпидермиса и выявления возможных проблем
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      className="h-auto py-8 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center gap-3 w-full rounded-xl shadow-md"
                      onClick={activateCamera}
                    >
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                        <Camera className="h-6 w-6" />
                      </div>
                      <span className="font-medium">Камера</span>
                      <span className="text-xs opacity-80">Сделать фото</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="h-auto py-8 border-border bg-purple-600/10 hover:bg-purple-600/20 text-secondary-foreground flex flex-col items-center gap-3 w-full rounded-xl"
                      onClick={selectFromGallery}
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center mb-1">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <span className="font-medium">Из галереи</span>
                      <span className="text-xs opacity-80">Выбрать фото</span>
                    </Button>
                  </motion.div>
                </div>

                <motion.div
                  className="mt-6 pt-6 border-t border-border text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs text-muted-foreground">
                    Ваши данные защищены и используются только для анализа
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  )
}
