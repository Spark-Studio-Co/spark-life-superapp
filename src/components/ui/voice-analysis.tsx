"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Orb } from "@/components/ui/orb"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Mic } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Вопросы для анализа
const questions = [
    "Как вы себя чувствуете в последнее время?",
    "Что вас беспокоит больше всего на данный момент?",
    "Что приносит вам радость или помогает расслабиться?",
]

// Интерфейс для аудиозаписей
interface AudioRecording {
    url: string;
    blob: Blob;
}

export function VoiceAnalysis() {
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [recordings, setRecordings] = useState<AudioRecording[]>([])
    //@ts-ignore
    const [audioLevel, setAudioLevel] = useState(0)

    // Refs для работы с аудио
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const microphoneStreamRef = useRef<MediaStream | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    // Инициализация компонента
    useEffect(() => {
        // Очистка ресурсов при размонтировании компонента
        return () => {
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [])

    // Функция для начала записи аудио
    const startRecording = async () => {
        try {
            // Запрашиваем доступ к микрофону
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            microphoneStreamRef.current = stream

            // Создаем аудио контекст для анализа громкости
            audioContextRef.current = new AudioContext()
            analyserRef.current = audioContextRef.current.createAnalyser()
            const microphone = audioContextRef.current.createMediaStreamSource(stream)
            microphone.connect(analyserRef.current)
            analyserRef.current.fftSize = 256

            // Очищаем предыдущие части аудио
            audioChunksRef.current = []

            // Создаем медиа рекордер с настройками для MP3
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })

            // Собираем части аудио
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            // Начинаем запись
            mediaRecorderRef.current.start()
            setIsRecording(true)

            // Анализируем громкость для анимации орба
            const analyzeVolume = () => {
                if (!analyserRef.current || !isRecording) return

                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
                analyserRef.current.getByteFrequencyData(dataArray)

                // Вычисляем среднюю громкость
                const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
                const normalizedVolume = Math.min(average / 128, 1)
                setAudioLevel(normalizedVolume)

                if (isRecording) {
                    requestAnimationFrame(analyzeVolume)
                }
            }

            analyzeVolume()
        } catch (error) {
            console.error("Ошибка при запуске записи:", error)
            toast({
                title: "Ошибка доступа к микрофону",
                description: "Пожалуйста, предоставьте доступ к микрофону для записи голоса.",
                variant: "destructive",
            })
        }
    }

    // Функция для остановки записи и сохранения аудио
    const stopRecording = () => {
        if (!mediaRecorderRef.current) return

        setIsRecording(false)
        setIsProcessing(true)

        // Останавливаем запись
        mediaRecorderRef.current.stop()

        // Обрабатываем записанное аудио после остановки
        mediaRecorderRef.current.onstop = () => {
            // Создаем блоб из записанных частей
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

            // Создаем URL для аудио
            const audioUrl = URL.createObjectURL(audioBlob)

            // Сохраняем запись
            const newRecordings = [...recordings]
            newRecordings[currentStep] = { url: audioUrl, blob: audioBlob }
            setRecordings(newRecordings)

            console.log(`Запись для вопроса ${currentStep + 1} сохранена:`, audioUrl)

            // Освобождаем ресурсы
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach(track => track.stop())
            }

            // Даем возможность прослушать запись перед переходом к следующему вопросу
            setTimeout(() => {
                setIsProcessing(false)

                // Добавляем кнопку для перехода к следующему вопросу вместо автоматического перехода
                // Пользователь сможет прослушать запись и решить, когда идти дальше
                // Переход к следующему шагу будет происходить при нажатии на сферу
            }, 1000)
        }
    }

    // Функция для отправки аудиозаписей на сервер
    const submitRecordings = async (finalRecordings: AudioRecording[]) => {
        setIsSubmitting(true)

        try {
            // Здесь будет реальный запрос к API
            console.log("Отправка аудиозаписей на сервер:", finalRecordings.map(r => r.url))

            // Здесь можно было бы отправить файлы на сервер через FormData
            // const formData = new FormData()
            // finalRecordings.forEach((recording, index) => {
            //     formData.append(`audio_${index}`, recording.blob, `question_${index}.webm`)
            // })
            // await fetch('/api/submit-audio', { method: 'POST', body: formData })

            // Имитация запроса к серверу
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setIsComplete(true)
        } catch (error) {
            console.error("Ошибка при отправке данных:", error)
            toast({
                title: "Ошибка при отправке аудио",
                description: "Пожалуйста, попробуйте снова позже.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Функция для перезапуска анализа
    const restartAnalysis = () => {
        setCurrentStep(0)
        setRecordings([])
        setIsComplete(false)

        // Освобождаем URL аудиозаписей
        recordings.forEach(recording => {
            if (recording.url) {
                URL.revokeObjectURL(recording.url)
            }
        })
    }

    // Вычисляем цвет орба в зависимости от текущего шага
    const getOrbColor = () => {
        // Синий -> Фиолетовый -> Зеленый
        const colors = ["#3b82f6"]
        return colors[currentStep]
    }

    return (
        <div className="relative flex flex-col items-center px-4 pt-10">
            <AnimatePresence mode="wait">
                {!isComplete ? (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center w-full"
                    >
                        <motion.h2
                            className="text-xl font-semibold text-center mb-8"
                            key={`question-${currentStep}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {questions[currentStep]}
                        </motion.h2>

                        <div className="relative flex flex-col justify-center items-center">
                            <Orb
                                size={300}
                                color={getOrbColor()}
                                speed={isRecording ? 2 : 1}
                                onClick={() => {
                                    if (isRecording) {
                                        stopRecording();
                                    } else if (!isProcessing && !recordings[currentStep]) {
                                        startRecording();
                                    } else if (!isProcessing && recordings[currentStep]) {
                                        // Если уже есть запись и мы нажимаем на сферу, переходим к следующему вопросу
                                        if (currentStep < questions.length - 1) {
                                            setCurrentStep(currentStep + 1);
                                        } else {
                                            // Если это был последний вопрос, отправляем данные
                                            submitRecordings(recordings);
                                        }
                                    }
                                }}
                                className="cursor-pointer mb-4 relative z-0"
                            />

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                {isRecording ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                                    >
                                        <Mic className="h-12 w-12 text-white" />
                                    </motion.div>
                                ) : isProcessing ? (
                                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                                ) : recordings[currentStep] ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-primary/20 rounded-full p-2"
                                    >
                                        <Mic className="h-8 w-8 text-white" />
                                    </motion.div>
                                ) : (
                                    <Mic className="h-12 w-12 text-white" />
                                )}
                            </div>

                            {/* Инструкция для пользователя */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-sm text-muted-foreground mt-4"
                            >
                                {isRecording ?
                                    "Говорите... Нажмите на сферу, чтобы остановить запись." :
                                    recordings[currentStep] ?
                                        "Прослушайте запись. Нажмите на сферу, чтобы продолжить." :
                                        "Нажмите на сферу, чтобы начать запись голоса."}
                            </motion.p>
                        </div>

                        <div className="flex justify-between w-full mt-8">
                            {Array.from({ length: questions.length }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full flex-1 mx-1 ${index < currentStep ? "bg-primary" : index === currentStep ? "bg-primary/60" : "bg-muted"
                                        }`}
                                />
                            ))}
                        </div>

                        {isSubmitting && (
                            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center rounded-lg">
                                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                                <p className="text-center text-muted-foreground">Отправка данных...</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                            className="bg-primary/10 rounded-full p-6 mb-6"
                        >
                            <CheckCircle className="h-16 w-16 text-primary" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-2">Спасибо за прохождение!</h2>
                        <p className="text-muted-foreground mb-6">
                            Ваши ответы были успешно отправлены для анализа. Результаты будут доступны в ближайшее время.
                        </p>

                        <Button onClick={restartAnalysis}>Пройти снова</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
