"use client";

import type { FormikProps } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, MailIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterFormData } from "../multistep-form";

interface StepAddressProps {
  formik: FormikProps<RegisterFormData>;
}

const majorCities = [
  "Алматы",
  "Астана",
  "Шымкент",
  "Караганда",
  "Актобе",
  "Тараз",
  "Павлодар",
  "Усть-Каменогорск",
  "Семей",
  "Атырау",
  "Костанай",
  "Кызылорда",
  "Уральск",
  "Петропавловск",
  "Актау",
  "Кокшетау",
  "Талдыкорган",
  "Темиртау",
  "Туркестан",
  "Экибастуз",
];

export const StepAddress = ({ formik }: StepAddressProps) => {
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

  const handleCityChange = (value: string) => {
    formik.setFieldValue("city", value);
  };

  return (
    <div className="space-y-6 py-2">
      <div>
        <h2 className="text-xl font-semibold">Адрес проживания</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Укажите ваш адрес для получения медицинских услуг
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-sm font-medium">
          Город <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Select
            value={formik.values.city}
            onValueChange={handleCityChange}
            name="city"
          >
            <SelectTrigger className="pl-10 h-12 bg-card border-input/50 focus:ring-primary/20 focus:ring-offset-0 focus:border-primary transition-all">
              <SelectValue placeholder="Выберите город" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {majorCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <AnimatePresence>
          {formik.touched.city && formik.errors.city && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.city}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Адрес <span className="text-destructive">*</span>
        </Label>
        <div className="relative group">
          <Home className="absolute left-3 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="address"
            name="address"
            placeholder="Улица, дом, квартира"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <AnimatePresence>
          {formik.touched.address && formik.errors.address && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.address}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <Label htmlFor="postalCode" className="text-sm font-medium">
          Почтовый индекс <span className="text-destructive">*</span>
        </Label>
        <div className="relative group items-center">
          <MailIcon className="absolute left-3 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="postalCode"
            name="postalCode"
            placeholder="123456"
            className="pl-10 h-12 bg-card border-input/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-all"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
        <AnimatePresence>
          {formik.touched.postalCode && formik.errors.postalCode && (
            <motion.p
              className="text-sm text-destructive"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {formik.errors.postalCode}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm">
          <span className="font-medium">Примечание:</span> Адрес необходим для
          предоставления медицинских услуг на дому и доставки лекарств. Мы
          гарантируем конфиденциальность ваших данных.
        </p>
      </div>
    </div>
  );
};
