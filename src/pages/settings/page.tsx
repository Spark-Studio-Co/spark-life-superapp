"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/shared/ui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { ChevronLeft, Save, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/entities/user/hooks/use-user"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export const SettingsPage = () => {
    const { user, isLoading, isError, refetch } = useUser()
    const { toast } = useToast()
    const [isSaving, setIsSaving] = useState(false)

    // Состояние для хранения редактируемых данных
    const [formData, setFormData] = useState({
        age: user?.age || "",
        gender: user?.gender || "",
        height: user?.height || "",
        weight: user?.weight || "",
        diseases: user?.diseases || [],
    })

    // Состояние для нового заболевания
    const [newDisease, setNewDisease] = useState("")

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    // Обработчик изменения полей формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        
        // Проверка для числовых полей
        if (name === 'age' || name === 'height' || name === 'weight') {
            // Если значение пустое, разрешаем его
            if (value === '') {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }))
                return
            }
            
            // Преобразуем в число
            const numValue = parseFloat(value)
            
            // Проверяем, что это действительно число и оно не отрицательное
            if (!isNaN(numValue) && numValue >= 0) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }))
            }
            // Если значение отрицательное или не является числом, не обновляем состояние
        } else {
            // Для нечисловых полей обрабатываем как обычно
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    // Обработчик изменения пола
    const handleGenderChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            gender: value,
        }))
    }

    // Обработчик добавления заболевания
    const handleAddDisease = () => {
        if (newDisease.trim()) {
            setFormData((prev) => ({
                ...prev,
                diseases: [...prev.diseases, newDisease.trim()],
            }))
            setNewDisease("")
        }
    }

    // Обработчик удаления заболевания
    const handleRemoveDisease = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            diseases: prev.diseases.filter((_, i) => i !== index),
        }))
    }

    // Обработчик сохранения настроек
    const handleSaveSettings = () => {
        setIsSaving(true)
        // Имитация сохранения настроек
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Настройки сохранены",
                description: "Ваши медицинские данные были успешно обновлены",
            })
        }, 1000)
    }

    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
                <div className="flex items-center gap-2">
                    <Link to="/profile" className="text-white">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Настройки</h1>
                        <p className="text-blue-100">Редактирование медицинской информации</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    {isError ? (
                        <motion.div variants={itemVariants} className="text-center py-8">
                            <p className="text-gray-500 mb-4">Не удалось загрузить данные</p>
                            <Button variant="outline" onClick={() => refetch()} className="mx-auto flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Повторить загрузку
                            </Button>
                        </motion.div>
                    ) : (
                        <>
                            {/* Медицинская информация */}
                            <motion.div variants={itemVariants}>
                                <Card className="border-none shadow-md overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center justify-between">
                                            <span>Медицинская информация</span>
                                            {user?.role && (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                                                    {user.role}
                                                </Badge>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {isLoading ? (
                                            <>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="py-2">
                                                        <Skeleton className="h-4 w-full" />
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <Label htmlFor="age" className="text-gray-500">
                                                        Возраст
                                                    </Label>
                                                    <Input
                                                        id="age"
                                                        name="age"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Не указан"
                                                        value={formData.age}
                                                        onChange={handleChange}
                                                        className="border-gray-200"
                                                    />
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label htmlFor="gender" className="text-gray-500">
                                                        Пол
                                                    </Label>
                                                    <Select value={formData.gender} onValueChange={handleGenderChange}>
                                                        <SelectTrigger id="gender" className="w-full border-gray-200">
                                                            <SelectValue placeholder="Не указан" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="male">Мужской</SelectItem>
                                                            <SelectItem value="female">Женский</SelectItem>
                                                            <SelectItem value="other">Другой</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label htmlFor="height" className="text-gray-500">
                                                        Рост (см)
                                                    </Label>
                                                    <Input
                                                        id="height"
                                                        name="height"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Не указан"
                                                        value={formData.height}
                                                        onChange={handleChange}
                                                        className="border-gray-200"
                                                    />
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label htmlFor="weight" className="text-gray-500">
                                                        Вес (кг)
                                                    </Label>
                                                    <Input
                                                        id="weight"
                                                        name="weight"
                                                        type="number"
                                                        min="0"
                                                        placeholder="Не указан"
                                                        value={formData.weight}
                                                        onChange={handleChange}
                                                        className="border-gray-200"
                                                    />
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <Label className="text-gray-500">Заболевания</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {formData.diseases.length > 0 ? (
                                                            formData.diseases.map((disease, index) => (
                                                                <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                                                    {disease}
                                                                    <button
                                                                        onClick={() => handleRemoveDisease(index)}
                                                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">Не указаны</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Добавить заболевание"
                                                            value={newDisease}
                                                            onChange={(e) => setNewDisease(e.target.value)}
                                                            className="border-gray-200"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault()
                                                                    handleAddDisease()
                                                                }
                                                            }}
                                                        />
                                                        <Button variant="outline" onClick={handleAddDisease} disabled={!newDisease.trim()}>
                                                            Добавить
                                                        </Button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Кнопка сохранения */}
                            <motion.div variants={itemVariants} className="pb-16">
                                <Button
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                    onClick={handleSaveSettings}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Сохранение...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Сохранить изменения
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </div>
        </MainLayout>
    )
}
