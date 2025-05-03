"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, ImageIcon, Shield, Activity, ArrowLeft, Info, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "@/shared/ui/layout"
import { apiClient } from "@/shared/api/apiClient"

interface HistoryItem {
    id: number;
    user_id: number;
    result: {
        time: number;
        image: {
            width: number;
            height: number;
        };
        predictions: Array<{
            x: number;
            y: number;
            class: string;
            width: number;
            height: number;
            class_id: number;
            confidence: number;
            detection_id: string;
        }>;
        inference_id: string;
    };
    image_url: string;
    created_at: string;
}


export default function SparkTeeth() {
    const navigation = useNavigate()
    const videoRef = useRef<HTMLVideoElement>(null)
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
            // Fetch dental check history from API
            const response = await apiClient.get("/dental-check/history")
            setHistoryData(response.data)
        } catch (error) {
            console.error("Ошибка при загрузке истории:", error)
        } finally {
            setIsLoadingHistory(false)
        }
    }

    // Function to format date in a readable way
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Function to view a specific history item
    const viewHistoryItem = (item: HistoryItem) => {
        // Save the selected history item to localStorage
        localStorage.setItem('sparkteeth_result', JSON.stringify(item))
        // Navigate to the result page
        navigation('/spark-teeth-result')
    }

    // Очистка ресурсов камеры при размонтировании компонента
    useEffect(() => {
        return () => {
            // Остановка всех медиа-треков при размонтировании компонента
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    // Остановка камеры при переходе на другую страницу или закрытии приложения
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
                setCameraActive(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const activateCamera = async () => {
        try {
            // Остановка предыдущей сессии камеры, если она существует
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
                videoRef.current.srcObject = null; // Явно очищаем srcObject
            }

            setCameraActive(true)
            setCameraError(false)

            // Оптимизированные настройки для WebView
            const constraints = {
                video: {
                    facingMode: "user", // Используем фронтальную камеру для зубов
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 },
                    aspectRatio: { ideal: 4 / 3 }
                }
            }

            console.log('Запрашиваем доступ к камере с параметрами:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            console.log('Доступ к камере получен, треки:', stream.getTracks().length);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Используем промис для воспроизведения
                try {
                    await videoRef.current.play();
                    console.log('Видео запущено успешно');
                } catch (playError) {
                    console.error('Ошибка воспроизведения видео:', playError);
                    // Повторная попытка запустить видео с задержкой
                    setTimeout(() => {
                        if (videoRef.current) {
                            videoRef.current.play()
                                .catch(err => console.error('Повторная ошибка воспроизведения:', err));
                        }
                    }, 500);
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
            formData.append("file", blob, "photo.png")

            console.log("Отправка изображения в API...")

            // Отправляем запрос на API
            const response = await apiClient.post(
                "dental-check/analyze",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            console.log("Статус ответа:", response.status)
            console.log("Данные от API:", response.data)

            // Сохраняем результат анализа
            localStorage.removeItem('sparkteeth_error')
            localStorage.setItem('sparkteeth_result', JSON.stringify(response.data))

            setIsProcessing(false)
            navigation('/spark-teeth-result')
        } catch (error) {
            console.error("Ошибка обработки изображения:", error)

            const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка"
            localStorage.setItem("sparkteeth_error", JSON.stringify({ message: errorMessage }))

            setIsProcessing(false)
            navigation("/spark-teeth-result")
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
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 px-6 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-white/20" onClick={() => navigation('/')}>
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Назад</span>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">SparkTeeth</h1>
                            <p className="text-teal-100 text-sm">Онлайн диагностика полости рта</p>
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
                            {historyOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </motion.div>

                {/* History dropdown */}
                <AnimatePresence>
                    {historyOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
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
                                                        <p className="text-white font-medium">
                                                            {item.result.predictions.length > 0
                                                                ? `${item.result.predictions[0].class.charAt(0).toUpperCase() + item.result.predictions[0].class.slice(1)}`
                                                                : "Анализ зубов"}
                                                        </p>
                                                        <p className="text-white/70 text-xs">{formatDate(item.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.result.predictions.length > 0 && item.result.predictions[0].class === 'healthy' ? 'bg-green-500/20 text-green-100' : 'bg-yellow-500/20 text-yellow-100'}`}>
                                                    {item.result.predictions.length > 0 && item.result.predictions[0].class === 'healthy' ? 'Здоровые' : 'Требует внимания'}
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
                        Онлайн диагностика полости рта
                    </motion.h1>

                    <motion.p
                        className="text-center text-muted-foreground mb-4 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Сканируйте полость рта и получите персональные рекомендации от экспертов
                    </motion.p>

                    <motion.div
                        className="flex gap-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Безопасно</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <Activity className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Точно</span>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="max-w-md mx-auto mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Alert className="bg-amber-50 border-amber-200">
                        <Info className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800">Для лучшего результата</AlertTitle>
                        <AlertDescription className="text-amber-700">
                            Сфотографируйте пораженный участок полости рта крупным планом при хорошем освещении.
                        </AlertDescription>
                    </Alert>
                </motion.div>

                <div className="max-w-md mx-auto mb-10">
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
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                                                        <Camera className="h-8 w-8 text-destructive" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">Камера недоступна</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Не удалось получить доступ к камере. Пожалуйста, проверьте разрешения или выберите
                                                        изображение из галереи.
                                                    </p>
                                                    <Button variant="outline" className="mt-2" onClick={() => setCameraActive(false)}>
                                                        Вернуться назад
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                    <p>Камера активна</p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Расположите пораженный участок в центре кадра
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
                                                                videoRef.current.play()
                                                                    .catch(err => console.error('Ошибка воспроизведения видео:', err));
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {!cameraError && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 border-4 border-primary/30 rounded-2xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                }}
                                            />

                                            {/* Hyper-realistic mouth positioning guide */}
                                            <motion.div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <div className="relative w-80 h-60">
                                                    {/* Ultra-realistic mouth SVG - more transparent */}
                                                    <motion.svg
                                                        viewBox="0 0 400 250"
                                                        className="w-full h-full"
                                                        initial={{ scale: 0.95 }}
                                                        animate={{ scale: [0.95, 1.05, 0.95] }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Number.POSITIVE_INFINITY,
                                                        }}
                                                    >
                                                        {/* Background mouth cavity - dark area */}
                                                        <ellipse cx="200" cy="140" rx="100" ry="60" fill="rgba(30, 30, 40, 0.15)" stroke="none" />

                                                        {/* Outer lips with gradient for depth */}
                                                        <path
                                                            d="M100,120 C130,80 180,60 200,60 C220,60 270,80 300,120 C330,160 300,190 200,210 C100,190 70,160 100,120 Z"
                                                            fill="rgba(255, 255, 255, 0.02)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="1.5"
                                                        />

                                                        {/* Lip texture lines - upper lip */}
                                                        <path
                                                            d="M130,90 C150,80 180,75 200,75 C220,75 250,80 270,90"
                                                            stroke="rgba(255, 255, 255, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />
                                                        <path
                                                            d="M140,100 C160,90 180,85 200,85 C220,85 240,90 260,100"
                                                            stroke="rgba(255, 255, 255, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Lip texture lines - lower lip */}
                                                        <path
                                                            d="M130,170 C160,180 180,185 200,185 C220,185 240,180 270,170"
                                                            stroke="rgba(255, 255, 255, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />
                                                        <path
                                                            d="M140,160 C160,170 180,175 200,175 C220,175 240,170 260,160"
                                                            stroke="rgba(255, 255, 255, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Upper lip detail with more natural curve */}
                                                        <path
                                                            d="M120,120 C150,90 180,80 200,80 C220,80 250,90 280,120"
                                                            fill="none"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="1.5"
                                                        />

                                                        {/* Lower lip detail with more natural curve */}
                                                        <path
                                                            d="M120,160 C150,180 180,190 200,190 C220,190 250,180 280,160"
                                                            fill="none"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="1.5"
                                                        />

                                                        {/* Upper gum line with texture */}
                                                        <path
                                                            d="M130,120 C160,100 180,95 200,95 C220,95 240,100 270,120"
                                                            fill="none"
                                                            stroke="rgba(255, 200, 200, 0.3)"
                                                            strokeWidth="1"
                                                        />

                                                        {/* Gum texture lines */}
                                                        <path
                                                            d="M135,115 L135,120 M155,105 L155,110 M175,100 L175,105 M195,98 L195,103 M215,100 L215,105 M235,105 L235,110 M255,115 L255,120"
                                                            stroke="rgba(255, 200, 200, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Lower gum line with texture */}
                                                        <path
                                                            d="M130,160 C160,175 180,180 200,180 C220,180 240,175 270,160"
                                                            fill="none"
                                                            stroke="rgba(255, 200, 200, 0.3)"
                                                            strokeWidth="1"
                                                        />

                                                        {/* Lower gum texture lines */}
                                                        <path
                                                            d="M135,160 L135,165 M155,170 L155,175 M175,175 L175,180 M195,177 L195,182 M215,175 L215,180 M235,170 L235,175 M255,160 L255,165"
                                                            stroke="rgba(255, 200, 200, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Upper teeth - more anatomically correct shapes */}
                                                        {/* Central incisors */}
                                                        <path
                                                            d="M190,120 L190,140 C190,143 193,145 196,145 L204,145 C207,145 210,143 210,140 L210,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Lateral incisors */}
                                                        <path
                                                            d="M170,120 L170,138 C170,141 173,143 176,143 L184,143 C187,143 190,141 190,138 L190,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M210,120 L210,138 C210,141 213,143 216,143 L224,143 C227,143 230,141 230,138 L230,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Canines - slightly pointed */}
                                                        <path
                                                            d="M150,120 L150,136 C150,139 153,142 156,142 L164,142 C167,142 170,139 170,136 L170,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M230,120 L230,136 C230,139 233,142 236,142 L244,142 C247,142 250,139 250,136 L250,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Premolars - wider with slight bumps */}
                                                        <path
                                                            d="M130,120 L130,134 C130,137 133,140 136,140 L144,140 C147,140 150,137 150,134 L150,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M250,120 L250,134 C250,137 253,140 256,140 L264,140 C267,140 270,137 270,134 L270,120"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Lower teeth - more anatomically correct */}
                                                        {/* Central incisors */}
                                                        <path
                                                            d="M190,160 L190,140 C190,137 193,135 196,135 L204,135 C207,135 210,137 210,140 L210,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Lateral incisors */}
                                                        <path
                                                            d="M170,160 L170,142 C170,139 173,137 176,137 L184,137 C187,137 190,139 190,142 L190,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M210,160 L210,142 C210,139 213,137 216,137 L224,137 C227,137 230,139 230,142 L230,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Canines */}
                                                        <path
                                                            d="M150,160 L150,144 C150,141 153,138 156,138 L164,138 C167,138 170,141 170,144 L170,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M230,160 L230,144 C230,141 233,138 236,138 L244,138 C247,138 250,141 250,144 L250,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Premolars */}
                                                        <path
                                                            d="M130,160 L130,146 C130,143 133,140 136,140 L144,140 C147,140 150,143 150,146 L150,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />
                                                        <path
                                                            d="M250,160 L250,146 C250,143 253,140 256,140 L264,140 C267,140 270,143 270,146 L270,160"
                                                            fill="rgba(255, 255, 255, 0.3)"
                                                            stroke="rgba(255, 255, 255, 0.4)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Tooth separation lines */}
                                                        <path
                                                            d="M190,120 L190,140 M210,120 L210,140 M170,120 L170,138 M230,120 L230,138 M150,120 L150,136 M250,120 L250,136 M130,120 L130,134 M270,120 L270,134"
                                                            stroke="rgba(200, 200, 220, 0.25)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />
                                                        <path
                                                            d="M190,160 L190,140 M210,160 L210,140 M170,160 L170,142 M230,160 L230,142 M150,160 L150,144 M250,160 L250,144 M130,160 L130,146 M270,160 L270,146"
                                                            stroke="rgba(200, 200, 220, 0.25)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Realistic tongue */}
                                                        <path
                                                            d="M150,160 C170,175 190,180 200,180 C210,180 230,175 250,160"
                                                            fill="rgba(255, 150, 150, 0.15)"
                                                            stroke="rgba(255, 150, 150, 0.25)"
                                                            strokeWidth="0.75"
                                                        />

                                                        {/* Tongue texture */}
                                                        <path
                                                            d="M170,170 C180,172 190,173 200,173 C210,173 220,172 230,170"
                                                            stroke="rgba(255, 150, 150, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />
                                                        <path
                                                            d="M180,165 C190,167 195,168 200,168 C205,168 210,167 220,165"
                                                            stroke="rgba(255, 150, 150, 0.2)"
                                                            strokeWidth="0.5"
                                                            fill="none"
                                                        />

                                                        {/* Subtle shadows for depth */}
                                                        <path
                                                            d="M130,120 C160,110 180,105 200,105 C220,105 240,110 270,120"
                                                            stroke="rgba(100, 100, 150, 0.1)"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            fill="none"
                                                        />
                                                    </motion.svg>
                                                    {/* Text guide */}
                                                    <div className="absolute -bottom-10 left-0 right-0 text-center text-xs text-white bg-black/30 py-1 px-2 rounded-md">
                                                        Расположите рот по контуру
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </div>

                                {!cameraError && (
                                    <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                                        <motion.button
                                            className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
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
                                        className="absolute -bottom-14 w-full rounded-xl border-border text-foreground hover:bg-secondary"
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
                                            src={selectedImage || "/placeholder.svg?height=400&width=400&query=dental scan"}
                                            alt="Выбранное изображение"
                                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                                        />
                                    )}

                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"
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
                                        className="w-20 h-20 rounded-full border-4 border-secondary border-t-primary mb-6 z-10"
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
                                            Анализ изображения...
                                        </motion.p>
                                        <p className="text-sm text-muted-foreground">Наши алгоритмы изучают состояние полости рта</p>
                                    </motion.div>

                                    {/* Animated particles */}
                                    <motion.div
                                        className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/70"
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
                                        className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-primary/60"
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
                                        className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-primary/50"
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
                                        src={selectedImage || "/placeholder.svg?height=400&width=400&query=dental scan"}
                                        alt="Выбранное изображение"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Scan effect overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />

                                    <motion.div
                                        className="absolute inset-0 border-2 border-primary/30 rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    />

                                    {/* Scanning line animation */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-1 bg-primary/70"
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
                                    <h3 className="text-lg font-medium text-foreground mb-2">Выберите способ сканирования</h3>
                                    <p className="text-sm text-muted-foreground">Сделайте фото или выберите изображение из галереи</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            className="h-auto py-8 bg-primary hover:bg-primary/90 text-primary-foreground flex flex-col items-center gap-3 w-full rounded-xl shadow-md"
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
                                            className="h-auto py-8 border-border bg-secondary hover:bg-secondary/80 text-secondary-foreground flex flex-col items-center gap-3 w-full rounded-xl"
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
