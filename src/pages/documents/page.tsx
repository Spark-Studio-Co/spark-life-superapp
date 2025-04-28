"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, FileIcon as FilePdf, FileImage, ArrowLeft, Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { MainLayout } from "@/shared/ui/layout"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

export const DocumentsPage = () => {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            name: "Результаты анализов.pdf",
            date: "15 апреля 2023",
            type: "pdf",
            size: "2.4 MB",
            url: "/documents/results.pdf",
        },
        {
            id: 2,
            name: "Медицинская карта.pdf",
            date: "3 марта 2023",
            type: "pdf",
            size: "4.1 MB",
            url: "/documents/medical-card.pdf",
        },
        {
            id: 3,
            name: "Рентген.jpg",
            date: "28 февраля 2023",
            type: "image",
            size: "1.8 MB",
            url: "/documents/xray.jpg",
        },
        {
            id: 4,
            name: "Справка.docx",
            date: "15 января 2023",
            type: "doc",
            size: "0.9 MB",
            url: "/documents/certificate.docx",
        },
        {
            id: 5,
            name: "Заключение специалиста.pdf",
            date: "10 декабря 2022",
            type: "pdf",
            size: "3.2 MB",
            url: "/documents/specialist-conclusion.pdf",
        },
    ])

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const getFileIcon = (type: string) => {
        switch (type) {
            case "pdf":
                return <FilePdf className="h-5 w-5 text-red-500" />
            case "image":
                return <FileImage className="h-5 w-5 text-blue-500" />
            default:
                return <FileText className="h-5 w-5 text-gray-500" />
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const getFileType = (fileName: string): string => {
        const extension = fileName.split(".").pop()?.toLowerCase() || ""
        if (extension === "pdf") return "pdf"
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) return "image"
        return "doc"
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B"
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        else return (bytes / 1048576).toFixed(1) + " MB"
    }

    const getCurrentDate = (): string => {
        const months = [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
        ]
        const date = new Date()
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }

    const handleUpload = () => {
        if (!selectedFile) return

        setUploadStatus("uploading")

        // Simulate upload process
        setTimeout(() => {
            const newDocument = {
                id: Date.now(),
                name: selectedFile.name,
                date: getCurrentDate(),
                type: getFileType(selectedFile.name),
                size: formatFileSize(selectedFile.size),
                url: URL.createObjectURL(selectedFile), // Create a temporary URL for the file
            }

            setDocuments((prev) => [newDocument, ...prev])
            setUploadStatus("success")

            // Reset after success
            setTimeout(() => {
                setIsUploadDialogOpen(false)
                setSelectedFile(null)
                setUploadStatus("idle")
            }, 1500)
        }, 2000)
    }

    const openFileSelector = () => {
        fileInputRef.current?.click()
    }

    return (
        <MainLayout>
            <div className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] px-4 pt-6 pb-6">
                <div className="flex flex-row items-center">
                    <Link to="/profile">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-8 w-8 text-white" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-white ml-2">Документы</h1>
                </div>
                <p className="text-blue-100">Ваши документы всегда под рукой</p>
            </div>
            <div className="px-4 py-4">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    <motion.div variants={itemVariants} className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Мои документы</h1>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="border-none shadow-md overflow-hidden">
                            <CardHeader className="pb-2 flex flex-row justify-between items-center">
                                <CardTitle className="text-lg">Загруженные документы</CardTitle>
                                <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                                    Загрузить
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {documents.length > 0 ? (
                                    documents.map((doc) => (
                                        <div key={doc.id}>
                                            <div className="flex items-center justify-between py-3">
                                                <div className="flex items-center gap-3">
                                                    {getFileIcon(doc.type)}
                                                    <div>
                                                        <p className="font-medium">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {doc.date} • {doc.size}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:text-primary"
                                                    asChild
                                                >
                                                    <a href={doc.url} download={doc.name}>
                                                        <Download className="h-4 w-4" />
                                                        <span className="sr-only">Скачать {doc.name}</span>
                                                    </a>
                                                </Button>
                                            </div>
                                            <Separator />
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-500">У вас пока нет загруженных документов</p>
                                        <Button variant="outline" className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                                            Загрузить первый документ
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Загрузка документа</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedFile ? (
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getFileIcon(getFileType(selectedFile.name))}
                                    <div>
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedFile(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={openFileSelector}
                            >
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="font-medium">Нажмите для выбора файла</p>
                                <p className="text-xs text-gray-500 mt-1">Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex items-center justify-between">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={uploadStatus === "uploading"}>
                                Отмена
                            </Button>
                        </DialogClose>
                        <Button onClick={handleUpload} disabled={!selectedFile || uploadStatus !== "idle"} className="relative">
                            {uploadStatus === "idle" && "Загрузить"}
                            {uploadStatus === "uploading" && (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Загрузка...
                                </span>
                            )}
                            {uploadStatus === "success" && (
                                <span className="flex items-center gap-2">
                                    <Check className="h-4 w-4" />
                                    Загружено
                                </span>
                            )}
                            {uploadStatus === "error" && "Ошибка"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    )
}
