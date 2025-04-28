"use client";

import type { FormikProps } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { RegisterFormData } from "../multistep-form";

interface StepMedicalInfoProps {
  formik: FormikProps<RegisterFormData>;
}

// Список распространенных заболеваний
const commonDiseases = [
  { value: "hypertension", label: "Гипертония" },
  { value: "diabetes", label: "Сахарный диабет" },
  { value: "asthma", label: "Астма" },
  { value: "arthritis", label: "Артрит" },
  { value: "allergy", label: "Аллергия" },
  { value: "heart_disease", label: "Сердечно-сосудистые заболевания" },
  { value: "thyroid", label: "Заболевания щитовидной железы" },
  { value: "migraine", label: "Мигрень" },
  { value: "depression", label: "Депрессия" },
  { value: "anxiety", label: "Тревожное расстройство" },
  { value: "other", label: "Другое" },
];

export const StepMedicalInfo = ({ formik }: StepMedicalInfoProps) => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

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

  const handleAddDisease = (value: string) => {
    if (value && !formik.values.diseases.includes(value)) {
      formik.setFieldValue("diseases", [...formik.values.diseases, value]);
      setSelectedDisease(null);
    }
  };

  const handleRemoveDisease = (disease: string) => {
    formik.setFieldValue(
      "diseases",
      formik.values.diseases.filter((d) => d !== disease)
    );
  };

  // Получение названия заболевания по значению
  const getDiseaseLabel = (value: string) => {
    const disease = commonDiseases.find((d) => d.value === value);
    return disease ? disease.label : value;
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-xl font-semibold">Медицинская информация</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Укажите имеющиеся у вас заболевания для более персонализированного
          обслуживания
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diseases" className="text-sm font-medium">
          Хронические заболевания
        </Label>
        <Select value={selectedDisease || ""} onValueChange={handleAddDisease}>
          <SelectTrigger className="h-12 bg-card border-input/50 focus:ring-primary/20 focus:ring-offset-0 focus:border-primary transition-all">
            <SelectValue placeholder="Выберите заболевание" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Заболевания</SelectLabel>
              {commonDiseases.map((disease) => (
                <SelectItem key={disease.value} value={disease.value}>
                  {disease.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="mt-4 flex flex-wrap gap-2">
          <AnimatePresence>
            {formik.values.diseases.map((disease) => (
              <motion.div
                key={disease}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                  {getDiseaseLabel(disease)}
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveDisease(disease)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Удалить</span>
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>

          {formik.values.diseases.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Нет выбранных заболеваний
            </p>
          )}
        </div>
      </div>

      {formik.values.diseases.includes("other") && (
        <div className="space-y-2">
          <Label htmlFor="otherDisease" className="text-sm font-medium">
            Укажите другое заболевание
          </Label>
          <Input
            id="otherDisease"
            name="otherDisease"
            placeholder="Опишите ваше заболевание"
            className="h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.otherDisease}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <AnimatePresence>
            {formik.touched.otherDisease && formik.errors.otherDisease && (
              <motion.p
                className="text-sm text-destructive"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {formik.errors.otherDisease}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Примечание:</span> Предоставленная
          медицинская информация является конфиденциальной и будет
          использоваться только для улучшения качества обслуживания. Вы можете
          не указывать заболевания, если не хотите.
        </p>
      </div>
    </div>
  );
};
