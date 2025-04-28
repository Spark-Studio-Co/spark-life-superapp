"use client";

import type React from "react";

import type { FormikProps } from "formik";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FileUp, X, FileCheck, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "../multistep-form";

interface StepDocumentsProps {
  formik: FormikProps<RegisterFormData>;
}

export const StepDocuments = ({ formik }: StepDocumentsProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const errorVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = (file: File) => {
    // Проверка типа файла (PDF, DOC, DOCX, JPG, PNG)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (allowedTypes.includes(file.type)) {
      formik.setFieldValue("medicalCertificate", file);
    } else {
      alert("Пожалуйста, загрузите файл в формате PDF, DOC, DOCX, JPG или PNG");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    formik.setFieldValue("medicalCertificate", null);
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-xl font-semibold">Медицинские документы</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Загрузите медицинскую справку или другие документы (опционально)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalCertificate" className="text-sm font-medium">
          Медицинская справка
        </Label>

        {!formik.values.medicalCertificate ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUp className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                Перетащите файл сюда или{" "}
                <label
                  htmlFor="file-upload"
                  className="text-primary cursor-pointer hover:underline"
                >
                  выберите файл
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG (до 10 МБ)
              </p>
              <input
                id="file-upload"
                name="medicalCertificate"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="bg-muted/50 rounded-lg p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {formik.values.medicalCertificate.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(
                    formik.values.medicalCertificate.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  МБ
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Удалить файл</span>
            </Button>
          </motion.div>
        )}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg flex gap-3">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Загрузка документов не обязательна</p>
          <p>
            Вы можете пропустить этот шаг и загрузить документы позже в личном
            кабинете. Загруженные документы помогут нам предоставить более
            персонализированные рекомендации.
          </p>
        </div>
      </div>
    </div>
  );
};
