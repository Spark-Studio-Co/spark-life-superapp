"use client";

import type React from "react";

import type { FormikProps } from "formik";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "../multistep-form";

interface StepDocumentsProps {
  formik: FormikProps<RegisterFormData>;
}

export const StepDocuments = ({ formik }: StepDocumentsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file?: File) => {
    setFileError(null);

    if (!file) {
      setFileError("Пожалуйста, выберите файл");
      return;
    }

    // Проверяем тип файла (только PDF)
    if (file.type !== "application/pdf") {
      setFileError("Разрешены только PDF файлы");
      return;
    }

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("Размер файла не должен превышать 10MB");
      return;
    }

    // Устанавливаем файл в formik
    formik.setFieldValue("medicalCertificate", file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const selectedFile = formik.values.medicalCertificate;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Загрузка документов</h2>
        <p className="text-gray-500 mb-6">
          Пожалуйста, загрузите медицинскую справку в формате PDF (до 10MB)
        </p>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : fileError
              ? "border-red-300 bg-red-50"
              : selectedFile
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            {selectedFile ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-green-700">
                    Файл загружен
                  </p>
                  <p className="text-sm text-gray-500">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    formik.setFieldValue("medicalCertificate", null);
                  }}
                >
                  Удалить файл
                </Button>
              </>
            ) : fileError ? (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <p className="text-lg font-medium text-red-700">Ошибка</p>
                  <p className="text-sm text-red-500">{fileError}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileError(null);
                  }}
                >
                  Попробовать снова
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <p className="text-lg font-medium">Перетащите файл сюда</p>
                  <p className="text-sm text-gray-500">
                    или нажмите для выбора
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Только PDF файлы (до 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Требования к документу:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>
              Медицинская справка должна быть действительной (не просрочена)
            </li>
            <li>Документ должен содержать печать медицинского учреждения</li>
            <li>Все страницы должны быть четко отсканированы</li>
            <li>Файл должен быть в формате PDF</li>
            <li>Размер файла не должен превышать 10MB</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
