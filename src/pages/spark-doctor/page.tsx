//@ts-nocheck

import { useState, useEffect, useRef } from "react"
import { Camera, ImageIcon, Shield, Activity, ArrowLeft, FileText, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/shared/api/apiClient"
import { MainLayout } from "@/shared/ui/layout"

// Интерфейс для элемента истории анализов документов
interface HistoryItem {
    id: number;
    user_id: number;
    image_url: string;
    result: {
        id: number;
        result: {
            advice: string;
            status: string;
            potential_diagnoses: Array<{
                name: string;
                reason: string;
                recommended_action: string;
            }>;
        };
        user_id: number;
        image_url: string;
        created_at: string;
    };
    created_at: string;
}

export default function SparkDoc() {
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

    // Загрузка истории анализов при монтировании компонента
    useEffect(() => {
        fetchHistoryData()
    }, [])

    // Дополнительная загрузка истории анализов при открытии выпадающего списка
    useEffect(() => {
        if (historyOpen) {
            fetchHistoryData()
        }
    }, [historyOpen])

    // Функция для загрузки истории анализов
    const fetchHistoryData = async () => {
        setIsLoadingHistory(true)
        try {
            // Fetch analysis history from API
            const response = await apiClient.get("/analysis/history")
            console.log("History data from API:", response.data)

            // Преобразуем данные в массив
            let historyItems: HistoryItem[] = []

            if (Array.isArray(response.data)) {
                // If it's already an array, use it directly
                historyItems = response.data
            } else if (response.data && Array.isArray(response.data.data)) {
                // If the data is nested in a 'data' property
                historyItems = response.data.data
            } else {
                // Fallback for other structures
                console.warn("Unexpected API response structure:", response.data)
                historyItems = []
            }

            // Фильтруем дубликаты на основе уникальных идентификаторов
            const uniqueIds = new Set()
            const filteredItems = historyItems.filter(item => {
                // Используем комбинацию id и времени создания для уникальности
                const uniqueKey = `${item.id}_${item.created_at}`
                if (uniqueIds.has(uniqueKey)) {
                    return false // Это дубликат, пропускаем
                }
                uniqueIds.add(uniqueKey)
                return true
            })

            // Сортируем по времени создания (сначала новые)
            const sortedItems = filteredItems.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            })

            setHistoryData(sortedItems)
        } catch (error) {
            console.error("Ошибка при загрузке истории:", error)
            setHistoryData([])
        } finally {
            setIsLoadingHistory(false)
        }
    }

    // Функция для форматирования даты
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    // Функция для просмотра истории анализа
    const viewHistoryItem = (item: HistoryItem) => {
        try {
            console.log('History item to view:', item)

            // Определяем тип для потенциальных диагнозов
            type PotentialDiagnosis = {
                name: string
                reason: string
                recommended_action: string
            }

            // Определяем тип для результата
            type ResultData = {
                id: number
                user_id: number
                image_url: string
                created_at: string
                result: {
                    advice: string
                    status: string
                    potential_diagnoses: PotentialDiagnosis[]
                }
            }

            // Создаем базовый объект результата
            const defaultDiagnosis: PotentialDiagnosis = {
                name: 'Анализ документа',
                reason: 'Данные из истории анализов',
                recommended_action: 'Проконсультируйтесь с врачом по поводу результатов анализа'
            }

            // Формируем объект для результата
            let resultData: ResultData = {
                id: item.id,
                user_id: item.user_id,
                image_url: item.image_url,
                created_at: item.created_at,
                result: {
                    advice: '',
                    status: 'Анализ документа',
                    potential_diagnoses: [defaultDiagnosis]
                }
            }

            // Проверяем структуру данных и используем их, если они есть
            if (item.result) {
                console.log('Processing result data:', item.result)
                
                // Проверяем различные варианты структуры JSON
                
                // Вариант 1: Данные из истории - вложенный объект result.result
                if (item.result.result && typeof item.result.result === 'object') {
                    resultData = {
                        id: item.id,
                        user_id: item.user_id,
                        image_url: item.image_url,
                        created_at: item.created_at,
                        result: {
                            advice: item.result.result.advice || '',
                            status: item.result.result.status || 'Анализ документа',
                            potential_diagnoses: Array.isArray(item.result.result.potential_diagnoses) ? 
                                item.result.result.potential_diagnoses : [defaultDiagnosis]
                        }
                    }
                    console.log('Using nested result structure (history format)')
                } 
                // Вариант 2: Прямой результат анализа - поля находятся непосредственно в item.result
                else if (item.result.advice || item.result.status || (item.result.potential_diagnoses && Array.isArray(item.result.potential_diagnoses))) {
                    resultData = {
                        id: item.id,
                        user_id: item.user_id,
                        image_url: item.image_url,
                        created_at: item.created_at,
                        result: {
                            advice: item.result.advice || '',
                            status: item.result.status || 'Анализ документа',
                            potential_diagnoses: Array.isArray(item.result.potential_diagnoses) ? 
                                item.result.potential_diagnoses : [defaultDiagnosis]
                        }
                    }
                    console.log('Using direct result structure (regular format)')
                }
            }

            console.log('Prepared result data for localStorage:', resultData)
            
            // Сохраняем выбранный элемент истории в localStorage
            localStorage.removeItem('document_error')
            localStorage.setItem('document_result', JSON.stringify(resultData))

            // Переходим на страницу результатов
            navigation('/spark-doctor-result')
        } catch (error) {
            console.error('Ошибка при обработке элемента истории:', error)
            localStorage.setItem('document_error', JSON.stringify({ message: 'Ошибка при загрузке данных из истории' }))
            navigation('/spark-doctor-result')
        }
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
                    facingMode: "environment", // Используем заднюю камеру для документов
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    // Добавляем дополнительные настройки для мобильных устройств
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
            const blob = await (await fetch(selectedImage!)).blob()

            const formData = new FormData()
            formData.append("image", blob, "document.png")

            console.log("Отправка изображения документа на анализ...")

            // Отправка запроса на API
            try {
                const response = await apiClient.post('/analysis/diagnose-from-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                // Сохраняем результат в localStorage
                localStorage.removeItem('document_error')
                localStorage.setItem('document_result', JSON.stringify(response.data.result))

                setIsProcessing(false)
                navigation('/spark-doctor-result')
            } catch (apiError) {
                console.error("API Error:", apiError)
                throw new Error("Ошибка при анализе документа")
            }
        } catch (error) {
            console.error("Ошибка обработки изображения:", error)
            setIsProcessing(false)

            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            localStorage.setItem("document_error", JSON.stringify({ message: errorMessage }))

            navigation("/spark-doctor-result")
        }
    }

    const capturePhoto = () => {
        if (videoRef.current) {
            try {
                console.log('Запуск захвата фото');
                const video = videoRef.current
                const canvas = document.createElement("canvas")

                // Ensure we get proper dimensions
                const width = video.videoWidth || 640
                const height = video.videoHeight || 480
                console.log(`Размеры видео: ${width}x${height}`);

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext("2d")
                if (ctx) {
                    // Draw the video frame to the canvas
                    ctx.drawImage(video, 0, 0, width, height)

                    // Convert to image URL
                    const imageUrl = canvas.toDataURL("image/png")
                    console.log('Изображение получено, длина:', imageUrl.length);
                    setSelectedImage(imageUrl)

                    // Stop the camera stream
                    const stream = video.srcObject as MediaStream
                    if (stream) {
                        const tracks = stream.getTracks()
                        console.log(`Остановка ${tracks.length} треков камеры`);
                        tracks.forEach(track => {
                            track.stop()
                            console.log(`Трек ${track.kind} остановлен, активен: ${track.readyState}`);
                        })
                    }

                    // Явно очищаем srcObject
                    video.srcObject = null;

                    // Добавляем небольшую задержку перед изменением состояния
                    setTimeout(() => {
                        setCameraActive(false)
                        console.log('Камера деактивирована');
                    }, 100);
                }
            } catch (error) {
                console.error('Ошибка при захвате фото:', error);
                setCameraActive(false);

                // Остановка камеры в случае ошибки
                try {
                    if (videoRef.current && videoRef.current.srcObject) {
                        const stream = videoRef.current.srcObject as MediaStream;
                        if (stream) {
                            const tracks = stream.getTracks();
                            tracks.forEach(track => track.stop());
                        }
                        videoRef.current.srcObject = null;
                    }
                } catch (e) {
                    console.error('Ошибка при остановке камеры:', e);
                }
            }
        }
    }

    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 px-6 pt-8 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2 text-white hover:bg-white/20"
                            onClick={() => navigation(-1)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Назад</span>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">SparkDoc</h1>
                            <p className="text-emerald-100">Анализ медицинских документов</p>
                        </div>
                    </div>

                    {/* История анализов */}
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
                                                    <div className="flex flex-col w-full">
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                {item.result?.result?.potential_diagnoses?.[0]?.name || 
                                                                 item.result?.potential_diagnoses?.[0]?.name || 
                                                                 'Анализ документа'}
                                                            </p>
                                                            <p className="text-white/70 text-xs">{formatDate(item.created_at)}</p>
                                                        </div>
                                                        {/* Проверяем статус в обоих возможных местах */}
                                                        {(item.result?.result?.status || item.result?.status) && (
                                                             <div className={`mt-2 px-2 text-center py-1 rounded-full text-xs font-medium ${(item.result?.result?.status || item.result?.status || '').includes("отклонения")
                                                                 ? "bg-yellow-500/20 text-yellow-100"
                                                                 : "bg-green-500/20 text-green-100"}`}>
                                                                {item.result?.result?.status || item.result?.status}
                                                            </div>
                                                        )}
                                                    </div>
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
                        Анализ медицинских документов
                    </motion.h1>

                    <motion.p
                        className="text-center text-muted-foreground mb-4 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Сфотографируйте медицинский документ и получите расшифровку диагнозов
                    </motion.p>

                    <motion.div
                        className="flex gap-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <Shield className="h-4 w-4 text-emerald-500" />
                            </div>
                            <span className="text-sm text-muted-foreground">Безопасно</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <Activity className="h-4 w-4 text-emerald-500" />
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
                                <div className="aspect-[4/3] w-full bg-card rounded-2xl overflow-hidden relative shadow-xl border border-border">
                                    <div className="w-full h-full flex items-center justify-center text-card-foreground">
                                        <div className="text-center p-6">
                                            {cameraError ? (
                                                <>
                                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                                                        <Camera className="h-8 w-8 text-destructive" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">
                                                        Камера недоступна
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Не удалось получить доступ к камере. Пожалуйста,
                                                        проверьте разрешения или выберите изображение из
                                                        галереи.
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        className="mt-2"
                                                        onClick={() => setCameraActive(false)}
                                                    >
                                                        Вернуться назад
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                    <p>Камера активна</p>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Расположите документ в рамке
                                                    </p>
                                                    <video
                                                        ref={videoRef}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                                        playsInline
                                                        autoPlay
                                                        muted
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
                                                className="absolute inset-0 border-4 border-emerald-500/30 rounded-2xl"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                }}
                                            />

                                            {/* Document guide */}
                                            <motion.div
                                                className="absolute inset-8 border-2 border-dashed border-emerald-500/40 rounded-lg"
                                                initial={{ scale: 0.95 }}
                                                animate={{ scale: [0.95, 1, 0.95] }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                }}
                                            />

                                            {/* Corner markers for document alignment */}
                                            <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-emerald-500/60"></div>
                                            <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-emerald-500/60"></div>
                                            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-emerald-500/60"></div>
                                            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-emerald-500/60"></div>
                                        </>
                                    )}
                                </div>

                                {!cameraError && (
                                    <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                                        <motion.button
                                            className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"
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
                                <div className="aspect-[4/3] w-full bg-card rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 shadow-lg border border-border">
                                    {selectedImage && (
                                        <img
                                            src={selectedImage || "/placeholder.svg?height=400&width=500&query=medical document"}
                                            alt="Выбранное изображение"
                                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                                        />
                                    )}

                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent"
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
                                        className="w-20 h-20 rounded-full border-4 border-secondary border-t-emerald-500 mb-6 z-10"
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
                                            Анализ документа...
                                        </motion.p>
                                        <p className="text-sm text-muted-foreground">
                                            Наши алгоритмы распознают текст и выявляют диагнозы
                                        </p>
                                    </motion.div>

                                    {/* Animated elements */}
                                    <motion.div
                                        className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500/70"
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
                                        className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-emerald-500/60"
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
                                        className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-emerald-500/50"
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
                                <div className="aspect-[4/3] w-full bg-card rounded-2xl overflow-hidden relative shadow-lg border border-border">
                                    <img
                                        src={selectedImage || "/placeholder.svg?height=400&width=500&query=medical document"}
                                        alt="Выбранное изображение"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Scan effect overlay */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />

                                    <motion.div
                                        className="absolute inset-0 border-2 border-emerald-500/30 rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    />

                                    {/* Scanning line animation */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-1 bg-emerald-500/70"
                                        initial={{ top: 0 }}
                                        animate={{ top: "100%" }}
                                        transition={{ duration: 1.5, ease: "linear" }}
                                    />

                                    {/* Process button */}
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                        <Button
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2"
                                            onClick={processImage}
                                        >
                                            Анализировать документ
                                        </Button>
                                    </div>
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
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        Выберите способ сканирования
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Сделайте фото документа или выберите изображение из галереи
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            className="h-auto py-8 bg-emerald-500 hover:bg-emerald-600 text-white flex flex-col items-center gap-3 w-full rounded-xl shadow-md"
                                            onClick={activateCamera}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1">
                                                <Camera className="h-6 w-6" />
                                            </div>
                                            <span className="font-medium">Камера</span>
                                            <span className="text-xs opacity-80">Сделать фото</span>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
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
