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
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "../multistep-form";

interface StepMedicalInfoProps {
  formik: FormikProps<RegisterFormData>;
}

// Список распространенных заболеваний
const commonDiseases = [
  "Гипертония",
  "Сахарный диабет",
  "Астма",
  "Артрит",
  "Аллергия",
  "Сердечно-сосудистые заболевания",
  "Заболевания щитовидной железы",
  "Мигрень",
  "Депрессия",
  "Тревожное расстройство",
  "Остеохондроз",
  "Бронхит",
  "Гастрит",
  "Язва желудка",
  "Хронический фарингит",
  "Гепатит",
  "Псориаз",
  "Экзема",
  "Глаукома",
  "Катаракта",
];

export const StepMedicalInfo = ({ formik }: StepMedicalInfoProps) => {
  const [newDisease, setNewDisease] = useState("");

  // Animation variants for any potential error messages
  // (Currently not used but kept for future error handling)

  // Обработчик добавления заболевания из списка
  const handleAddDiseaseFromSelect = (value: string) => {
    if (value && !formik.values.diseases.includes(value)) {
      formik.setFieldValue("diseases", [...formik.values.diseases, value]);
    }
  };

  // Обработчик добавления нового заболевания
  const handleAddNewDisease = () => {
    if (newDisease.trim() && !formik.values.diseases.includes(newDisease.trim())) {
      formik.setFieldValue("diseases", [...formik.values.diseases, newDisease.trim()]);
      setNewDisease("");
    }
  };

  // Обработчик удаления заболевания
  const handleRemoveDisease = (disease: string) => {
    formik.setFieldValue(
      "diseases",
      formik.values.diseases.filter((d) => d !== disease)
    );
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
        <Select onValueChange={handleAddDiseaseFromSelect}>
          <SelectTrigger className="h-12 bg-card border-input/50 focus:ring-primary/20 focus:ring-offset-0 focus:border-primary transition-all">
            <SelectValue placeholder="Выберите заболевание" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Распространенные заболевания</SelectLabel>
              {commonDiseases.map((disease) => (
                <SelectItem key={disease} value={disease}>
                  {disease}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Добавить другое заболевание"
            value={newDisease}
            onChange={(e) => setNewDisease(e.target.value)}
            className="h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddNewDisease();
              }
            }}
          />
          <Button 
            type="button" 
            onClick={handleAddNewDisease} 
            disabled={!newDisease.trim()}
            className="flex-shrink-0 h-12"
          >
            Добавить
          </Button>
        </div>

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
                  {disease}
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
