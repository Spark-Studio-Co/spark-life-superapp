"use client";

import { useState, useEffect } from "react";
import { Camera, ImageIcon, Shield, Activity, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/ui/layout";

import { useRef } from "react";
import { apiClient } from "@/shared/api/apiClient";

export default function SparkFace() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (selectedImage && !isProcessing) {
      processImage();
    }
  }, [selectedImage]);

  const activateCamera = async () => {
    try {
      setCameraActive(true);
      setCameraError(false);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Ошибка при доступе к камере:", error);
      setCameraError(true);
    }
  };
  // Функция для выбора изображения из галереи
  const selectFromGallery = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const processImage = async () => {
    if (!selectedImage && !cameraActive) return;

    setIsProcessing(true);

    try {
      // Извлекаем base64 из dataURL
      const base64Data = selectedImage?.split(",")[1];
      if (!base64Data) throw new Error("Base64 image data is missing");

      // Конвертируем base64 в blob
      const blob = await (await fetch(selectedImage)).blob();

      const formData = new FormData();
      formData.append("img", blob, "photo.png"); // поле должно называться "img", как требует Skiniver

      console.log("Отправка изображения в Skiniver API...");

      const response = await apiClient.post(
        "skiniver/predict", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Статус ответа:", response.status);
      console.log("Данные от Skiniver:", response.data);

      // Сохраняем результат анализа
      const data = response.data;

      localStorage.removeItem('skiniver_error');
      localStorage.setItem('skiniver_result', JSON.stringify(data.result));

      setIsProcessing(false);
      navigate('/spark-face-result');

      setIsProcessing(false);
      navigate("/spark-face-result");
    } catch (error) {
      console.error("Ошибка обработки изображения:", error);
      setIsProcessing(false);

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      localStorage.setItem("skiniver_error", JSON.stringify({ message: errorMessage }));

      navigate("/spark-face-result");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setSelectedImage(imageUrl);
      }

      setCameraActive(false);
    }
  };
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
            <h1 className="text-2xl font-bold text-white">SparkFace</h1>
            <p className="text-blue-100">Онлайн диагностика кожи</p>
          </div>
        </motion.div>
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
            Онлайн диагностика кожи
          </motion.h1>

          <motion.p
            className="text-center text-muted-foreground mb-4 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Сканируйте кожу и получите персональные рекомендации от экспертов
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
                          <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Камера активна</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Расположите лицо в центре кадра
                          </p>
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                            playsInline
                            autoPlay
                            muted
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

                      {/* Camera guide */}
                      <motion.div
                        className="absolute inset-16 border-2 border-dashed border-primary/40 rounded-full"
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
                      className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={capturePhoto}
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-primary-foreground flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary-foreground"></div>
                      </div>
                    </motion.button>
                  </div>
                )}

                {!cameraError && (
                  <Button
                    variant="outline"
                    className="absolute -bottom-14 w-full rounded-xl border-border text-foreground hover:bg-secondary"
                    onClick={() => {
                      setCameraActive(false);
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
                    <p className="text-sm text-muted-foreground">
                      Наши алгоритмы изучают состояние вашей кожи
                    </p>
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
                    src={selectedImage || "/placeholder.svg"}
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
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Выберите способ сканирования
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Сделайте фото или выберите изображение из галереи
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="h-auto py-8 bg-primary hover:bg-primary/90 text-primary-foreground flex flex-col items-center gap-3 w-full rounded-xl shadow-md"
                      onClick={activateCamera}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-1">
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
  );
}
