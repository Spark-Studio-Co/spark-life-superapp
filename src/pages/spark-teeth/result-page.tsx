"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, Smile, Frown, Meh } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/shared/ui/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getClinicUrlByAnalysisType } from "@/entities/recommendet-clinics/use-recommended-clinics";

export default function SparkTeethResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve results from localStorage
    const resultData = localStorage.getItem("sparkteeth_result");
    const errorData = localStorage.getItem("sparkteeth_error");

    if (resultData) {
      try {
        const parsedData = JSON.parse(resultData);
        setResult(parsedData);
      } catch (e) {
        setError("Ошибка при обработке данных");
      }
    } else if (errorData) {
      try {
        const parsedError = JSON.parse(errorData);
        setError(parsedError.message || "Произошла ошибка при анализе");
      } catch (e) {
        setError("Неизвестная ошибка");
      }
    } else {
      setError("Нет данных для отображения");
    }

    setLoading(false);
  }, []);

  // Function to get appropriate icon based on diagnosis
  const getDiagnosisIcon = () => {
    if (!result?.explanation?.diagnosis) return Meh;

    const diagnosis = result.explanation.diagnosis.toLowerCase();
    if (diagnosis.includes("здоров") || diagnosis.includes("норм")) {
      return Smile;
    } else if (diagnosis.includes("серьезн") || diagnosis.includes("тяжел")) {
      return Frown;
    }
    return Meh;
  };

  const DiagnosisIcon = getDiagnosisIcon();

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
            className="mr-2 text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Назад</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">SparkTeeth</h1>
            <p className="text-teal-100">Результаты диагностики</p>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"
            />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-red-100 bg-red-50">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle className="text-center text-red-800">Ошибка анализа</CardTitle>
                <CardDescription className="text-center text-red-600">
                  Не удалось обработать изображение
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-red-700 mb-4">{error}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={() => navigate("/spark-teeth")}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Попробовать снова
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6 border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md mb-4"
                  >
                    <DiagnosisIcon className="h-10 w-10 text-blue-500" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-blue-800 text-center">
                    {result?.explanation?.diagnosis || "Результат анализа"}
                  </h2>
                </div>

                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Заключение</h3>
                    <p className="text-gray-600">
                      {result?.explanation?.explanation || "Нет данных"}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Рекомендации</h3>
                    <p className="text-gray-600 mb-4">
                      {result?.explanation?.recommendation || "Нет рекомендаций"}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="bg-gray-50 p-4 flex flex-col">
                  <div className="flex justify-between w-full mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      teeth-disease-m1uob/1
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                      {new Date().toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Результаты анализа не являются медицинским диагнозом. Для точной диагностики обратитесь к врачу.
                  </p>
                </CardFooter>
              </Card>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => navigate(getClinicUrlByAnalysisType("teeth"))}
                >
                  Записаться на прием
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
