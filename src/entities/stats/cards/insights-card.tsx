import { Zap, Info, AlertCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InsightsCard = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Инсайты и рекомендации
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-blue-100 mt-0.5">
            <Info className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">Улучшение сна</h3>
            <p className="text-sm text-gray-500">
              Ваш сон улучшился на 7% за последнюю неделю. Продолжайте ложиться
              спать в одно и то же время.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-amber-100 mt-0.5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium">Недостаточная гидратация</h3>
            <p className="text-sm text-gray-500">
              Вы потребляете в среднем 1.9л воды в день, что составляет 76% от
              рекомендуемой нормы. Старайтесь выпивать стакан воды каждые 2
              часа.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-green-100 mt-0.5">
            <Activity className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <h3 className="font-medium">Стабильная активность</h3>
            <p className="text-sm text-gray-500">
              Ваша физическая активность остается стабильной. Попробуйте
              увеличить интенсивность тренировок для улучшения показателей.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
