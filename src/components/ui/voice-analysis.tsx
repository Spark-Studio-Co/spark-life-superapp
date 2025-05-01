// @ts-nocheck

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orb } from "@/components/ui/orb";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Mic } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { useAuthData } from "@/entities/auth/model/use-auth-store";
import { apiClient } from "@/shared/api/apiClient";

// Вопросы для анализа
const questions = [
  "Как вы себя чувствуете в последнее время?",
  "Что вас беспокоит больше всего на данный момент?",
  "Что приносит вам радость или помогает расслабиться?",
];

interface AudioRecording {
  url: string;
  blob: Blob;
}

export function VoiceAnalysis() {
  const { token } = useAuthData()
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  // Refs для работы с аудио
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Инициализация компонента
  useEffect(() => {
    // Очистка ресурсов при размонтировании компонента
    return () => {
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Функция для начала записи аудио
  const startRecording = async () => {
    try {
      // Запрашиваем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;

      // Создаем аудио контекст для анализа громкости
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone =
        audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Очищаем предыдущие части аудио
      audioChunksRef.current = [];

      // Создаем медиа рекордер с настройками для MP3
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      // Собираем части аудио
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Начинаем запись
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Анализируем громкость для анимации орба
      const analyzeVolume = () => {
        if (!analyserRef.current || !isRecording) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Вычисляем среднюю громкость
        const average =
          dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const normalizedVolume = Math.min(average / 128, 1);
        setAudioLevel(normalizedVolume);

        if (isRecording) {
          requestAnimationFrame(analyzeVolume);
        }
      };

      analyzeVolume();
    } catch (error) {
      console.error("Ошибка при запуске записи:", error);
      toast({
        title: "Ошибка доступа к микрофону",
        description:
          "Пожалуйста, предоставьте доступ к микрофону для записи голоса.",
        variant: "destructive",
      });
    }
  };

  // Функция для остановки записи и сохранения аудио
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);
    setIsProcessing(true);

    // Останавливаем запись
    mediaRecorderRef.current.stop();

    // Обрабатываем записанное аудио после остановки
    mediaRecorderRef.current.onstop = () => {
      // Создаем блоб из записанных частей
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      // Создаем URL для аудио
      const audioUrl = URL.createObjectURL(audioBlob);

      // Сохраняем запись
      const newRecordings = [...recordings];
      newRecordings[currentStep] = { url: audioUrl, blob: audioBlob };
      setRecordings(newRecordings);

      console.log(`Запись для вопроса ${currentStep + 1} сохранена:`, audioUrl);

      // Освобождаем ресурсы
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      setTimeout(() => {
        setIsProcessing(false);

        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1); // Переход на следующий вопрос
        } else {
          submitRecordings([...recordings, { url: audioUrl, blob: audioBlob }]); // Или отправить если последний вопрос
        }
      }, 1000);
    };
  };

  const submitRecordings = async (finalRecordings: AudioRecording[]) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Добавляем каждую запись в formData
      finalRecordings.forEach((recording, index) => {
        formData.append('audios', recording.blob, `audio_${index}.webm`);
      });

      const response = await apiClient.post('/speech-to-text/analyze-anxiety', formData);

      console.log('Ответ от API:', response.data);
      const data = response.data;


      const analysisResults = data;

      // Сохраняем результаты в localStorage
      localStorage.setItem('voice_analysis_results', JSON.stringify(analysisResults));

      // Устанавливаем состояние завершения
      setIsComplete(true);

      setTimeout(() => {
        navigate('/voice-analysis-results');
      }, 1500);

    } catch (error) {
      console.error("Ошибка при отправке данных:", error);

      // Более детальная обработка ошибок Axios
      let errorMessage = "Пожалуйста, попробуйте снова позже.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Сервер вернул ответ со статусом, отличным от 2xx
          console.error("Ошибка ответа:", error.response.data);
          errorMessage = `Ошибка сервера: ${error.response.status}. Попробуйте позже.`;
        } else if (error.request) {
          // Запрос был сделан, но ответ не получен
          console.error("Нет ответа от сервера:", error.request);
          errorMessage = "Нет ответа от сервера. Проверьте подключение к интернету.";
        } else {
          // Произошла ошибка при настройке запроса
          console.error("Ошибка настройки запроса:", error.message);
        }
      }

      toast({
        title: "Ошибка при отправке аудио",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Функция для перезапуска анализа
  const restartAnalysis = () => {
    setCurrentStep(0);
    setRecordings([]);
    setIsComplete(false);

    // Освобождаем URL аудиозаписей
    recordings.forEach((recording) => {
      if (recording.url) {
        URL.revokeObjectURL(recording.url);
      }
    });
  };

  // Вычисляем цвет орба в зависимости от текущего шага
  const getOrbColor = () => {
    // Используем розовый цвет для соответствия теме SparkVoice
    const colors = ["#ec4899"];
    return colors[currentStep];
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isComplete && (
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
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                  >
                    <Mic className="h-12 w-12 text-white" />
                  </motion.div>
                ) : isProcessing ? (
                  <Loader2 className="h-12 w-12 text-white animate-spin" />
                ) : recordings[currentStep] ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-rose-500/20 rounded-full p-2"
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
                {isRecording
                  ? "Говорите... Нажмите на сферу, чтобы остановить запись."
                  : recordings[currentStep]
                    ? "Прослушайте запись. Нажмите на сферу, чтобы продолжить."
                    : "Нажмите на сферу, чтобы начать запись голоса."}
              </motion.p>
            </div>

            <div className="flex justify-between w-full mt-8">
              {Array.from({ length: questions.length }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 mx-1 ${index < currentStep
                    ? "bg-rose-500"
                    : index === currentStep
                      ? "bg-rose-400/60"
                      : "bg-muted"
                    }`}
                />
              ))}
            </div>

            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-50"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 rounded-full border-4 border-pink-300/30 border-t-rose-500 mb-6"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Mic className="h-6 w-6 text-rose-500" />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center font-medium text-rose-500 mb-2"
                >
                  Анализируем ваши ответы
                </motion.p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "200px" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="h-1 bg-gradient-to-r from-rose-500 to-pink-400 rounded-full mt-2"
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    times: [0, 0.5, 1]
                  }}
                  className="text-xs text-muted-foreground mt-6"
                >
                  Это может занять несколько секунд
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
